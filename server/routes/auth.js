import express from 'express';
import { pca, REDIRECT_URI, SCOPES } from '../config/msalConfig.js';
import { Client } from '@microsoft/microsoft-graph-client';
import { generateToken } from '../middleware/auth.js';
import db from '../db/database.js';

const router = express.Router();

/**
 * GET /api/auth/signin
 * Initiates Microsoft OAuth login
 */
router.get('/signin', async (req, res) => {
  try {
    const authCodeUrlParameters = {
      scopes: SCOPES,
      redirectUri: REDIRECT_URI,
    };

    const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to initiate authentication' });
  }
});

/**
 * GET /api/auth/callback
 * Handles OAuth callback from Microsoft
 */
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('Auth error:', error);
    return res.status(400).json({ error: 'Authentication failed', details: error });
  }

  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }

  try {
    // Exchange authorization code for tokens
    const tokenRequest = {
      code,
      scopes: SCOPES,
      redirectUri: REDIRECT_URI,
    };

    const response = await pca.acquireTokenByCode(tokenRequest);

    if (!response || !response.accessToken) {
      throw new Error('Failed to acquire access token');
    }

    // Create Microsoft Graph client
    const client = Client.init({
      authProvider: (done) => {
        done(null, response.accessToken);
      },
    });

    // Get user info from Microsoft Graph
    const graphUser = await client.api('/me').get();

    // Check if user exists in database
    let employee = db.prepare('SELECT * FROM employees WHERE email = ? OR user_id = ?').get(
      graphUser.mail || graphUser.userPrincipalName,
      graphUser.id
    );

    // If user doesn't exist, create them
    if (!employee) {
      const nameParts = (graphUser.displayName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const insert = db.prepare(`
        INSERT INTO employees (first_name, last_name, email, user_id)
        VALUES (?, ?, ?, ?)
      `);

      const result = insert.run(
        firstName,
        lastName,
        graphUser.mail || graphUser.userPrincipalName,
        graphUser.id
      );

      employee = db.prepare('SELECT * FROM employees WHERE employee_id = ?').get(result.lastInsertRowid);
    } else {
      // Update user_id if it was missing
      if (!employee.user_id && graphUser.id) {
        db.prepare('UPDATE employees SET user_id = ? WHERE employee_id = ?').run(
          graphUser.id,
          employee.employee_id
        );
        employee.user_id = graphUser.id;
      }
    }

    // Generate JWT token
    const token = generateToken(employee.employee_id, employee.email);

    // Return token and user info
    // In production, you might want to redirect to frontend with token in query param or set as httpOnly cookie
    res.json({
      token,
      user: {
        employee_id: employee.employee_id,
        email: employee.email,
        first_name: employee.first_name,
        last_name: employee.last_name,
        team_id: employee.team_id,
        department_id: employee.department_id,
        points_total: employee.points_total,
      },
    });
  } catch (error) {
    console.error('Error in auth callback:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

export default router;


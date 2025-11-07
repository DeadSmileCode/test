import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { Client } from '@microsoft/microsoft-graph-client';
import db from '../db/database.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/user/me
 * Get current user's profile from local database
 */
router.get('/me', (req, res) => {
  try {
    const employee = db
      .prepare('SELECT * FROM employees WHERE employee_id = ?')
      .get(req.user.employee_id);

    if (!employee) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      team_id: employee.team_id,
      department_id: employee.department_id,
      role: employee.role,
      points_total: employee.points_total,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

/**
 * GET /api/user/me/photo
 * Get user's profile photo from Microsoft Graph
 * Note: This requires storing the access token or refreshing it
 * For now, this is a placeholder that would need token refresh logic
 */
router.get('/me/photo', async (req, res) => {
  try {
    // In a real implementation, you would need to:
    // 1. Store refresh tokens in the database
    // 2. Refresh the access token when needed
    // 3. Use that token to call Microsoft Graph
    
    // For now, return an error indicating this needs token management
    res.status(501).json({ 
      error: 'Photo endpoint requires token refresh implementation',
      message: 'This endpoint requires storing and refreshing Microsoft access tokens'
    });
    
    // Example implementation (when tokens are available):
    // const client = Client.init({
    //   authProvider: (done) => {
    //     done(null, accessToken);
    //   },
    // });
    // const photo = await client.api('/me/photo/$value').get();
    // res.set('Content-Type', 'image/jpeg');
    // res.send(photo);
  } catch (error) {
    console.error('Error fetching user photo:', error);
    res.status(500).json({ error: 'Failed to fetch user photo' });
  }
});

export default router;


import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { Client } from '@microsoft/microsoft-graph-client';
import db from '../db/database.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/user/me/team
 * Get current user's team information from Microsoft Graph
 * Note: This requires storing the access token or refreshing it
 */
router.get('/me/team', async (req, res) => {
  try {
    // Get user from database
    const employee = db
      .prepare('SELECT * FROM employees WHERE employee_id = ?')
      .get(req.user.employee_id);

    if (!employee || !employee.user_id) {
      return res.status(404).json({ error: 'User not found or Microsoft ID not linked' });
    }

    // In a real implementation, you would need to:
    // 1. Store refresh tokens in the database
    // 2. Refresh the access token when needed
    // 3. Use that token to call Microsoft Graph
    
    // For now, return team info from local database if available
    if (employee.team_id) {
      const team = db.prepare('SELECT * FROM teams WHERE team_id = ?').get(employee.team_id);
      const teamMembers = db
        .prepare('SELECT employee_id, first_name, last_name, email FROM employees WHERE team_id = ?')
        .all(employee.team_id);

      return res.json({
        team_id: team.team_id,
        team_name: team.team_name,
        department_id: team.department_id,
        team_score: team.team_score,
        co2_reduction_kg: team.co2_reduction_kg,
        members: teamMembers.map(m => ({
          email: m.email,
          name: `${m.first_name || ''} ${m.last_name || ''}`.trim() || m.email,
        })),
      });
    }

    // If no team in local DB, return placeholder response
    res.status(501).json({
      error: 'Microsoft Graph integration requires token refresh implementation',
      message: 'To fetch team data from Microsoft Graph, implement token refresh logic',
      local_team_id: employee.team_id || null,
    });

    // Example implementation (when tokens are available):
    // const client = Client.init({
    //   authProvider: (done) => {
    //     done(null, accessToken);
    //   },
    // });
    // 
    // // Get user's groups/teams
    // const memberOf = await client.api('/me/memberOf').get();
    // const teamGroup = memberOf.value.find(g => g['@odata.type'] === '#microsoft.graph.group');
    // 
    // if (!teamGroup) {
    //   return res.status(404).json({ error: 'User is not a member of any team' });
    // }
    // 
    // // Get team members
    // const members = await client.api(`/groups/${teamGroup.id}/members`).get();
    // 
    // res.json({
    //   team_id: teamGroup.id,
    //   team_name: teamGroup.displayName,
    //   members: members.value.map(m => ({
    //     email: m.mail || m.userPrincipalName,
    //     name: m.displayName,
    //   })),
    // });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
});

export default router;


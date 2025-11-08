import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import db from '../db/database.js';

const router = express.Router();

// Все маршруты здесь требуют аутентификации
router.use(authenticateToken);

/**
 * GET /api/teams
 * Получить список всех команд с их суммарным рейтингом
 */
router.get('/', (req, res) => {
	try {
		// Этот SQL-запрос суммирует очки (points_total) всех сотрудников (e)
		// для каждой команды (t) и возвращает результат как 'team_rating'.
		const teams = db.prepare(`
      SELECT
        t.team_id,
        t.team_name,
        COALESCE(SUM(ea.co2_saved_kg), 0) as total_co2_saved_kg
      FROM teams t
      LEFT JOIN employees e ON t.team_id = e.team_id
      LEFT JOIN employee_activities ea ON e.employee_id = ea.employee_id AND ea.status = 'approved'
      GROUP BY t.team_id
      ORDER BY total_co2_saved_kg DESC
    `).all();
		
		res.json(teams);

	} catch (error) {
		console.error('Error fetching teams:', error);
		res.status(500).json({ error: 'Failed to fetch teams data' });
	}
});

export default router;
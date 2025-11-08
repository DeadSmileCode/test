import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import db from '../db/database.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/activities
 * Get all available ESG activities
 */
router.get('/', (req, res) => {
  try {
    const activities = db.prepare('SELECT * FROM activities ORDER BY activity_id').all();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

/**
 * POST /api/activities/log
 * Log a completed activity
 */
router.post('/log', (req, res) => {
  try {
    const { activity_id, proof_link } = req.body;

    if (!activity_id) {
      return res.status(400).json({ error: 'activity_id is required' });
    }

    const activity = db.prepare('SELECT * FROM activities WHERE activity_id = ?').get(activity_id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Создаем транзакцию, которая выполнит обе операции
    const logAndAward = db.transaction((data) => {
      // 1. Запись в лог
      const insert = db.prepare(`
        INSERT INTO employee_activities (employee_id, activity_id, proof_link, status, points_awarded, co2_saved_kg)
        VALUES (?, ?, ?, 'approved', ?, ?)
      `);
      const result = insert.run(data.employeeId, data.activityId, data.proof, data.points, data.co2);

      // 2. Обновление счета
      const updatePoints = db.prepare(`
        UPDATE employees SET points_total = points_total + ? WHERE employee_id = ?
      `);
      updatePoints.run(data.points, data.employeeId);

      // Возвращаем ID созданной записи
      return result.lastInsertRowid;
    });

    // Запускаем транзакцию
    const newActivityLogId = logAndAward({
      employeeId: req.user.employee_id,
      activityId: activity_id,
      proof: proof_link || null,
      points: activity.points,
      co2: activity.estimated_co2_saving_kg || 0
    });

    // Получаем созданный лог для ответа клиенту
    const activityLog = db
      .prepare('SELECT * FROM employee_activities WHERE employee_activity_id = ?')
      .get(newActivityLogId);

    res.status(201).json({
      message: 'Activity logged and points awarded successfully!',
      activity_log: activityLog,
    });

  } catch (error) {
    console.error('Error in activity log transaction:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

/**
 * GET /api/activities/my-activities
 * Get current user's logged activities
 */
router.get('/my-activities', (req, res) => {
  try {
    const activities = db
      .prepare(`
        SELECT 
          ea.*,
          a.activity_name,
          a.description,
          a.category
        FROM employee_activities ea
        JOIN activities a ON ea.activity_id = a.activity_id
        WHERE ea.employee_id = ?
        ORDER BY ea.date_logged DESC
      `)
      .all(req.user.employee_id);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

export default router;


// ./server/scripts/seedDatabase.js

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_PATH || join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

console.log('Seeding teams and assigning user...');

// 1. Создаем команды
const teams = [
  { name: 'Eco Warriors', department_id: null },
  { name: 'Green Giants', department_id: null },
  { name: 'Recycle Rangers', department_id: null }
];
const insertTeam = db.prepare('INSERT OR IGNORE INTO teams (team_name, department_id) VALUES (?, ?)');
for (const team of teams) {
  insertTeam.run(team.name, team.department_id);
}
console.log('Teams seeded.');

// 2. Находим ID команды 'Eco Warriors' и нашего тестового пользователя
const teamIdResult = db.prepare("SELECT team_id FROM teams WHERE team_name = 'Eco Warriors'").get();
const testUserResult = db.prepare("SELECT employee_id FROM employees WHERE email = 'test.user@example.com'").get();

// 3. Привязываем пользователя к команде (если они оба существуют)
if (teamIdResult && testUserResult) {
  const updateUserTeam = db.prepare('UPDATE employees SET team_id = ? WHERE employee_id = ?');
  updateUserTeam.run(teamIdResult.team_id, testUserResult.employee_id);
  console.log(`Assigned user ${testUserResult.employee_id} to team ${teamIdResult.team_id}.`);
}
console.log('Seeding database with initial data...');

try {
	console.log('Resetting user points and activities for a clean seed...');
    // Обнуляем все очки у всех сотрудников
    db.exec('UPDATE employees SET points_total = 0');
    // Удаляем все записи о совершенных активностях
    db.exec('DELETE FROM employee_activities');
    console.log('Reset complete.');

    const activities = [
        { name: 'Plant a tree', desc: 'Specify the number of trees you have planted.', category: 'Nature', points: 100, co2: 25.0 },
        { name: 'Recycle Paper', desc: 'Enter the weight of the recycled paper in kilograms.', category: 'Recycling', points: 10, co2: 1.0 },
        { name: 'Dispose of E-waste', desc: 'Attach a photo confirmation of dropping off electronics at a collection point.', category: 'Recycling', points: 150, co2: 5.0 },
        { name: 'Community Cleanup Volunteering', desc: 'Specify the number of hours and attach a photo from the event.', category: 'Community', points: 75, co2: 0.0 },
        { name: 'Use Public Transport', desc: 'Log a week of commuting using public transport instead of a personal car.', category: 'Transport', points: 50, co2: 10.0 }
    ];

    const insertActivity = db.prepare(`
        INSERT OR IGNORE INTO activities (activity_name, description, category, points, estimated_co2_saving_kg)
        VALUES (?, ?, ?, ?, ?)
    `);

    for (const activity of activities) {
        insertActivity.run(activity.name, activity.desc, activity.category, activity.points, activity.co2);
    }

    console.log('Successfully seeded the activities table.');

} catch (error) {
    console.error('Failed to seed database:', error);
} finally {
    db.close();
}
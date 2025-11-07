import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_PATH || join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

console.log('Initializing database...');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Stores general ESG data for the company/organization per year
  CREATE TABLE IF NOT EXISTS esg_data (
    esg_data_id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    scope1_tco2 REAL,
    scope2_tco2 REAL,
    scope3_tco2 REAL,
    renewable_energy_percentage REAL,
    electricity_kwh REAL,
    employee_count INTEGER,
    data_source TEXT
  );

  -- Stores company departments
  CREATE TABLE IF NOT EXISTS departments (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL,
    department_score REAL DEFAULT 0,
    annual_co2_tons REAL,
    energy_kwh REAL
  );

  -- Stores teams within departments
  CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL,
    department_id INTEGER,
    team_score REAL DEFAULT 0,
    co2_reduction_kg REAL DEFAULT 0,
    FOREIGN KEY (department_id) REFERENCES departments (department_id)
  );

  -- Stores individual employees
  CREATE TABLE IF NOT EXISTS employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL UNIQUE,
    team_id INTEGER,
    department_id INTEGER,
    role TEXT,
    points_total INTEGER DEFAULT 0,
    user_id TEXT,
    FOREIGN KEY (team_id) REFERENCES teams (team_id),
    FOREIGN KEY (department_id) REFERENCES departments (department_id)
  );

  -- Defines the gamified activities users can perform
  CREATE TABLE IF NOT EXISTS activities (
    activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    points INTEGER NOT NULL,
    estimated_co2_saving_kg REAL
  );

  -- A log of completed activities by employees
  CREATE TABLE IF NOT EXISTS employee_activities (
    employee_activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    date_logged TEXT DEFAULT CURRENT_TIMESTAMP,
    proof_link TEXT,
    status TEXT DEFAULT 'pending',
    points_awarded INTEGER,
    co2_saved_kg REAL,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id),
    FOREIGN KEY (activity_id) REFERENCES activities (activity_id)
  );

  -- Stores periodic aggregated metrics, useful for dashboards and reporting
  CREATE TABLE IF NOT EXISTS aggregated_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    period TEXT NOT NULL,
    team_id INTEGER,
    total_points INTEGER,
    total_co2_saved_kg REAL,
    energy_consumed_kwh REAL,
    renewable_energy_percentage REAL,
    esg_score REAL,
    FOREIGN KEY (team_id) REFERENCES teams (team_id)
  );
`);

console.log('Database initialized successfully!');
db.close();


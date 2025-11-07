# ESG Gamification API Server

Backend API server for ESG (Environmental, Social, and Governance) gamification web application.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=3001

# Microsoft Azure App Registration Details
AZURE_CLIENT_ID=your-application-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=common
REDIRECT_URI=http://localhost:3001/api/auth/callback

# JWT Configuration
JWT_SECRET=a_very_strong_and_secret_key_change_this_in_production

# Database Configuration
DATABASE_PATH=./database.sqlite
```

### 3. Initialize Database

```bash
npm run init-db
```

This will create the SQLite database file with all required tables.

### 4. Start Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory > App registrations
3. Create a new registration
4. Configure:
   - Redirect URI: `http://localhost:3001/api/auth/callback` (for development)
   - API permissions: Add Microsoft Graph permissions:
     - `User.Read`
     - `User.ReadBasic.All`
     - `Team.ReadBasic.All`
     - `Channel.ReadBasic.All`
   - Generate a client secret
5. Copy the Client ID, Tenant ID, and Client Secret to your `.env` file

## API Endpoints

### Authentication

- `GET /api/auth/signin` - Initiates Microsoft OAuth login
- `GET /api/auth/callback` - OAuth callback handler

### User (Requires Authentication)

- `GET /api/user/me` - Get current user profile
- `GET /api/user/me/photo` - Get user profile photo (requires token refresh implementation)
- `GET /api/user/me/team` - Get user's team information

### Activities (Requires Authentication)

- `GET /api/activities` - Get all available activities
- `POST /api/activities/log` - Log a completed activity
- `GET /api/activities/my-activities` - Get current user's logged activities

### Health Check

- `GET /health` - Server health check

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained after successful Microsoft authentication via `/api/auth/callback`.

## Database Schema

The database includes the following tables:
- `esg_data` - Company ESG metrics per year
- `departments` - Company departments
- `teams` - Teams within departments
- `employees` - Employee records
- `activities` - Available ESG activities
- `employee_activities` - Logged activities by employees
- `aggregated_metrics` - Periodic aggregated metrics

## Notes

- The `/api/user/me/photo` and `/api/user/me/team` endpoints that require Microsoft Graph API calls need token refresh implementation. Currently, they return placeholder responses indicating this requirement.
- For production, implement token refresh logic to store and refresh Microsoft access tokens.


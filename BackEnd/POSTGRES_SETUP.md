# PostgreSQL Setup for AI Sourced Candidates

## Quick Setup

### 1. Install PostgreSQL Package
```bash
npm install pg
```

### 2. Add PostgreSQL Credentials to .env
```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=greathire
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
```

### 3. Install PostgreSQL (Choose One)

#### Option A: Windows Installer
1. Download: https://www.postgresql.org/download/windows/
2. Run installer
3. Default port: 5432
4. Set password for postgres user

#### Option B: Docker (Recommended)
```bash
docker run -d \
  --name greathire-postgres \
  -e POSTGRES_USER=greathire \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=greathire \
  -p 5432:5432 \
  postgres:15-alpine
```

### 4. Run Database Migration
```bash
node setup-postgres.js
```

### 5. Restart Backend Server
```bash
npm run dev
```

## What Changed

### Before (MongoDB)
- AI candidates stored in User collection with `isAISourced: true`
- Mixed with regular job seekers (36K records)
- Storage quota issues (514MB/512MB)

### After (PostgreSQL)
- AI candidates in separate PostgreSQL database
- Clean separation from job seekers
- Proper constraints (email OR phone required)
- Better performance with indexes

## File Structure

```
BackEnd/
├── config/
│   └── postgres.js              # PostgreSQL connection pool
├── models/
│   └── postgres/
│       └── aiSourcedCandidate.model.js  # Candidate model
├── migrations/
│   └── 001_create_ai_sourced_candidates.sql  # DB schema
├── sourcing/
│   └── services/
│       └── autoSourcingService.js  # Updated to use PostgreSQL
└── routes/
    └── admin/
        └── adminSourcing.route.js  # Updated stats endpoint
```

## Testing

1. Trigger auto-sourcing:
```bash
npm run test:auto-sourcing
```

2. Check stats in admin dashboard:
- Navigate to `/admin/ai-sourcing`
- Should show count from PostgreSQL

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: PostgreSQL is not running. Start it:
- Windows: Services → PostgreSQL → Start
- Docker: `docker start greathire-postgres`

### Authentication Error
```
password authentication failed for user
```
**Solution**: Check .env credentials match PostgreSQL user

### Table Not Found
```
relation "ai_sourced_candidates" does not exist
```
**Solution**: Run migration: `node setup-postgres.js`

## Benefits

1. **Storage Savings**: Frees MongoDB space for job seekers
2. **Better Performance**: PostgreSQL optimized for structured data
3. **Data Integrity**: Constraints ensure valid contact info
4. **Separation**: AI candidates don't interfere with job seeker operations
5. **Scalability**: Can handle millions of AI-sourced candidates

## Migration Notes

- Old SourcingCandidate collection (MongoDB) is no longer used
- New candidates go directly to PostgreSQL
- Stats endpoint now reads from PostgreSQL only
- No data migration needed (fresh start)

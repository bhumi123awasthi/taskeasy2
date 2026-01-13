# 🚀 Quick Start: Deploy to Vercel

This backend is now **fully Vercel-ready**. Follow these steps to deploy.

## Prerequisites

- Vercel account: https://vercel.com
- MongoDB Atlas cluster with database user created
- Node.js 18+ installed locally

## Step 1: Get MongoDB Connection String

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click "Connect" on your cluster
3. Select "Drivers" and copy the connection string
4. Replace `<username>`, `<password>`, and `dbname` with your actual values

```
mongodb+srv://username:password@cluster.mongodb.net/taskeasy?appName=Cluster0
```

## Step 2: Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output. You'll need this for the next step.

## Step 3: Set Up Vercel Secrets

```bash
# Install Vercel CLI (if not already)
npm install -g vercel

# Login to Vercel
vercel login

# Add secrets
vercel secrets add MONGODB_URI "<your-mongodb-uri>"
vercel secrets add JWT_SECRET "<your-generated-jwt-secret>"

# Optional: Add your frontend URL
vercel secrets add FRONTEND_URL "https://your-frontend.vercel.app"
```

## Step 4: Deploy to Vercel

```bash
# Deploy to staging (preview)
vercel

# Or deploy directly to production
vercel --prod
```

Vercel will print your deployment URL:
```
Preview URL: https://your-project-random.vercel.app
Production URL: https://your-project.vercel.app (if using --prod)
```

## Step 5: Test the Deployment

```bash
# Test health endpoint
curl https://your-project.vercel.app/api/health

# Should return:
# { "status": "healthy", "timestamp": "...", "environment": "production" }
```

## Step 6: Update Frontend

Update your frontend's API base URL:

```javascript
// .env (frontend)
VITE_API_BASE=https://your-project.vercel.app/api
```

Then redeploy your frontend:

```bash
cd frontend
vercel --prod
```

## Done! 🎉

Your backend is now live on Vercel and your frontend can communicate with it.

---

## Useful Commands

```bash
# View deployment logs
vercel logs --follow

# See all deployments
vercel deployments

# Rollback to previous deployment
vercel rollback

# Update environment variables
vercel env pull    # Pull from Vercel
vercel secrets add KEY value

# Check project settings
vercel project list
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Database connection failed" | Check MONGODB_URI secret is set correctly |
| "CORS error" | Ensure FRONTEND_URL is set to your frontend's actual URL |
| "503 Service Unavailable" | Check MongoDB Atlas IP whitelist includes Vercel |
| Slow responses | Check MongoDB connection pool in `lib/db.js` |

## Read More

- [VERCEL_MIGRATION_GUIDE.md](VERCEL_MIGRATION_GUIDE.md) - Detailed explanation of all changes
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [backend/.env.example](backend/.env.example) - Environment variables reference

---

**You're all set!** The backend is production-ready. 🚀

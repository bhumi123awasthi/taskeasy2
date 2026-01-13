# Vercel Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment (Local Setup)

- [ ] **Node.js version:** >= 18.x installed locally
  ```bash
  node --version
  ```

- [ ] **Dependencies installed:**
  ```bash
  cd backend && npm install
  ```

- [ ] **Environment file created:**
  ```bash
  cd backend
  cp .env.example .env
  # Edit .env with actual values
  ```

- [ ] **MongoDB Atlas accessible:**
  - [ ] MongoDB Atlas account has database created
  - [ ] Database user created with read/write access
  - [ ] IP whitelist includes your local IP
  - [ ] Connection string is correct in .env

- [ ] **JWT Secret generated:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  # Copy output to JWT_SECRET in .env
  ```

- [ ] **Backend starts locally:**
  ```bash
  npm run dev
  # Should print: "TaskEasy Backend Server Started"
  # Should print: "[DB] MongoDB connected successfully"
  ```

- [ ] **Health endpoint works:**
  ```bash
  curl http://localhost:5000/api/health
  # Should return: { "status": "healthy", ... }
  ```

- [ ] **Test an actual API:**
  ```bash
  # Get token first (adjust credentials as needed)
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"password"}'
  
  # Then test projects endpoint:
  curl http://localhost:5000/api/projects \
    -H "Authorization: Bearer <token>"
  # Should return: { "success": true, "projects": [...] }
  ```

---

## Vercel Account Setup

- [ ] **Vercel account created:** https://vercel.com/signup
- [ ] **Vercel CLI installed:**
  ```bash
  npm install -g vercel
  ```

- [ ] **Logged into Vercel:**
  ```bash
  vercel login
  ```

---

## Vercel Project Setup

- [ ] **Vercel project created:**
  ```bash
  cd /path/to/project/root
  vercel
  # Follow prompts to link to GitHub repo or create new project
  ```

- [ ] **Project settings configured in Vercel Dashboard:**
  - [ ] Root Directory: `/` (or empty)
  - [ ] Build Command: Empty (vercel.json handles it)
  - [ ] Output Directory: Empty (vercel.json handles it)

---

## Environment Secrets

Set these in Vercel Dashboard (Settings > Environment Variables):

- [ ] **MONGODB_URI** (Secret)
  ```
  Value: mongodb+srv://username:password@cluster.mongodb.net/dbname?appName=Cluster0
  ```

- [ ] **JWT_SECRET** (Secret)
  ```
  Value: <your-generated-secret-from-above>
  ```

- [ ] **FRONTEND_URL** (Environment Variable, optional for production)
  ```
  Value: https://your-frontend.vercel.app
  ```

- [ ] **NODE_ENV** (Environment Variable)
  ```
  Value: production
  ```

---

## MongoDB Atlas Configuration

- [ ] **IP Whitelist updated:**
  - [ ] MongoDB Atlas Dashboard > Network Access
  - [ ] For development: Add Vercel IP ranges or 0.0.0.0/0
  - [ ] OR: Use Vercel's serverless IP ranges from docs

- [ ] **Connection string tested:**
  ```bash
  # Test locally first:
  MONGODB_URI="<your-connection-string>" npm run dev
  ```

---

## Test Deployment (Staging)

- [ ] **Staging deployment created:**
  ```bash
  vercel
  # This creates a preview deployment
  # URL will be printed: https://<project>-<random>.vercel.app
  ```

- [ ] **Check deployment logs:**
  ```bash
  vercel logs --follow
  ```

- [ ] **Health endpoint works on staging:**
  ```bash
  curl https://your-staging-url.vercel.app/api/health
  # Should return: { "status": "healthy", ... }
  ```

- [ ] **Test an API endpoint on staging:**
  ```bash
  curl https://your-staging-url.vercel.app/api/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"password"}'
  ```

- [ ] **Frontend can reach backend:**
  - [ ] Update frontend `VITE_API_BASE` to staging URL
  - [ ] Test login flow
  - [ ] Verify projects fetch correctly
  - [ ] Check CORS errors in console

---

## Production Deployment

- [ ] **All staging tests passed**

- [ ] **Final environment check:**
  ```bash
  vercel env ls
  # Verify MONGODB_URI, JWT_SECRET, FRONTEND_URL are set
  ```

- [ ] **Production deployment:**
  ```bash
  vercel --prod
  # Creates production deployment
  ```

- [ ] **Verify production health:**
  ```bash
  curl https://your-production-url.vercel.app/api/health
  ```

- [ ] **Update frontend for production:**
  ```bash
  # Set VITE_API_BASE to production backend URL
  VITE_API_BASE=https://your-production-backend.vercel.app/api
  
  # Deploy frontend
  vercel --prod
  ```

---

## Post-Deployment

- [ ] **Test all critical flows:**
  - [ ] User registration
  - [ ] User login
  - [ ] Create project
  - [ ] Fetch projects
  - [ ] Update project
  - [ ] Delete project
  - [ ] Create work item
  - [ ] Fetch work items

- [ ] **Monitor logs for errors:**
  ```bash
  vercel logs --tail
  # Watch for errors in real-time
  ```

- [ ] **Set up monitoring alerts:**
  - [ ] Vercel Dashboard > Integrations
  - [ ] Add Slack/email notifications for failures

- [ ] **Document deployment URLs:**
  ```
  Frontend: https://your-frontend.vercel.app
  Backend: https://your-backend.vercel.app
  API Base: https://your-backend.vercel.app/api
  ```

---

## Troubleshooting

### Deployment fails during build
```bash
# Check local build:
cd backend && npm install

# Check vercel.json is valid JSON:
vercel build --local

# Check buildCommand works:
npm install
```

### "Database connection failed" in production
- [ ] MONGODB_URI is set as Secret (not plain text)
- [ ] IP whitelist in MongoDB Atlas includes Vercel
- [ ] Connection string is correct (no typos)
- [ ] Database user has correct permissions

### "CORS error" from frontend
- [ ] FRONTEND_URL is set in production secrets
- [ ] FRONTEND_URL matches your actual frontend URL
- [ ] Redeploy backend after changing FRONTEND_URL

### "JWT decode error"
- [ ] JWT_SECRET is set and identical locally/production
- [ ] Tokens from staging are not used on production

### Slow API responses
- [ ] Check Vercel analytics for cold starts
- [ ] Monitor MongoDB connection pool
- [ ] Check for N+1 queries in routes

---

## Rollback Procedure

If deployment breaks production:

```bash
# View deployment history:
vercel deployments

# Rollback to previous:
vercel rollback

# Or redeploy specific commit:
vercel --prod
```

---

## Success Criteria

✅ Production is live when:
- [ ] Health endpoint returns 200 with "healthy" status
- [ ] Login API accepts credentials and returns JWT
- [ ] Projects API returns list of projects
- [ ] Frontend loads without CORS errors
- [ ] All user flows work end-to-end

---

**Deployment Status:** Ready for production 🚀

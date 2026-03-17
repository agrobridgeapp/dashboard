# AgroBridge Production Deployment Guide

## Prerequisites

Before deploying to production, ensure ALL critical fixes from the QA audit are completed.

## Step 1: Environment Variables

Set these in Vercel dashboard or `.env.production`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="<generate-secure-random-string>"
JWT_EXPIRES_IN="7d"
REPOSITORY_MODE="prisma"
NEXT_PUBLIC_APP_URL="https://agrobridge.com"
```

Generate JWT_SECRET:
```bash
openssl rand -base64 32
```

## Step 2: Database Migration

```bash
# Push schema to production database
npx prisma migrate deploy

# Verify tables created
npx prisma studio
```

## Step 3: Seed Demo Data (Optional)

```bash
# Create seed script if needed
npm run db:seed
```

## Step 4: Verify Build

```bash
npm run build
npm start

# Test critical flows:
# - Login (demo + production)
# - Farmer registration
# - Contract creation
# - Delivery tracking
```

## Step 5: Deploy to Vercel

```bash
vercel --prod
```

## Post-Deployment Checklist

- [ ] Verify JWT authentication works
- [ ] Test all 8 user role dashboards
- [ ] Verify database connections
- [ ] Check error tracking (Sentry)
- [ ] Monitor performance (Vercel Analytics)
- [ ] Test demo mode still works
- [ ] Verify API rate limiting
- [ ] Check CORS configuration

## Monitoring

Set up alerts for:
- High error rates (>1%)
- Slow API responses (>3s)
- Database connection failures
- Failed authentication attempts (>10/min)

## Rollback Plan

If issues occur:
```bash
vercel rollback
```

Or redeploy previous version:
```bash
git checkout <previous-commit>
vercel --prod

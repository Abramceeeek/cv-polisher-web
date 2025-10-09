# Deployment Guide

## Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (free tier is fine)
- Optional: Google Gemini API key

## Step-by-Step Deployment to Vercel

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CV Polisher Web"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/cv-polisher-web.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Add environment variables (optional):
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `FRONTEND_ORIGIN`: Your production domain
6. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### 3. Configure Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `FRONTEND_ORIGIN` environment variable

### 4. Set Up Environment Variables

In Vercel dashboard:

1. Project Settings → Environment Variables
2. Add variables:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   FRONTEND_ORIGIN=https://your-domain.com
   ```
3. Select environments: Production, Preview, Development
4. Save

### 5. Redeploy

After adding environment variables:

```bash
# Via CLI
vercel --prod

# Or in dashboard
# Deployments → Click "..." → Redeploy
```

## Environment-Specific Configuration

### Production
- Use production Gemini API key
- Set `FRONTEND_ORIGIN` to your production domain
- Enable Vercel Analytics (optional)

### Preview (Staging)
- Can use same API key or separate preview key
- Test new features before production

### Development
- Use `.env.local` file
- Never commit `.env.local` to git

## Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All pages accessible (/, /polisher, /help)
- [ ] Form submission works
- [ ] File download works
- [ ] LaTeX generation successful
- [ ] AI polishing works (if API key set)
- [ ] Fallback polishing works (test without API key)
- [ ] Mobile responsive
- [ ] No console errors

## Monitoring

### Vercel Analytics

Enable in dashboard:
1. Project → Analytics
2. Enable Web Analytics
3. Monitor page views, performance

### Error Tracking

Check Vercel logs:
1. Project → Deployments
2. Click deployment → Function Logs
3. Monitor for API errors

## Troubleshooting

### Build Fails

```bash
# Check build locally first
pnpm build

# If it works locally but fails on Vercel:
# - Check Node.js version (Vercel uses 18.x by default)
# - Verify all dependencies are in package.json
# - Check for environment-specific code
```

### API Route Errors

- Verify environment variables are set correctly
- Check function logs in Vercel dashboard
- Test API route locally: `curl http://localhost:3000/api/polish`

### Rate Limiting Issues

- Rate limiter uses in-memory storage
- Resets on each deployment
- For production, consider Redis-backed rate limiting

## Updating the Application

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys on push to main
```

## Rolling Back

In Vercel dashboard:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Custom Domain Setup

### Add Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `cv-polisher.yourdomain.com`)

### DNS Configuration

#### Option A: Vercel Nameservers
1. Update your domain's nameservers to Vercel's
2. Vercel manages all DNS

#### Option B: Custom DNS
Add these records to your DNS provider:

```
Type: CNAME
Name: cv-polisher (or @)
Value: cname.vercel-dns.com
```

### SSL Certificate

- Automatically provisioned by Vercel
- No configuration needed
- Renews automatically

## Performance Optimization

### Enable Caching

Headers are already configured in `next.config.js`:
```javascript
async headers() {
  return [{
    source: '/api/:path*',
    headers: [/* CORS and cache headers */]
  }]
}
```

### Image Optimization

If you add images later:
- Use Next.js `<Image>` component
- Vercel automatically optimizes

### Edge Functions

Current API routes use Node.js runtime (required for Gemini SDK).
For faster response times, consider:
- Edge-compatible polishing alternative
- CDN caching for static assets

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Rotate API keys periodically

2. **Rate Limiting**
   - Current: 5 req/5min per IP
   - Monitor and adjust as needed

3. **CORS**
   - Set `FRONTEND_ORIGIN` properly
   - Don't use `*` in production

4. **Input Validation**
   - Already implemented in API route
   - Client-side validation in form

## Scaling Considerations

Current architecture handles:
- ~1000 requests/day comfortably on free tier
- Serverless functions scale automatically

For higher traffic:
- Consider Vercel Pro plan
- Implement Redis-backed rate limiting
- Add request queuing for AI calls

## Cost Management

### Free Tier Limits (Vercel)
- 100GB bandwidth/month
- Unlimited requests
- 100 hours serverless function execution

### Gemini API Costs
- Free tier: 15 req/min
- Monitor usage in Google AI Studio
- Consider caching responses

## Support

For deployment issues:
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)

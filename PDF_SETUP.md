# 📄 PDF Generation Setup Guide

This guide explains how PDF generation works in the CV Polisher application and how to deploy the PDF backend on Render.

---

## Architecture Overview

The CV Polisher uses a **two-service architecture** for PDF generation:

```
┌─────────────────────────────────────────┐
│  cv-polisher-web (Vercel - Next.js)     │
│  - User form interface                  │
│  - AI polishing with Google Gemini      │
│  - Calls PDF backend API                │
└────────────────┬────────────────────────┘
                 │ HTTP POST /generate-pdf
                 ▼
┌─────────────────────────────────────────┐
│  cv-polisher (Render - Python FastAPI)  │
│  - Receives polished CV JSON            │
│  - Generates LaTeX code                 │
│  - Compiles LaTeX → PDF with Tectonic   │
│  - Returns PDF file                     │
└─────────────────────────────────────────┘
```

**Why this architecture?**
- Vercel serverless functions can't easily run native binaries (like LaTeX compilers)
- Render supports running custom binaries during build
- Separation of concerns: frontend handles UX, backend handles PDF compilation

---

## 🚀 Deploying the PDF Backend on Render

### Step 1: Push cv-polisher Repository to GitHub

```bash
cd cv-polisher
git push origin main
```

### Step 2: Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `cv-polisher`
4. Configure the service:

**Basic Settings:**
- **Name**: `cv-polisher` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (uses repository root)
- **Runtime**: Python 3

**Build & Deploy:**
- **Build Command**:
  ```bash
  bash build.sh
  ```

- **Start Command**:
  ```bash
  cd worker && uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- **Free** tier works for testing
- **Starter** ($7/month) recommended for production (faster, no spin-down)

### Step 3: Set Environment Variables

In Render dashboard, go to **Environment** tab and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | Your API key | Google Gemini API key for CV polishing |
| `FRONTEND_ORIGIN` | `https://cv-polisher-web.vercel.app https://www.abdurakhmonbek.com` | Space-separated list of allowed origins for CORS |

### Step 4: Deploy

1. Click **Create Web Service**
2. Wait for build to complete (~3-5 minutes)
3. Verify Tectonic installed successfully in build logs:
   ```
   Tectonic installed successfully at bin/tectonic
   Tectonic 0.15.0
   ```

### Step 5: Test the PDF Backend

Once deployed, test the health endpoint:

```bash
curl https://cv-polisher.onrender.com/health
# Expected: {"status":"ok"}
```

Test PDF generation:

```bash
curl -X POST https://cv-polisher.onrender.com/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "language": "EN",
    "contact": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York",
      "links": "linkedin.com/in/johndoe"
    },
    "summary": "Experienced professional",
    "experience": [{
      "company": "Tech Corp",
      "title": "Software Engineer",
      "location": "NYC",
      "start": "Jan 2020",
      "end": "Present",
      "bullets": ["Built scalable systems"]
    }],
    "education": [],
    "skills": {"hard": ["Python"], "soft": [], "tools": []},
    "certifications": [],
    "languages_extra": ["English (Native)"]
  }' \
  --output test.pdf

# Should download a PDF file
```

---

## 🔧 Deploying the Next.js Frontend on Vercel

### Step 1: Push cv-polisher-web to GitHub

```bash
cd cv-polisher-web
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import `cv-polisher-web` repository
4. Configure:

**Framework Preset**: Next.js (auto-detected)

**Build Settings**: (defaults are fine)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Step 3: Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

| Variable | Value | Production/Preview |
|----------|-------|--------------------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Production |
| `FRONTEND_ORIGIN` | `https://www.abdurakhmonbek.com` | Production |
| `FRAME_ANCESTORS` | `https://www.abdurakhmonbek.com https://abdurakhmonbek.com` | Production |
| `PDF_BACKEND_URL` | `https://cv-polisher.onrender.com` | Production |

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build (~2 minutes)
3. Vercel will provide a URL like `https://cv-polisher-web.vercel.app`

### Step 5: Test End-to-End

1. Visit `https://cv-polisher-web.vercel.app/polisher`
2. Fill out the CV form
3. Click "Generate CV"
4. Should download a PDF file directly!

---

## 🔍 Troubleshooting

### PDF Backend Issues

**Problem**: Build fails with "Tectonic not found"

**Solution**: Check `build.sh` executed correctly. View build logs in Render dashboard.

```bash
# Manual fix: SSH into Render shell and run:
curl -L https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic@0.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz | tar xz
chmod +x tectonic
mv tectonic bin/tectonic
```

---

**Problem**: PDF generation returns 500 error

**Solution**: Check LaTeX compilation errors in Render logs:
- Go to Render dashboard → cv-polisher service → **Logs**
- Look for `[generate-pdf]` entries
- Common issues:
  - Missing font packages
  - LaTeX syntax errors
  - Timeout (increase timeout in code)

---

**Problem**: CORS errors in browser console

**Solution**: Verify `FRONTEND_ORIGIN` environment variable includes your domain:

```bash
# In Render dashboard, set:
FRONTEND_ORIGIN=https://cv-polisher-web.vercel.app https://www.abdurakhmonbek.com
```

---

### Frontend Issues

**Problem**: "Failed to generate PDF" error

**Solution**: Check `PDF_BACKEND_URL` is correct:
- In Vercel dashboard → Project → Settings → Environment Variables
- Should be: `https://cv-polisher.onrender.com` (without trailing slash)
- Redeploy after changing environment variables

---

**Problem**: Render service is slow / times out

**Solution**:
- Free tier spins down after inactivity (~15 min)
- First request after spin-down takes 30-60 seconds
- Upgrade to Starter plan ($7/month) for always-on service
- Or add a keep-alive ping (external monitoring service)

---

## 📊 Performance Considerations

**Render Free Tier**:
- ✅ Good for testing and low traffic
- ❌ Spins down after 15 minutes of inactivity
- ❌ First request after spin-down: 30-60s
- ❌ Monthly limit: 750 hours (enough if used occasionally)

**Render Starter ($7/month)**:
- ✅ Always on (no spin-down)
- ✅ Fast PDF generation (2-5 seconds)
- ✅ Better for production use

**PDF Generation Time**:
- LaTeX compilation: 2-4 seconds
- Network latency: 0.5-1 second
- **Total**: 3-5 seconds end-to-end

---

## 🧪 Local Development

### Running PDF Backend Locally

```bash
cd cv-polisher

# Install Tectonic (macOS)
brew install tectonic

# Install Tectonic (Linux)
curl -L https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic@0.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz | tar xz
sudo mv tectonic /usr/local/bin/

# Install Tectonic (Windows)
# Download from: https://github.com/tectonic-typesetting/tectonic/releases
# Add to PATH

# Install Python dependencies
pip install -r requirements.txt

# Run server
cd worker
uvicorn main:app --reload --port 8000
```

### Running Next.js Frontend Locally

```bash
cd cv-polisher-web

# Install dependencies
npm install

# Create .env.local
cat > .env.local <<EOF
GEMINI_API_KEY=your-key-here
PDF_BACKEND_URL=http://localhost:8000
FRONTEND_ORIGIN=http://localhost:3000
FRAME_ANCESTORS=http://localhost:3000
EOF

# Run dev server
npm run dev
```

Visit `http://localhost:3000/polisher` and test the form.

---

## 🔐 Security Notes

1. **API Keys**: Never commit `.env.local` or `.env` files
2. **CORS**: Restrict `FRONTEND_ORIGIN` to your domain only
3. **Rate Limiting**: Already implemented in Next.js API route
4. **File Cleanup**: Temporary LaTeX files are automatically deleted

---

## 📝 Summary

**Required Services:**
1. **cv-polisher-web** → Vercel (Next.js frontend)
2. **cv-polisher** → Render (Python PDF backend with Tectonic)

**Environment Variables:**
- Both services need `GEMINI_API_KEY`
- Frontend needs `PDF_BACKEND_URL` pointing to Render
- Backend needs `FRONTEND_ORIGIN` for CORS

**User Flow:**
1. User fills form on Vercel app
2. Frontend polishes CV with Gemini
3. Frontend sends polished JSON to Render backend
4. Backend compiles LaTeX → PDF with Tectonic
5. Backend returns PDF
6. Frontend downloads PDF to user's browser

---

**Questions?** Check the [main README](./README.md) or open an issue on GitHub.

**Built with ❤️ by Abdurakhmonbek Fayzullaev**

*Last Updated: January 2025*

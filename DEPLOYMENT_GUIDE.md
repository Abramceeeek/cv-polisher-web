# 🚀 Deployment Guide

Quick reference for deploying CV Polisher projects to the correct platforms.

---

## 📦 Project Deployment Map

### 1. **cv-polisher-web/** → **Vercel** ☁️

**What it is:** Next.js 14 web application with multi-step CV form and LaTeX generation

**Platform:** [Vercel](https://vercel.com)

**Tech Stack:** Next.js, TypeScript, TailwindCSS, Google Gemini AI

**Deployment Steps:**
```bash
cd cv-polisher-web
vercel          # Deploy preview
vercel --prod   # Deploy to production
```

**Environment Variables (Vercel Dashboard):**
- `GEMINI_API_KEY` - Google Gemini API key (optional, has fallback)
- `FRONTEND_ORIGIN` - CORS origin (e.g., `https://www.abdurakhmonbek.com`)
- `FRAME_ANCESTORS` - Space-separated list of domains allowed to embed (e.g., `https://www.abdurakhmonbek.com https://abdurakhmonbek.com`)

**Production URL:** `https://cv-polisher-web.vercel.app`

**Features:**
- Multi-step CV form wizard
- LaTeX CV generation (HARVARD & PRO styles)
- AI-powered content polishing
- Multi-language support (EN/RU/UZ)
- No database, privacy-first

---

### 2. **cv-polisher/** → **Render** 🔧

**What it is:** Python FastAPI backend (legacy/alternative backend)

**Platform:** [Render](https://render.com)

**Tech Stack:** FastAPI, Uvicorn, Python, Google Generative AI

**Deployment Steps:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create new **Web Service**
3. Connect GitHub repository
4. Select `cv-polisher/` folder
5. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `cd worker && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3

**Environment Variables (Render Dashboard):**
- `GEMINI_API_KEY` - Google Gemini API key
- `FRONTEND_ORIGIN` - Space-separated CORS origins (e.g., `https://www.abdurakhmonbek.com https://abdurakhmonbek.com`)

**Production URL:** `https://cv-polisher.onrender.com`

**Features:**
- FastAPI REST API
- PDF/DOCX file upload support
- AI-powered CV polishing

---

### 3. **Final-website/** → **Your Web Host** 🌐

**What it is:** Portfolio website with CV polisher iframe integration

**Platform:** Your existing web hosting (e.g., GitHub Pages, Netlify, custom server)

**Tech Stack:** HTML, CSS, JavaScript (vanilla)

**No deployment needed** - This is your main portfolio site that embeds the Vercel app via iframe.

**Integration:**
- `services/cv-polisher/index.html` contains iframe embedding the Vercel app
- URL in iframe: `https://cv-polisher-web.vercel.app/polisher`

---

## 🔗 How They Work Together

```
┌─────────────────────────────────────────────────┐
│  Final-website (Your Portfolio)                 │
│  └─ services/cv-polisher/index.html             │
│     └─ <iframe> embeds...                       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  cv-polisher-web (Vercel)                       │
│  - Multi-step CV form                           │
│  - LaTeX generation                             │
│  - AI polishing with Gemini                     │
│  - Primary user-facing app                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  cv-polisher (Render) - Optional/Legacy         │
│  - FastAPI backend                              │
│  - Alternative API if needed                    │
└─────────────────────────────────────────────────┘
```

---

## ✅ Quick Checklist

**Before Deploying:**

- [ ] **cv-polisher-web**: Set `GEMINI_API_KEY` in Vercel environment variables
- [ ] **cv-polisher-web**: Set `FRAME_ANCESTORS` to allow your domain
- [ ] **cv-polisher**: Set `FRONTEND_ORIGIN` in Render environment variables
- [ ] **cv-polisher**: Verify `requirements.txt` is present
- [ ] **Final-website**: Update iframe `src` URL to Vercel production URL

**After Deploying:**

- [ ] Test CV form on Vercel URL directly
- [ ] Test iframe embedding on portfolio site
- [ ] Verify fallback link works (for iOS/Safari)
- [ ] Check CORS headers (browser console)
- [ ] Test CV generation and download

---

## 🆘 Troubleshooting

**Iframe not loading?**
- Check CSP `frame-ancestors` in cv-polisher-web/next.config.js
- Verify domain is listed in `FRAME_ANCESTORS` environment variable
- Use fallback link for iOS/Safari

**API CORS errors?**
- Verify `FRONTEND_ORIGIN` includes your domain in Render
- Check cv-polisher/worker/main.py CORS configuration
- Ensure space-separated format for multiple origins

**LaTeX generation fails?**
- Check `GEMINI_API_KEY` is set correctly
- Fallback polishing will work without API key
- Review browser console for errors

---

## 📝 Summary

| Project | Platform | Purpose | URL |
|---------|----------|---------|-----|
| **cv-polisher-web** | Vercel | Main CV polisher app | https://cv-polisher-web.vercel.app |
| **cv-polisher** | Render | Legacy FastAPI backend | https://cv-polisher.onrender.com |
| **Final-website** | Your Host | Portfolio with iframe | https://www.abdurakhmonbek.com |

---

**Built with ❤️ by Abdurakhmonbek Fayzullaev**

*Last Updated: January 2025*

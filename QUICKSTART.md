# 🚀 Quick Start Guide

## Setup (2 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.local.example .env.local

# 3. (Optional) Add your Gemini API key to .env.local
# The app works fine without it using fallback polishing!

# 4. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
```

## File Structure

```
├── app/
│   ├── page.tsx                  # Landing page
│   ├── polisher/page.tsx         # Main form
│   ├── help/page.tsx             # Documentation
│   └── api/polish/route.ts       # API endpoint
├── lib/
│   ├── latex.ts                  # LaTeX generation
│   ├── polish.ts                 # AI polishing
│   └── types.ts                  # TypeScript types
└── components/
    ├── ExperienceFields.tsx      # Experience form
    └── EducationFields.tsx       # Education form
```

## Key Features

✅ Multi-step form wizard
✅ AI-powered content polishing (optional)
✅ Two LaTeX styles (HARVARD & PRO)
✅ Multi-language (EN, RU, UZ)
✅ Privacy-first (no database)
✅ Rate limiting included
✅ TypeScript throughout

## Testing the App

1. **Fill the form**: Navigate to `/polisher`
2. **Generate CV**: Complete all steps and click "Generate"
3. **Download**: Your `.tex` file downloads automatically
4. **Compile**: Upload to [Overleaf.com](https://www.overleaf.com) and select XeLaTeX compiler

## Deploy to Vercel (5 minutes)

```bash
# Option 1: Via dashboard
# Go to vercel.com → Import your GitHub repo → Deploy

# Option 2: Via CLI
npm i -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard:
- `GEMINI_API_KEY` (optional)
- `FRONTEND_ORIGIN` (optional)

## Troubleshooting

**Port already in use?**
```bash
# Change port
PORT=3001 pnpm dev
```

**Dependencies installation fails?**
```bash
# Clear cache and retry
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Build errors?**
```bash
# Check TypeScript
pnpm run lint
# Check tests
pnpm test
```

## Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Create API key
4. Add to `.env.local`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

## Next Steps

- [ ] Read full [README.md](./README.md)
- [ ] Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- [ ] Review [/help](http://localhost:3000/help) page in the app
- [ ] Test with sample data from `__fixtures__/sample.json`
- [ ] Deploy to Vercel

## Need Help?

- 📖 Documentation: See [README.md](./README.md)
- 🐛 Found a bug? Open an issue
- 💡 Feature request? Open an issue with [Feature Request] prefix

---

**Built by** [Abdurakhmonbek Fayzullaev](https://abdurakhmonbek.com)

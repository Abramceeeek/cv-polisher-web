# 📚 CV Polisher Web - Documentation Index

Quick navigation to all project documentation and resources.

## 🚀 Getting Started

1. **[QUICKSTART.md](./QUICKSTART.md)** ⭐ START HERE
   - 2-minute setup guide
   - Basic commands
   - Quick troubleshooting
   - **Perfect for first-time users**

2. **[README.md](./README.md)** 📖 MAIN DOCUMENTATION
   - Complete project overview
   - Feature list
   - API reference
   - Troubleshooting guide
   - **Complete reference**

## 📦 Project Information

3. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** 📊 TECHNICAL OVERVIEW
   - What was built
   - Architecture decisions
   - Technology choices explained
   - Performance characteristics
   - **For developers & technical users**

4. **[STRUCTURE.txt](./STRUCTURE.txt)** 🗂️ FILE STRUCTURE
   - Complete project tree
   - File descriptions
   - Dependencies list
   - Route mapping
   - **Visual project overview**

## 🚢 Deployment

5. **[DEPLOYMENT.md](./DEPLOYMENT.md)** 🚀 PRODUCTION GUIDE
   - Vercel deployment steps
   - Environment variables setup
   - Custom domain configuration
   - Post-deployment checklist
   - **For production deployment**

6. **[.vercel/README.md](./.vercel/README.md)** ☁️ VERCEL SPECIFIC
   - Vercel CLI usage
   - Auto-deployment setup
   - Quick reference
   - **Vercel-specific info**

## 📝 Code Documentation

7. **[lib/types.ts](./lib/types.ts)** 📐 TYPE DEFINITIONS
   - All TypeScript interfaces
   - Data structures
   - Type exports

8. **[lib/latex.ts](./lib/latex.ts)** 📄 LATEX GENERATION
   - LaTeX escaping function
   - Template generators
   - HARVARD & PRO styles

9. **[lib/polish.ts](./lib/polish.ts)** ✨ AI POLISHING
   - Gemini integration
   - Fallback logic
   - Content improvement

10. **[lib/rateLimit.ts](./lib/rateLimit.ts)** 🚦 RATE LIMITING
    - Token bucket implementation
    - Memory management

## 🧪 Testing

11. **[__tests__/latex.test.ts](./__tests__/latex.test.ts)** ✅ UNIT TESTS
    - LaTeX escaping tests
    - Special character handling
    - Test cases

12. **[__fixtures__/sample.json](./__fixtures__/sample.json)** 📋 SAMPLE DATA
    - Example CV data
    - Testing reference
    - JSON structure

## ⚙️ Configuration

13. **[package.json](./package.json)** 📦 DEPENDENCIES
    - All packages
    - Scripts
    - Version info

14. **[tsconfig.json](./tsconfig.json)** 🔧 TYPESCRIPT CONFIG
    - Compiler options
    - Path aliases

15. **[tailwind.config.ts](./tailwind.config.ts)** 🎨 STYLING CONFIG
    - Color palette
    - Theme customization

16. **[next.config.js](./next.config.js)** ⚡ NEXT.JS CONFIG
    - CORS headers
    - Build settings

17. **[jest.config.js](./jest.config.js)** 🧪 TEST CONFIG
    - Jest setup
    - Test environment

18. **[vercel.json](./vercel.json)** ☁️ VERCEL CONFIG
    - Deployment settings
    - Environment setup

## 📱 Application Pages

### User-Facing Pages

- **[app/page.tsx](./app/page.tsx)** 🏠 LANDING PAGE
- **[app/polisher/page.tsx](./app/polisher/page.tsx)** 📝 MAIN FORM
- **[app/help/page.tsx](./app/help/page.tsx)** ❓ HELP PAGE

### API Routes

- **[app/api/polish/route.ts](./app/api/polish/route.ts)** 🔌 API ENDPOINT

## 🎨 Components

- **[components/ExperienceFields.tsx](./components/ExperienceFields.tsx)** 💼 EXPERIENCE FORM
- **[components/EducationFields.tsx](./components/EducationFields.tsx)** 🎓 EDUCATION FORM

## 📖 Usage Guides by Task

### I want to...

**...set up the project locally**
→ Read [QUICKSTART.md](./QUICKSTART.md)

**...understand the architecture**
→ Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

**...deploy to production**
→ Read [DEPLOYMENT.md](./DEPLOYMENT.md)

**...understand the code**
→ Read [STRUCTURE.txt](./STRUCTURE.txt) then explore files

**...add a new feature**
→ Check [lib/types.ts](./lib/types.ts) for data structures
→ Review [app/polisher/page.tsx](./app/polisher/page.tsx) for form logic
→ Check [lib/latex.ts](./lib/latex.ts) for LaTeX generation

**...fix a bug**
→ Check [__tests__](. /__tests__/) for test cases
→ Review relevant lib/ files
→ See [README.md](./README.md) troubleshooting section

**...customize styling**
→ Edit [tailwind.config.ts](./tailwind.config.ts)
→ Modify [app/globals.css](./app/globals.css)

**...add a new CV style**
→ Add function to [lib/latex.ts](./lib/latex.ts)
→ Update [lib/types.ts](./lib/types.ts)
→ Add selection to [app/polisher/page.tsx](./app/polisher/page.tsx)

**...change AI behavior**
→ Modify [lib/polish.ts](./lib/polish.ts)
→ Adjust system instructions or temperature

**...add rate limiting rules**
→ Edit [lib/rateLimit.ts](./lib/rateLimit.ts)
→ Adjust MAX_TOKENS or REFILL_RATE

## 🔑 Key Concepts

### LaTeX Generation
All LaTeX generation happens in [lib/latex.ts](./lib/latex.ts):
- `latexEscape()` - Escape special characters
- `toHarvardTex()` - Generate HARVARD style
- `toProTex()` - Generate PRO style
- `generateLatex()` - Main entry point

### AI Polishing
AI logic in [lib/polish.ts](./lib/polish.ts):
- `polishCV()` - Main function (tries AI, falls back)
- `polishWithGemini()` - Google Gemini integration
- `fallbackPolish()` - Heuristic polishing without AI

### Form State Management
Multi-step form in [app/polisher/page.tsx](./app/polisher/page.tsx):
- `formData` state - All CV data
- `currentStep` state - Wizard progress
- `renderStep()` - Step rendering
- Dynamic arrays for experience/education

## 📊 File Statistics

| Category | Files | Lines |
|----------|-------|-------|
| TypeScript/TSX | 10 | ~3,500 |
| Components | 2 | ~300 |
| Tests | 1 | ~100 |
| Config | 8 | ~200 |
| Documentation | 6 | ~2,500 |
| **Total** | **27** | **~6,600** |

## 🎯 Quick Commands

```bash
# Development
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm lint             # Run linter

# Deployment
vercel                # Deploy to Vercel (preview)
vercel --prod         # Deploy to production
```

## 📞 Need Help?

1. Check [QUICKSTART.md](./QUICKSTART.md) for common issues
2. Read [README.md](./README.md) troubleshooting section
3. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
4. Check [app/help/page.tsx](./app/help/page.tsx) for user documentation
5. Open an issue on GitHub with detailed description

## ✅ Project Status

- ✅ **Code**: 100% complete
- ✅ **Tests**: Critical paths covered
- ✅ **Documentation**: Comprehensive
- ✅ **Deployment**: Vercel-ready
- ✅ **Production**: Ready to launch

## 🚀 Next Steps

1. **Setup**: Follow [QUICKSTART.md](./QUICKSTART.md)
2. **Test**: Run `pnpm dev` and try the form
3. **Review**: Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
4. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
5. **Launch**: Share with users!

---

**Built with ❤️ by [Abdurakhmonbek Fayzullaev](https://abdurakhmonbek.com)**

*Last Updated: January 2025*

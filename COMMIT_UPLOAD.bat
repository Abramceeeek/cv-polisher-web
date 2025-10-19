@echo off
REM Deploy upload feature to Vercel

echo === CV Polisher Web - Deploy Upload Feature ===
echo.

REM Check if we're in the right directory
if not exist "app\page.tsx" (
    echo Error: Please run this from the cv-polisher-web directory
    pause
    exit /b 1
)

REM Show what will be committed
echo === Files to commit ===
git status --short

echo.
set /p confirm="Commit and push upload feature? (y/n): "

if /i not "%confirm%"=="y" (
    echo Aborted.
    pause
    exit /b 0
)

REM Commit
git add app/page.tsx app/upload/page.tsx components/CVPolisherForm.tsx UPLOAD_FEATURE.md COMMIT_UPLOAD.bat

git commit -m "Add Quick Upload & Polish feature" -m "New Features:" -m "- Upload existing CV (PDF/DOCX) or paste text" -m "- Job description-based tailoring" -m "- Free mode (keyword-based, $0 cost)" -m "- AI mode (Gemini-powered)" -m "- PDF or LaTeX output" -m "- Enhanced homepage with feature comparison" -m "" -m "Files:" -m "- components/CVPolisherForm.tsx (new)" -m "- app/upload/page.tsx (new)" -m "- app/page.tsx (updated)"

REM Push
echo.
echo === Pushing to GitHub ===
git push origin main

echo.
echo √ Changes pushed successfully!
echo.
echo === Next Steps ===
echo 1. Vercel will auto-deploy in 1-2 minutes
echo 2. Visit: https://www.abdurakhmonbek.com/services/cv-polisher/upload
echo 3. Test the upload feature
echo.
echo See UPLOAD_FEATURE.md for complete documentation.
echo.
pause

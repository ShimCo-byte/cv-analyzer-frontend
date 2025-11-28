# Quick Start Guide - Frontend

Rýchly návod na spustenie CV Analyzer Frontend.

## 🚀 Rýchle spustenie

### 1. Prejdi do priečinka
```bash
cd cv-analyzer-frontend
```

### 2. Nainštaluj závislosti
```bash
npm install
```

### 3. Skontroluj konfiguráciu

Súbor `.env.local` by mal obsahovať:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Uisti sa, že backend beží

V inom termináli:
```bash
cd ../cv-analyzer-backend
npm run dev
```

Backend by mal bežať na `http://localhost:3001`

### 5. Spusti frontend
```bash
npm run dev
```

Frontend by mal bežať na `http://localhost:3000`

Otvor browser: `http://localhost:3000`

---

## 📱 Použitie aplikácie

### Krok 1: Landing Page
1. Otvor `http://localhost:3000`
2. Vidíš prehľad funkcií
3. Klikni na "Get Started"

### Krok 2: Upload Resume
1. Na stránke `/upload`:
   - **Option A**: Drag & drop PDF resume
   - **Option B**: Switch to "Text Input" a vlož text

**Sample text:**
```
John Doe
Software Engineer

Skills: JavaScript, React, Node.js, Python, Docker, AWS

Experience:
Senior Developer at Google
2020-2023
Developed scalable web applications

Education:
Bachelor of Computer Science
Stanford University, 2020

Certifications:
AWS Certified Developer, 2022
```

### Krok 3: Select Requirements
1. **Option A - Study Program**:
   - Vyber program (napr. "Web Development")

2. **Option B - Job Description**:
   - Switch to "Job Description"
   - Vlož popis pozície:
```
We are looking for a Senior Full-Stack Developer with 3+ years of experience.

Required Skills:
- React, TypeScript
- Node.js, Express
- MongoDB, PostgreSQL
- REST APIs, GraphQL
- Git, Docker, AWS
```

### Krok 4: Analyze
1. Klikni "Analyze Resume"
2. Počkaj na spracovanie (2-5 sekúnd)
3. Automatické presmerovanie na `/analysis`

### Krok 5: View Results
Na stránke `/analysis` vidíš:

**Score Card:**
- Animovaný circular progress bar
- Fit score (0-100)
- Explanation
- Matched skills (zelené)
- Missing skills (červené)

**Suggestions:**
- Personalizované odporúčania
- Vzdelávacie zdroje (kurzy, projekty, knihy)

**Actions:**
- "Download Report" - stiahni text súbor
- "New Analysis" - nová analýza

---

## 🎨 Funkcie na vyskúšanie

### 1. PDF Upload s Drag & Drop
```
1. Na upload page
2. Drag PDF file do upload area
3. Vidíš názov súboru
4. Môžeš ho odstrániť tlačidlom "Remove file"
```

### 2. Text Input
```
1. Switch to "Text Input" mode
2. Vlož svoj resume text
3. Vidíš character counter
```

### 3. Study Program Selection
```
1. Klikni na program (napr. Web Development)
2. Vidíš:
   - Difficulty badge (intermediate)
   - Check mark pri vybranom programe
   - Border highlight
```

### 4. Job Description
```
1. Switch to "Job Description" tab
2. Vlož popis pozície
3. Systém extrahuje required skills
```

### 5. Score Animation
```
1. Po analýze vidíš:
   - Score animation (0 → actual score)
   - Circular progress fill
   - Color gradient based on score
```

### 6. Download Report
```
1. Na analysis page
2. Klikni "Download Report"
3. Stiahne sa text súbor s výsledkami
```

---

## 🧪 Test Scenarios

### Scenario 1: Excellent Fit (80+)
**Resume:**
```
Skills: JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, PostgreSQL, Git, Docker, AWS, REST API, GraphQL
```

**Requirements:**
- Study Program: Web Development

**Expected Result:**
- Score: 80-95
- Label: "Excellent Fit"
- Green gradient
- Veľa matched skills
- Málo missing skills

---

### Scenario 2: Moderate Fit (40-59)
**Resume:**
```
Skills: JavaScript, HTML, CSS
```

**Requirements:**
- Study Program: Web Development

**Expected Result:**
- Score: 40-59
- Label: "Moderate Fit"
- Yellow gradient
- Niekoľko matched skills
- Veľa missing skills
- Suggestions to improve

---

### Scenario 3: Custom Job Description
**Resume:**
```
Skills: Python, Django, PostgreSQL, Docker
```

**Job Description:**
```
Looking for Python Backend Developer
Required: Python, Django, Flask, PostgreSQL, Redis, Docker, Kubernetes
```

**Expected Result:**
- Score based on match
- Matched: Python, Django, PostgreSQL, Docker
- Missing: Flask, Redis, Kubernetes
- Recommendations for missing skills

---

## 🐛 Common Issues

### Issue 1: "Backend offline"
**Symptom:**
- Red dot na home page
- "Backend offline" message

**Fix:**
```bash
# Terminal 1: Start backend
cd cv-analyzer-backend
npm run dev

# Wait for "Server running on port 3001"

# Terminal 2: Refresh frontend
# Ctrl+C, then npm run dev again
```

---

### Issue 2: "Failed to fetch"
**Symptom:**
- Error pri analýze
- "Failed to fetch" v console

**Fix:**
```bash
# Check backend URL in .env.local
cat .env.local

# Should be:
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Check backend is running:
curl http://localhost:3001/api/health
```

---

### Issue 3: Styles not loading
**Symptom:**
- Plain HTML, no styling

**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules .next
npm install

# Restart dev server
npm run dev
```

---

### Issue 4: TypeScript errors
**Symptom:**
- Red underlines in VS Code
- Build errors

**Fix:**
```bash
# Check tsconfig.json exists
cat tsconfig.json

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "Restart TS Server"
```

---

## 📊 Expected Flow

```
1. Home (/)
   → Backend health check
   → Click "Get Started"

2. Upload (/upload)
   → Upload resume (PDF/text)
   → Select requirements (program/job)
   → Click "Analyze"
   → Loading state (2-5s)

3. Analysis (/analysis)
   → Score animation
   → View matched/missing skills
   → Read suggestions
   → Download report or new analysis
```

---

## 🎯 Quick Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Clean build
rm -rf .next

# Clean install
rm -rf node_modules
npm install
```

---

## 📝 Environment Variables

### Development (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Production
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend-api.com/api
```

### Manual Build
```bash
npm run build
npm start
```

---

## 💡 Tips

### Development
- Use React DevTools extension
- Check browser console for errors
- Use Network tab to debug API calls

### Testing
- Test na mobile viewport (DevTools → Toggle device toolbar)
- Test drag & drop
- Test animácie
- Test error states (disconnect backend)

### Performance
- Use Lighthouse v DevTools
- Check bundle size: `npm run build`
- Optimize images if needed

---

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/learn
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Happy coding! 🚀**

Frontend: `http://localhost:3000`
Backend: `http://localhost:3001`

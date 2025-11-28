# CV Analyzer Frontend

Modern Next.js aplikácia pre analýzu CV a vyhodnocovanie zhody s pracovnými pozíciami.

## 🚀 Technológie

- **Next.js 15** - React framework s App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **React Hooks** - State management

## ✨ Funkcie

### Stránky

#### 1. Home Page (`/`)
- Landing page s prehľadom funkcií
- Backend health check
- CTA button na začatie analýzy

#### 2. Upload Page (`/upload`)
- **Resume Upload**:
  - PDF file upload s drag & drop
  - Text input alternatíva
  - File validation
- **Job Requirements**:
  - Výber študijného programu (Computer Science, Web Development, Data Science, Cybersecurity)
  - Custom job description input
- **Analyze button** s loading state

#### 3. Analysis Page (`/analysis`)
- **Score Card**:
  - Animovaný circular progress bar
  - Fit score 0-100
  - Farebné označenie (Excellent/Good/Moderate/Limited)
  - Vysvetlenie analýzy
- **Skills Overview**:
  - Matched skills (zelené)
  - Missing skills (červené)
- **Suggestions List**:
  - Personalizované návrhy na zlepšenie
  - Odporúčané vzdelávacie zdroje (kurzy, projekty, knihy, certifikácie)
- **Resume Summary**:
  - Prehľad extrahovaných údajov
- **Actions**:
  - Download report (text file)
  - New analysis button

### Komponenty

#### `ResumeUploader`
- Dual mode: PDF upload / Text input
- Drag & drop support
- File validation (PDF only, max 10MB)
- Character counter pre text

#### `JobSelector`
- Dual mode: Study Program / Job Description
- Study programs loading z API
- Difficulty badges (beginner/intermediate/advanced)
- Selection feedback

#### `ScoreCard`
- Animovaný score s circular progress
- Gradient colors based on score
- Explanation section
- Matched/missing skills badges

#### `SuggestionsList`
- Numbered suggestions
- Resource cards s ikonami
- Type badges (course/project/book/certification)
- Difficulty levels
- External links

## 📁 Štruktúra projektu

```
cv-analyzer-frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── upload/
│   │   └── page.tsx        # Upload page
│   └── analysis/
│       └── page.tsx        # Analysis results page
├── components/
│   ├── ResumeUploader.tsx  # Resume upload component
│   ├── JobSelector.tsx     # Job requirements selector
│   ├── ScoreCard.tsx       # Score display component
│   └── SuggestionsList.tsx # Suggestions component
├── lib/
│   └── api.ts              # API client functions
├── types/
│   └── index.ts            # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.js
├── .env.local
└── README.md
```

## 🎨 Design

### Farebná paleta
- **Primary**: Blue (#0ea5e9)
- **Success**: Green (matched skills, excellent score)
- **Warning**: Yellow (moderate score)
- **Danger**: Red (missing skills, limited score)
- **Neutral**: Gray (backgrounds, text)

### Animácie
- Fade in
- Slide up
- Circular progress animation
- Hover effects
- Loading spinners

### Responsive Design
- Mobile-first approach
- Grid layouts s breakpoints
- Touch-friendly komponenty

## 🔧 Inštalácia

### 1. Nainštaluj závislosti
```bash
cd cv-analyzer-frontend
npm install
```

### 2. Konfigurácia

Súbor `.env.local` už obsahuje:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Ak backend beží na inom porte, uprav URL.

### 3. Spusti development server
```bash
npm run dev
```

Aplikácia bude dostupná na `http://localhost:3000`

## 📊 User Flow

```
1. Landing Page (/)
   ↓ [Get Started]
2. Upload Page (/upload)
   ↓ [Upload Resume + Select Requirements + Analyze]
3. Analysis Page (/analysis)
   ↓ [View Results + Download Report]
   ↓ [New Analysis] → Back to Upload
```

## 🔌 API Integrácia

### API Client (`lib/api.ts`)

```typescript
// Upload resume
const resume = await uploadResume(file, text);

// Analyze job fit
const analysis = await analyzeJobFit(resumeData, {
  jobDescription: "...",
  studyProgram: "web-development"
});

// Get study programs
const programs = await getStudyPrograms();

// Health check
const isHealthy = await checkHealth();
```

### Error Handling
- Try-catch v každej API funkcii
- User-friendly error messages
- Console logging pre debugging

## 📱 Responzívnosť

### Breakpoints
- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (two columns)

### Mobile optimalizácie
- Stack layout na mobile
- Touch-friendly buttons (min 44x44px)
- Responsive text sizes
- Collapsible sections

## ⚡ Performance

### Optimalizácie
- Client-side only rendering pre interaktívne komponenty
- SessionStorage pre analysis results (avoid re-fetching)
- Lazy loading components
- Optimized images & icons (SVG)
- Minimal bundle size

### Loading States
- Spinners pre async operations
- Skeleton screens (možno pridať)
- Progress indicators

## 🎯 Features Detail

### Score Visualization
```
80-100: Excellent Fit (Green gradient)
60-79:  Good Fit (Blue gradient)
40-59:  Moderate Fit (Yellow gradient)
0-39:   Limited Fit (Red gradient)
```

### Skills Matching
- Case-insensitive matching
- Fuzzy matching (backend)
- Badge colors:
  - ✅ Green = Matched
  - ❌ Red = Missing

### Resource Recommendations
Types:
- 📚 Course (Udemy, Coursera, etc.)
- 🔬 Project (hands-on practice)
- 📖 Book (learning resources)
- 🎓 Certification (professional credentials)

Difficulty levels:
- 🟢 Beginner
- 🟡 Intermediate
- 🔴 Advanced

## 🧪 Testovanie

### Manuálne testy

1. **Upload PDF**
```bash
# Použiť sample PDF resume
```

2. **Text Input**
```
John Doe
Software Engineer

Skills: JavaScript, React, Node.js, Python

Experience:
Senior Developer at Google
2020-2023
```

3. **Study Program Selection**
- Vyber "Web Development"
- Klikni "Analyze"

4. **Job Description**
```
We are looking for a Senior Full-Stack Developer with 3+ years of experience.

Required Skills:
- React, TypeScript
- Node.js, Express
- MongoDB, PostgreSQL
```

### Expected Results
- Resume sa uploadne a spracuje
- Analysis sa vykoná
- Score sa zobrazí s animáciou
- Suggestions a resources sa načítajú

## 🐛 Troubleshooting

### Backend nedostupný
```
Error: Failed to fetch
```
**Fix**:
- Skontroluj, že backend beží na `http://localhost:3001`
- Skontroluj CORS nastavenia v backen de

### PDF upload zlyhá
```
Error: Only PDF files are supported
```
**Fix**:
- Uisti sa, že súbor je PDF
- Max veľkosť: 10MB

### SessionStorage warnings
```
Warning: sessionStorage is not defined
```
**Fix**:
- Použiť `typeof window !== 'undefined'` check
- Už implementované v kóde

### Styling issues
```
Tailwind classes not working
```
**Fix**:
```bash
npm install tailwindcss autoprefixer postcss
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build for production
```bash
npm run build
npm start
```

### Environment Variables
Na produkcii nastav:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

## 📈 Budúce vylepšenia

- [ ] User authentication
- [ ] Save analysis history
- [ ] PDF preview component
- [ ] Export analysis as PDF
- [ ] Share analysis via link
- [ ] Multiple resumes comparison
- [ ] Dark mode toggle
- [ ] Accessibility improvements (ARIA labels)
- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] SEO optimization
- [ ] Analytics tracking
- [ ] Multi-language support

## 🎓 Použité Best Practices

### TypeScript
- Strict mode enabled
- Explicit types pre props
- Type-safe API responses

### React
- Functional components
- Custom hooks (možno pridať)
- Proper state management
- useEffect cleanup

### Next.js
- App Router
- Client components kde potrebné
- Server components pre static content (môžeme rozšíriť)

### CSS/Tailwind
- Mobile-first design
- Reusable utility classes
- Consistent spacing
- Semantic HTML

## 📝 Príklady použitia

### Upload Resume (Text)
```typescript
const text = `
John Doe
Software Engineer

Skills: JavaScript, React, Node.js

Experience:
Senior Developer at Google
2020-2023

Education:
Bachelor of Computer Science
Stanford University, 2020
`;

// Backend API parsuje text a extrahuje:
// - skills: ["JavaScript", "React", "Node.js"]
// - experience: [{company: "Google", ...}]
// - education: [{institution: "Stanford", ...}]
```

### Analyze with Study Program
```typescript
const analysis = await analyzeJobFit(resumeData, {
  studyProgram: "web-development"
});

// Returns:
// {
//   fitScore: 75,
//   matchedSkills: ["JavaScript", "React"],
//   missingSkills: ["TypeScript", "CSS"],
//   suggestionsToImprove: [...],
//   recommendedResources: [...]
// }
```

## 🔗 Links

- **Backend Repository**: `cv-analyzer-backend/`
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Vytvorené s Next.js + TypeScript + Tailwind CSS**
**Version: 1.0.0**
**Date: 2025-11-23**

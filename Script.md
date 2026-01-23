# CS348 Stage 1 Demo Script (1-2 minutes)

## Overview
This script guides you through demonstrating your Next.js + TypeScript + PostgreSQL setup for CS348 Stage 1.

---

## **PART 1: Tech Stack Installation (30-40 seconds)**

### Scene 1: Show Installed Technologies
**What to show:**
- Terminal/Command Prompt
- VS Code or your IDE

**What to say:**
> "For this project, I've selected the Next.js framework with TypeScript and Tailwind CSS for the frontend, and PostgreSQL for the database. Let me show you the installations."

### Scene 2: Verify Node.js & npm
**Terminal command:**
```bash
node --version
npm --version
```

**What to say:**
> "Node.js and npm are installed. Next, I'll show the project dependencies."

### Scene 3: Show package.json
**What to show:**
- Open `package.json` in your editor
- Highlight the dependencies section

**What to say:**
> "Here's my package.json showing Next.js, React, TypeScript, Tailwind CSS, and the PostgreSQL client library 'pg'."

### Scene 4: Show Docker & PostgreSQL
**Terminal command:**
```bash
docker --version
docker ps
```

**What to say:**
> "Docker is installed. I'm using docker-compose to run PostgreSQL locally. The database is running in a container."

---

## **PART 2: Code Walkthrough (30-40 seconds)**

### Scene 5: Database Connection Code
**What to show:**
- Open `lib/db.ts`
- Scroll through the file

**What to say:**
> "This is my database connection file using the 'pg' library. It creates a connection pool to PostgreSQL running on localhost."

### Scene 6: API Route Code
**What to show:**
- Open `app/api/health/route.ts`
- Point to the SQL query: `SELECT version()`

**What to say:**
> "This API route executes a raw SQL query to get the PostgreSQL version, demonstrating direct database access without an ORM."

### Scene 7: Landing Page Code
**What to show:**
- Open `app/page.tsx`
- Show the component structure and the button

**What to say:**
> "This is my landing page built with Next.js App Router. It has a modern, gaming-inspired UI using Tailwind CSS."

---

## **PART 3: Live Demo (30-40 seconds)**

### Scene 8: Start the Development Server
**Terminal command:**
```bash
npm run dev
```

**What to say:**
> "Starting the Next.js development server."

### Scene 9: Show the Web Page
**What to show:**
- Browser window showing `http://localhost:3000`
- Show the landing page with "CS2 Skin Trader Pro" title
- Show "Developed by Bach Le" text

**What to say:**
> "Here's the landing page running locally. You can see the project title and my name."

### Scene 10: Test Database Connection
**What to show:**
- Click the "CHECK DB CONNECTION" button
- Show the loading state
- Show the success message with PostgreSQL version

**What to say:**
> "When I click the database connection button, it queries PostgreSQL and displays the server version, proving the database integration works."

---

## **Quick Tips for Recording:**

1. **Screen Recording Setup:**
   - Use OBS Studio, Windows Game Bar (Win+G), or QuickTime (Mac)
   - Record at 1080p if possible
   - Show terminal, code editor, and browser side-by-side or switch between them

2. **Code Highlighting:**
   - Use your editor's zoom feature (Ctrl/Cmd +) to make code more visible
   - Use cursor highlighting or mouse movements to draw attention

3. **Timing:**
   - Keep transitions smooth
   - Don't rush - speak clearly
   - If you go slightly over 2 minutes, that's okay

4. **What NOT to show:**
   - Don't show `node_modules` folder (too large)
   - Don't show installation commands (already installed)
   - Focus on verification and the working demo

---

## **Alternative Shorter Script (if needed):**

If you need to be under 1.5 minutes:

1. **Quick intro (10s):** "I'm using Next.js, TypeScript, Tailwind, and PostgreSQL."
2. **Show package.json (10s):** "Here are my dependencies."
3. **Show docker ps (5s):** "PostgreSQL is running in Docker."
4. **Show lib/db.ts (10s):** "Database connection code."
5. **Show app/page.tsx (10s):** "Landing page code."
6. **Live demo (45s):** Start server → Show page → Click button → Show result

---

## **Files to Have Open/Ready:**

- `package.json` - to show dependencies
- `lib/db.ts` - to show database connection
- `app/api/health/route.ts` - to show SQL query
- `app/page.tsx` - to show landing page
- Terminal - for commands
- Browser - for live demo

---

## **Checklist Before Recording:**

- [ ] Docker Desktop is running
- [ ] PostgreSQL container is running (`docker ps` shows cs2market-db)
- [ ] Dependencies are installed (`npm install` completed)
- [ ] Development server can start (`npm run dev` works)
- [ ] Database connection works (button shows version)
- [ ] All code files are saved
- [ ] Browser is ready at localhost:3000
- [ ] Screen recording software is set up

---

**Good luck with your demo! 🎬**


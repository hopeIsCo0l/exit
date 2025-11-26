<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# EthioExitPrep - Ethiopian University Exit Exam Preparation Platform

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A comprehensive platform for Ethiopian university students to practice exit exams with simulated past papers, timed conditions, and performance tracking.

## Features

- 📚 Access to simulated exit exam papers from the last 2.5 years (5 sessions)
- ⏱️ Real-time exam simulation with timer
- 💾 Save and resume exam progress
- 📊 Performance history and analytics
- 🎯 Personalized study tips based on performance

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Deploy to Vercel

Vercel is the easiest way to deploy this app. It automatically detects Vite projects and handles everything for you.

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (it's free!)

2. **Import your repository:**
   - Click "Add New..." → "Project"
   - Import the `hopeIsCo0l/exit` repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Environment Variables:**
   - In the project settings, go to "Environment Variables"
   - Add: `GEMINI_API_KEY` with your API key value
   - Select "Production", "Preview", and "Development" environments

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically:
     - Install dependencies
     - Run `npm run build`
     - Deploy your app
   - You'll get a URL like `your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables:**
   ```bash
   vercel env add GEMINI_API_KEY
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Railway Deployment (Alternative)

If you prefer Railway:

1. **Connect your GitHub repository to Railway:**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository

2. **Configure Environment Variables:**
   - In Railway dashboard, go to your project settings
   - Add environment variable: `GEMINI_API_KEY` with your API key

3. **Deploy:**
   - Railway will automatically detect the `railway.json` configuration
   - It will build using `npm run build`
   - Start the app using `npm run start`

4. **Your app will be live!** Railway will provide you with a public URL.

## Project Structure

```
├── components/          # React components
│   ├── DepartmentCard.tsx
│   ├── ExamView.tsx
│   └── ResultView.tsx
├── services/           # API services
│   └── geminiService.ts
├── App.tsx            # Main app component
├── constants.ts       # App constants
├── types.ts          # TypeScript type definitions
└── vite.config.ts    # Vite configuration
```

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini AI
- Lucide React Icons
- Recharts

## License

This project is designed for Ethiopian University Students.

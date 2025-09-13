# Quantum Mechanics Study App 🔬📱

A Progressive Web App (PWA) designed to guide beginners from foundational mathematics to undergraduate-level quantum mechanics. Features structured learning paths, spaced repetition, progress tracking, and curated free resources.

## ✨ Features

- 📱 **Progressive Web App**: Install on iPhone home screen for native-like experience
- 📚 **Structured Learning Path**: From calculus to quantum mechanics
- 🎯 **Spaced Repetition**: SM-2 algorithm for optimal review scheduling
- 📊 **Progress Tracking**: Visual progress indicators and study streaks
- 🔍 **Smart Search**: Find modules and concepts quickly
- 🌙 **Dark/Light Mode**: Modern UI that's easy on the eyes
- 📱 **Mobile-First**: Optimized for studying on any device
- 🔄 **Offline Support**: Study content cached for offline access
- 📤 **Export/Import**: Backup your progress as JSON

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EanHD/physics.git
   cd physics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate content from resources**
   ```bash
   npm run generate:content
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173/physics
   ```

### Production Build

```bash
npm run build
npm run preview
```

## 📖 Study Modules

The app automatically generates structured modules from curated free resources:

- **Calculus**: Single/multivariable calculus foundations
- **Linear Algebra**: Vector spaces, matrices, eigenvalues
- **Differential Equations**: ODEs and boundary value problems  
- **Classical Mechanics**: Newtonian mechanics fundamentals
- **Electromagnetism**: Electric and magnetic fields
- **Thermodynamics**: Heat, entropy, statistical mechanics
- **Quantum Mechanics**: Wave mechanics, Schrödinger equation

## 🎯 Learning Path

```
Math Prerequisites → Classical Physics → Modern Physics → Quantum Mechanics
      ↓                    ↓                ↓               ↓
  Calculus           Classical         Special         Wave Mechanics
  Linear Algebra     Mechanics         Relativity      Operators
  Diff Equations     E&M               Thermodynamics  Measurement
```

## 💾 Data Storage

- **Progress**: Stored locally in IndexedDB (persistent, large capacity)
- **Content**: Cached for offline access via service worker
- **Export**: Download progress as JSON for backup/transfer

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **PWA**: Vite PWA plugin
- **Storage**: localForage (IndexedDB wrapper)
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Actions → GitHub Pages

## 📱 PWA Installation

### iPhone/Safari:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android/Chrome:
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home screen"
4. Tap "Add"

## 🔄 Spaced Repetition

The app implements the SM-2 algorithm for optimal review scheduling:

- **Initial**: Review after 1 day
- **Second**: Review after 6 days  
- **Subsequent**: Interval based on performance
- **Difficulty**: Adjusts based on quiz scores

## 🎨 Modern UI

- **Design System**: Consistent, accessible components
- **Responsive**: Mobile-first design that scales up
- **Dark Mode**: Automatic system detection with manual toggle
- **Animations**: Smooth transitions and micro-interactions
- **Touch-Friendly**: Optimized for mobile interaction

## 🚀 Deployment

The app automatically deploys to GitHub Pages when you push to the main branch:

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **GitHub Actions builds and deploys**
   - Generates content from study resources
   - Builds the app with PWA features
   - Deploys to GitHub Pages

3. **Access your app**
   ```
   https://yourusername.github.io/physics
   ```

## 📝 Content Management

### Adding New Modules

1. Create a new Markdown file in `content/modules/`:
   ```markdown
   ---
   id: your-module-id
   title: Your Module Title
   summary: Brief description
   estimated_minutes: 90
   prerequisites: [prerequisite-module-id]
   tags: [tag1, tag2]
   difficulty: beginner
   ---
   
   # Your Module Content
   
   Content goes here...
   ```

2. Create accompanying quiz in `content/quizzes/`:
   ```json
   {
     "questions": [
       {
         "id": "q1",
         "question": "What is...?",
         "type": "multiple_choice",
         "options": ["A", "B", "C", "D"],
         "correct_answer": "A",
         "explanation": "Because..."
       }
     ]
   }
   ```

### Updating Resources

Edit `physics_study/study_resources.md` and run:
```bash
npm run generate:content
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **MIT OpenCourseWare**: For excellent free course materials
- **Feynman Lectures**: For timeless physics explanations
- **Open Educational Resources**: For making learning accessible to all

## 🔗 Resources Used

All study resources are carefully curated free materials:
- MIT OpenCourseWare courses
- Open-source textbooks  
- Creative Commons licensed content
- Public domain materials

See `physics_study/study_resources.md` for the complete list with links and descriptions.

---

**Start your quantum mechanics journey today!** 🚀✨
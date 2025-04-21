# NEXUS - Premium Task Management Web App



## Overview

NEXUS is a modern, beautifully designed task management web application that helps users organize their daily activities, track habits, take notes, and manage time effectively. The application features a clean, intuitive interface with a stunning animated particle background.

## Features

- **Task Management**: Create, organize, and track your tasks with drag-and-drop functionality
- **Category System**: Organize tasks into customizable categories
- **Habit Tracker**: Monitor daily habits with visual streak tracking
- **Notes**: Quickly jot down and organize important information
- **Timer/Stopwatch**: Track time spent on activities with lap functionality
- **Dark/Light Theme**: Toggle between themes based on your preference
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful glassmorphism design with animated elements

## Tech Stack

- HTML5
- CSS3 (with CSS Variables, Flexbox, and Grid)
- JavaScript (ES6+)
- Three.js for 3D particle animation
- GSAP for smooth animations
- SortableJS for drag-and-drop functionality

## Getting Started

### Prerequisites

This project has no build steps and uses CDN-hosted libraries, so you only need:

- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexus-task-manager.git
cd nexus-task-manager
```

2. Open `index.html` in your browser or use a local server:
```bash
# If you have Python installed:
python -m http.server
# Or if you have Node.js installed:
npx serve
```

### Deployment on Vercel

To deploy the project on Vercel:

1. Push your project to GitHub
2. Connect your GitHub account to Vercel
3. Import the project from your repositories
4. Configure the project with these settings:
   - Framework Preset: Static Site
   - Build Command: (leave empty)
   - Output Directory: ./ (root)
5. Click "Deploy"

## Project Structure

```
nexus-task-manager/
├── index.html         # Main HTML entry point
├── css/
│   └── styles.css     # Styles for the application
├── js/
│   ├── app.js         # Core application functionality
│   └── background.js  # Three.js particle background
└── assets/            # For future image/icon assets
```

## Future Enhancements

- User authentication system
- Cloud synchronization
- Pomodoro timer functionality
- Enhanced analytics
- Export/import data
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for the amazing 3D library
- GSAP for the animation capabilities
- SortableJS for the drag-and-drop functionality
- Feather Icons for clean SVG icons

---

Created with ❤️ for a hackathon project #

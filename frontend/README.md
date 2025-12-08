# VoiceGuard AI - Frontend

React-based web application for AI-powered deepfake audio and video detection with real-time monitoring capabilities.

## 🚀 Tech Stack

### Core Framework
- **React 18** - Modern UI library with hooks
- **Vite** - Next-generation frontend build tool
- **React Router DOM** - Client-side routing

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Custom Components** - Reusable UI components with consistent design system

### State Management
- **React Context API** - Authentication and live monitoring state
- **Local Storage** - Persistent user preferences

### Authentication & Backend
- **Firebase Authentication** - Secure user authentication
- **Firestore** - Cloud database for user data and history
- **Axios** - HTTP client for API communication

### Media Processing
- **Web Audio API** - Real-time audio capture and processing
- **MediaRecorder API** - Audio/video recording
- **Canvas API** - Waveform visualization

## 📁 Project Structure

```
frontend/
├── public/               # Static assets
│   └── sample-audio/    # Sample audio files for testing
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   ├── config/          # Firebase and configuration files
│   ├── contexts/        # React Context providers
│   ├── pages/           # Route page components
│   ├── services/        # Business logic and API services
│   ├── ui/              # Pure UI components
│   └── utils/           # Helper functions and utilities
```

## 📄 Pages

### Public Pages
- **LandingPage** (`/`) - Marketing homepage with features showcase
- **AboutPage** (`/about`) - Team information and project details
- **LoginPage** (`/login`) - User authentication
- **SignupPage** (`/signup`) - New user registration
- **ForgotPasswordPage** (`/forgot-password`) - Password recovery

### Protected Pages (Require Authentication)
- **HomePage** (`/home`) - Dashboard with quick actions
- **AnalyzePage** (`/analyze`) - Upload and analyze audio files
- **AnalyzeVideoPage** (`/analyze-video`) - Upload and analyze video files
- **AnalyzeLivePage** (`/analyze-live`) - Real-time audio monitoring
- **ResultPage** (`/result`) - Detailed analysis results
- **HistoryPage** (`/history`) - Past analysis history
- **Profile** (`/profile`) - User profile management

## 🧩 Components

### Layout Components
- **Navbar** - Responsive navigation header with authentication state
- **Footer** - Site footer with links and information

### Feature Components
- **AudioUploader** - Drag-and-drop audio file uploader
- **LiveMonitorWidget** - Floating widget for real-time detection status
- **Waveform** - Audio waveform visualization
- **ConfidenceGauge** - Visual confidence meter
- **DetectionBadge** - Styled badge for REAL/FAKE labels

### UI Components
- **AlertBox** - Alert messages and notifications
- **EmptyState** - Empty state placeholders
- **LoadingSpinner** - Loading indicators
- **Toast** - Toast notifications
- **PatternTag** - Tag display for detected patterns
- **StatsCard** - Statistic display cards
- **FeatureCard** - Feature showcase cards
- **TeamMemberCard** - Team member profiles
- **TechStackBadge** - Technology badges
- **Iridescence** - Animated background effects

### Utility Components
- **ProtectedRoute** - Route wrapper for authentication

## 🔧 Services

### Audio Capture Service (`audioCapture.js`)
- Microphone audio capture
- System audio capture
- WebM to WAV conversion
- Chunk-based recording for live analysis

### Live Analysis Service (`liveAnalysisService.js`)
- Real-time audio streaming to backend
- Continuous monitoring management
- Result handling and state updates

### API Service (`utils/api.js`)
- Centralized API communication
- Audio/video upload handling
- Analysis result retrieval
- Error handling and retries

## 🎨 Contexts

### AuthContext
- User authentication state
- Login/logout functionality
- Firebase integration
- Protected route management

### LiveMonitorContext
- Live monitoring state
- Audio source selection (microphone/system)
- Real-time detection results
- Persistent monitoring preferences

## 🛠️ Configuration

### Firebase (`config/firebase.js`)
- Firebase SDK initialization
- Authentication configuration
- Firestore setup

### Firestore Paths (`config/firestorePaths.js`)
- Database path constants
- Collection references

## 🎯 Key Features

- **Real-time Audio Monitoring** - Continuous background audio analysis
- **Multi-format Support** - WAV, MP3, WebM audio; MP4, AVI, MOV video
- **Drag-and-drop Upload** - Intuitive file upload interface
- **Confidence Visualization** - Visual representation of detection confidence
- **Analysis History** - Track and review past detections
- **Responsive Design** - Mobile-friendly interface
- **Dark Theme** - Modern dark UI with maroon and beige accents

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚢 Deployment

The frontend is containerized using Docker:

```bash
# Build Docker image
docker build -t voiceguard-frontend .

# Run container
docker run -p 5173:5173 voiceguard-frontend
```

## 🎨 Design System

### Color Palette
- **Primary**: Maroon (#800020)
- **Secondary**: Beige (#F5F5DC)
- **Background**: Dark (#000000)
- **Accent**: Maroon variants (#991B1B, #DC2626)

### Typography
- **Font Family**: System fonts (sans-serif stack)
- **Sizes**: Responsive scale from text-xs to text-6xl

### Spacing
- **Consistent Padding**: px-4, py-2, gap-2, gap-4
- **Responsive Margins**: Tailwind spacing scale

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Authentication Flow

1. User signs up/logs in via Firebase Authentication
2. Auth state managed by AuthContext
3. Protected routes redirect unauthenticated users
4. User data stored in Firestore
5. Session persists across page reloads

## 🎵 Live Monitoring Flow

1. User enables live monitoring
2. Audio captured via MediaRecorder API
3. 10-second chunks sent to backend
4. Real-time analysis results displayed
5. Widget shows latest detection status
6. State persists in localStorage

## 📊 Analysis Flow

1. User uploads audio/video file
2. File sent to backend via API
3. Backend processes and returns results
4. Results displayed with confidence metrics
5. Analysis saved to user history
6. User can review past analyses

## 🤝 Contributing

This frontend is part of the VoiceGuard AI project. Follow the main project's contribution guidelines.

## 📄 License

Part of the VoiceGuard AI project.

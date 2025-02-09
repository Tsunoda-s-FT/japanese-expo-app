# Japanese Learning App

A mobile application for learning Japanese, built with Expo and TypeScript.

## Features

- Browse through Japanese lessons and phrases
- Practice pronunciation with audio playback
- Take quizzes to test your knowledge
- Track your learning progress

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS or Android:
```bash
npm run ios
# or
npm run android
```

## Project Structure

```
japanese-expo-app/
├── assets/
│   ├── audio/         # Audio files for phrases
│   └── data/          # JSON data files
├── src/
│   ├── navigation/    # Navigation configuration
│   ├── screens/       # Screen components
│   ├── components/    # Reusable components
│   ├── context/       # React Context providers
│   ├── services/      # Business logic and API calls
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
└── ...
```

## Dependencies

- React Navigation
- React Native Paper
- Expo AV
- TypeScript

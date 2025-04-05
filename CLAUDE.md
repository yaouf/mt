# BDH Mobile App Development Guide

## Build & Test Commands

- **Frontend** (React Native):
  - `cd frontend && yarn start` - Start development server with tunnel
  - `cd frontend && yarn ios` - Run on iOS simulator
  - `cd frontend && yarn android` - Run on Android
  - `cd frontend && yarn doctor` - Run Expo Doctor to diagnose issues
  - `cd frontend && yarn fix` - Run Expo install --fix to resolve dependency issues
  - `cd frontend && yarn build:ios` - Build iOS app with EAS
  - `cd frontend && yarn submit:ios` - Submit iOS app to App Store

- **Backend** (Next.js NMS):
  - `cd backend/nms && npm run dev` - Start dev server with Redis
  - `cd backend/nms && npm run test` - Run all tests
  - `cd backend/nms && npm run test -- -t "test name"` - Run specific test
  - `cd backend/nms && npm run lint` - Lint code

## Code Style Guidelines

- **TypeScript:** Use strict typing everywhere with interfaces/types defined in `/src/types/`
- **Components:** Functional components with React hooks
- **Naming:** camelCase for variables/functions, PascalCase for components/types
- **Error Handling:** Use try/catch with specific error logging
- **Imports:** Group by: React, navigation, external libraries, then local imports
- **Environment Variables:** Use through `@env` from react-native-dotenv
- **Styling:** Component-specific styles in `/src/styles/` directory
- **API Calls:** Defined in `/src/api/` with proper error handling and typing

## Project Structure

Frontend React Native app with Expo. Navigation with React Navigation (stack, tabs, drawer). Environment variables through dotenv. Backend uses Next.js API routes and Redis queue for notifications.

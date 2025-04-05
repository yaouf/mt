# Brown Daily Herald Mobile App Frontend

A React Native application built with Expo for The Brown Daily Herald news outlet.

## Project Setup

### Prerequisites

- Node.js (v14+)
- Yarn
- Expo CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Environment Setup

1. Create a `.env` file in the root directory with necessary environment variables:
   ```
   EXPO_PUBLIC_API_KEY=your_api_key
   EXPO_PUBLIC_CREATE_DEVICE_ENDPOINT=endpoint_url
   EXPO_PUBLIC_UPDATE_SETTINGS_ENDPOINT=endpoint_url
   EXPO_PUBLIC_VIEW_SETTINGS_ENDPOINT=endpoint_url
   ```

### Installation

```bash
yarn install
```

## Development

### Running the App

```bash
# Start the development server with tunnel
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator/device
yarn android
```

### Utility Commands

```bash
# Diagnose Expo issues
yarn doctor

# Fix dependency issues
yarn fix

# Build iOS app with EAS
yarn build:ios

# Submit iOS app to App Store
yarn submit:ios
```

## Project Structure

### Core Folders

- `/src`: Main source code
  - `/api`: API client functions for backend communication
  - `/components`: Reusable UI components
    - `/cards`: Article card variants (HorizontalCard, LargeCard, etc.)
    - `/common`: Shared UI elements
  - `/consts`: Constants and configuration
  - `/onboarding`: Onboarding flow screens
  - `/pages`: Main application screens
    - `/article`: Article display screens
    - `/home`: Home screen components
    - `/search`: Search functionality
    - `/sections`: Section-specific screens
    - `/settings`: User preferences and saved content
    - `/staff`: Staff information
  - `/styles`: Styling definitions
  - `/types`: TypeScript type definitions
  - `/utils`: Utility functions
- `/assets`: Static resources (images, fonts, icons)

### Main Components

- `BdhApp.tsx`: Root application component with navigation setup
- `MainTabNavigator.tsx`: Bottom tab navigation configuration

## Navigation

The app uses React Navigation with a combination of:

- Stack navigators for screen flows
- Bottom tab navigator for main navigation
- Drawer navigator for filters

## Styling

Styles are organized in the `/src/styles` directory with specific files for different sections:

- `styles.tsx`: Common styles
- `article.tsx`: Article-specific styles
- `pages.tsx`: Page-level styles
- `search.tsx`: Search-related styles
- `sectionMenu.tsx`: Section menu styles

## Notable Features

- Push notifications support via Expo Notifications
- Deep linking configuration
- Onboarding flow for first-time users
- Article saving/bookmarking functionality
- Section-based content filtering

## Build and Deployment

The app uses EAS (Expo Application Services) for building and submitting to app stores:

```bash
# Build for iOS
yarn build:ios

# Submit to App Store
yarn submit:ios
```

Configuration for builds is in `eas.json` at the project root.

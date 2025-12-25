# AstroChat - AI Astrology Chat Application

A premium, feature-rich astrology chat application built with React Native (Expo) showcasing modern mobile UI patterns, smooth animations, and interactive messaging features.

## 🌟 Features

### Core Chat Features
- **Swipe-to-Reply**: Smooth gesture-based reply interaction with visual feedback
- **Message Reactions**: Long-press messages to add emoji reactions (WhatsApp-style positioning)
- **AI Feedback System**: Like/Dislike feedback with reason selection for AI responses
- **Session Management**: End chat sessions with rating system
- **Real-time Typing Indicators**: Animated typing indicators for AI responses
- **Message Actions**: Copy, Forward, Delete, and Reply to messages

### UI/UX Highlights
- **Dark Mode Support**: Seamless theme switching with persistent preferences
- **Premium Design**: Modern celestial-themed UI with midnight blue and gold accents
- **Smooth Animations**: 60fps animations using Reanimated 4
- **Native Gestures**: Gesture Handler 2 for fluid interactions
- **WhatsApp-Style Reactions**: Reactions appear in bottom-right corner bubbles
- **Auto-Dismiss Overlays**: Smart overlay dismissal after user interactions

### Profile & Personalization
- **Astrological Profile**: Birth details (Date, Time, Place) with inline editing
- **Astro Data Display**: Sun sign, Moon sign, Ascendant, and current Dasha
- **AI Astrologer Roster**: Multiple specialized AI astrologers (Love, Career, Health, Finance)
- **Astrologer Profiles**: Detailed bios with experience, specialties, and expertise tags

### Additional Features
- **Examiner's Guide**: Built-in evaluation guide tab for feature showcase
- **Subscription Management**: Active subscription display with plan details
- **Welcome Screen**: Onboarding flow with feature highlights
- **Cross-Platform**: Optimized for both iOS and Android

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (via nvm)
- npm or yarn
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone and Install**:
   ```bash
   cd astrochat
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npx expo start
   ```

3. **Run on Platform**:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: React Native 0.81 (New Architecture)
- **Routing**: Expo Router (File-based routing)
- **Animations**: Reanimated 4 (UI thread animations)
- **Gestures**: React Native Gesture Handler 2
- **State Management**: React Context + useState
- **Styling**: StyleSheet with dynamic theming
- **Typography**: Outfit font family (Google Fonts)
- **Safe Areas**: react-native-safe-area-context

### Project Structure

```
astrochat/
├── app/
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── chat/            # Chat list screen
│   │   ├── guide.tsx        # Examiner's guide
│   │   └── profile.tsx      # User profile
│   ├── chat/[id].tsx        # Individual chat screen
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Welcome screen
├── components/
│   ├── AIFeedback.tsx       # Like/Dislike feedback UI
│   ├── AstrologerBioModal.tsx
│   ├── MessageBubble.tsx    # Message component with gestures
│   ├── NewChatModal.tsx     # AI astrologer selection
│   ├── ReactionOverlay.tsx  # Reaction picker overlay
│   ├── SessionEndModal.tsx  # Chat rating modal
│   └── TypingIndicator.tsx  # Animated typing dots
├── constants/
│   └── Colors.ts            # Theme definitions
├── context/
│   └── ThemeContext.tsx     # Theme state management
├── data/
│   ├── chatData.ts          # Mock chat data
│   └── userData.ts          # User profile data
├── types.ts                 # TypeScript definitions
└── assets/
    └── images/              # App assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Modern Blue (#007AFF)
- **Secondary**: Celestial Gold (#FFD700)
- **Background (Dark)**: Midnight Blue (#0A0E27)
- **Surface (Dark)**: Deep Space (#1A1F3A)
- **Text**: High contrast whites and grays

### Typography
- **Headings**: Outfit Bold
- **Body**: Outfit Regular
- **UI Elements**: Outfit Medium

### Spacing
- Base unit: 4px
- Standard padding: 12-16px
- Message margins: 4px vertical

## 💡 Key Implementation Details & Technical Decisions

### 1. Animations (Reanimated 3+)
**Implementation**: 
- Used `useSharedValue` for performant, reactive state (e.g., `translateX`, `scale`).
- Leveraged `useAnimatedStyle` to map these values to transform properties.
- Employed `entering` and `exiting` layout animations (e.g., `FadeIn`, `ZoomIn`) for smooth component mounting/unmounting.

**Why Reanimated?**
- **Performance**: Animations execute on the **UI thread**, ensuring 60fps performance even if the JavaScript thread is heavy with business logic.
- **Declarative API**: Layout animations simplify complex entrance/exit transitions without manual state interpolation.

### 2. Gesture Handling (Gesture Pan & LongPress)
**Implementation**: 
- **Swipe-to-Reply**: `Gesture.Pan()` tracks horizontal movement. Logic runs on the UI thread via worklets to provide instant feedback.
- **Tactile Long-Press**: `Gesture.LongPress()` combined with `expo-haptics`. We implemented a "shrink" effect on touch-down (`onBegin`) and a "pop" on activation (`onStart`) to mimic premium native interaction.

**Why UI Thread?**
- Moving gesture logic to the UI thread prevents "lag" during complex interactions, maintaining standard native feel.

### 3. State Management (React Context)
**Implementation**: 
- Used `useContext` for global themes (`ThemeContext`) and strictly local `useState` for UI interactions (replying, typing).
- **No Redux/Zustand**: Deliberately avoided external state libraries.

**Why Context?**
- **Simplicity**: For this scope (single screen chat + profile), Context provides sufficient global reach without the boilerplate of Redux.
- **Performance**: Theme changes are infrequent, making Context an efficient choice. Local component state handles high-frequency updates (like input text) to avoid global re-renders.

### 4. AI Feedback System
- **Optimistic Updates**: UI updates immediately upon user interaction (Like/Dislike).
- **Auto-Dismiss**: "Liked" feedback automatically dismisses the overlay after a short delay for a seamless flow.

## 🎯 Performance Optimizations

1.  **UI Thread First**: All high-frequency updates (scroll, swipe, drag) bypass the JS bridge.
2.  **Memoization**: `React.memo` and `useCallback` prevent unnecessary re-renders of the heavy message list.
3.  **Lazy Loading**: Components like `ReactionOverlay` are conditionally rendered to keep the initial DOM light.
4.  **Haptic Feedback**: Used `runOnJS` to trigger haptics from within UI worklets, bridging the gap between smooth animations and physical feedback.

## 🔧 Configuration

### App Configuration (`app.json`)
- **Name**: AstroChat
- **Slug**: astrochat
- **Icon**: Custom celestial logo
- **Splash Screen**: Midnight blue with logo
- **Orientation**: Portrait only
- **Platforms**: iOS, Android, Web

### Environment
- **Node**: 20+ (via nvm)
- **Expo SDK**: 52
- **React Native**: 0.81

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React hooks best practices
- Keep components focused and reusable
- Use meaningful variable names
- Comment complex logic

### Component Structure
```tsx
// 1. Imports
// 2. Types/Interfaces
// 3. Component definition
// 4. Hooks (in correct order)
// 5. Event handlers
// 6. Render logic
// 7. Styles
```

### Git Workflow
- Feature branches from main
- Descriptive commit messages
- PR reviews before merge

## 🐛 Known Issues & Limitations

- Mock data only (no backend integration)
- Limited to predefined AI responses
- No real-time messaging
- No push notifications

## 🚀 Future Enhancements

- [ ] Backend integration with real API
- [ ] Real-time messaging with WebSockets
- [ ] Push notifications
- [ ] Voice messages
- [ ] Image sharing
- [ ] Payment integration for subscriptions
- [ ] Chat history persistence
- [ ] Multi-language support

## 📄 License

This project is for assessment purposes.

## 👥 Contact

For questions or feedback, please reach out to the development team.

---

**Built with ❤️ using React Native & Expo**

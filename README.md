# AstroChat - AI Astrology Chat Application

A premium, feature-rich astrology chat application built with React Native (Expo) showcasing modern mobile UI patterns, smooth animations, and interactive messaging features.

![AstroChat Logo](./assets/images/logo.png)

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
- Node.js 18+ 
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

## 💡 Key Implementation Details

### 1. Swipe-to-Reply Gesture
```tsx
// Uses Gesture.Pan() with UI thread animations
const panGesture = Gesture.Pan()
  .activeOffsetX([-10, 10])
  .onUpdate((event) => {
    translateX.value = event.translationX * 0.3; // Resistance
    if (event.translationX > REPLY_THRESHOLD) {
      replyIconOpacity.value = withTiming(1);
    }
  })
  .onEnd((event) => {
    if (event.translationX > REPLY_THRESHOLD) {
      runOnJS(onSwipeToReply)(message);
    }
    translateX.value = withSpring(0);
  });
```

**Why**: Running on UI thread ensures 60fps even when JS thread is busy.

### 2. WhatsApp-Style Reactions
- Positioned absolutely at `bottom: -8px, right: -8px`
- Container gets `marginBottom: 12px` when reactions present
- Click to remove reaction functionality
- Smooth fade-in/out animations

### 3. AI Feedback with Auto-Dismiss
```tsx
// Dismisses overlay after feedback selection
const handlePress = (type: 'liked' | 'disliked') => {
  setFeedback(type);
  onFeedbackChange?.(messageId, type);
  
  if (type === 'liked') {
    setTimeout(() => onDismiss?.(), 300); // Auto-dismiss
  }
};
```

### 4. Theme Switching
- Uses React Context for global theme state
- Persists preference (can be extended with AsyncStorage)
- Dynamic color application across all components
- Smooth transitions without flicker

### 5. Cross-Platform SafeAreaView
```tsx
// Proper edges configuration for iOS and Android
<SafeAreaView edges={['top', 'left', 'right']}>
  {/* Content */}
</SafeAreaView>
```

## 🧪 Testing & Quality

### Linting
```bash
# TypeScript type checking
npx tsc --noEmit

# ESLint
npx eslint . --ext .ts,.tsx
```

### Current Status
- ✅ **0 TypeScript errors**
- ✅ **0 critical ESLint errors**
- ⚠️ 31 minor warnings (unused imports/variables)

## 📱 Platform-Specific Notes

### iOS
- Uses native date/time pickers
- Respects notches and safe areas
- Smooth gesture interactions

### Android
- Material Design ripple effects
- Navigation bar handling
- Keyboard avoiding behavior

## 🎯 Performance Optimizations

1. **UI Thread Animations**: All gestures and animations run on UI thread via Reanimated
2. **Lazy Loading**: Components render on-demand
3. **Memoization**: React.memo for expensive components
4. **Optimized Re-renders**: Proper dependency arrays in hooks
5. **Native Driver**: All animations use native driver where possible

## 🔧 Configuration

### App Configuration (`app.json`)
- **Name**: AstroChat
- **Slug**: astrochat
- **Icon**: Custom celestial logo
- **Splash Screen**: Midnight blue with logo
- **Orientation**: Portrait only
- **Platforms**: iOS, Android, Web

### Environment
- **Node**: 18+
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

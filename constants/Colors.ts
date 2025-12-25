/**
 * MyNaksh Premium Theme Palette
 * Theme: "Modern Professional"
 * A clean, high-contrast, and universally appealing Blue & Slate theme.
 * Similar to iMessage / Messenger / Telegram.
 */

const palette = {
    // Brand Colors
    royalBlue: '#2563EB',   // Professional Bright Blue
    royalBlueDark: '#1E40AF',
    
    amber: '#EA580C',       // Deep Orange accent (subtle)
    gold: '#FACC15',        // Bright Gold for ratings
    
    // Functional
    success: '#10B981',     // Emerald
    error: '#EF4444',       // Red
    warning: '#F59E0B',     // Amber
    info: '#3B82F6',        // Blue
    
    // Grayscale (Tailwind Slate)
    white: '#FFFFFF',
    slate50: '#F8FAFC',
    slate100: '#F1F5F9',
    slate200: '#E2E8F0',
    slate300: '#CBD5E1',
    slate400: '#94A3B8',
    slate500: '#64748B',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1E293B',
    slate900: '#0F172A',
    black: '#000000',
};

export const Colors = {
  light: {
    primary: palette.royalBlue,
    secondary: palette.gold,
    background: palette.white,
    surface: palette.slate50,
    
    text: {
      primary: palette.slate900,
      secondary: palette.slate600,
      tertiary: palette.slate400,
      inverse: palette.white,
    },
    
    fonts: {
      regular: 'Outfit',
      bold: 'Outfit-Bold',
      heading: 'Outfit',
      headingBold: 'Outfit-Bold',
    },

    message: {
      userBackground: palette.royalBlue,
      userText: palette.white,
      aiBackground: palette.slate100,
      aiText: palette.slate900,
      aiBorder: palette.slate200,
      systemBackground: palette.slate100,
      systemText: palette.slate500,
      reply: {
        background: palette.slate200,
        border: palette.royalBlue,
        text: palette.slate600,
        userBackground: 'rgba(255, 255, 255, 0.2)', 
        userText: 'rgba(255, 255, 255, 0.9)',
      }
    },

    feedback: {
      success: palette.success,
      error: palette.error,
      warning: palette.warning,
      neutral: palette.slate300,
    },
    
    shadow: {
      color: palette.slate900,
      opacity: 0.08,
      radius: 8,
      elevation: 4,
    },
    
    overlay: 'rgba(0,0,0,0.4)',
    tint: palette.royalBlue,
    tabIconDefault: palette.slate400,
    tabIconSelected: palette.royalBlue,
  },
  
  dark: {
    primary: palette.royalBlue, // Keep Royal Blue for brand consistency, ensures white text visibility
    secondary: palette.gold,
    background: '#0B1120', // Deep Midnight Blue (Darker than slate900)
    surface: '#151E32',    // Lighter Midnight Blue
    
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      tertiary: '#64748B',
      inverse: '#FFFFFF',
    },

    fonts: {
      regular: 'Outfit',
      bold: 'Outfit-Bold',
      heading: 'Outfit',
      headingBold: 'Outfit-Bold',
    },

    message: {
      userBackground: palette.royalBlue,
      userText: palette.white,
      aiBackground: '#1E293B', // Slate 800
      aiText: '#F1F5F9',
      aiBorder: '#334155',
      systemBackground: '#1E293B',
      systemText: '#94A3B8',
      reply: {
        background: '#1E293B',
        border: palette.royalBlue,
        text: '#94A3B8',
        userBackground: 'rgba(255, 255, 255, 0.1)',
        userText: 'rgba(255, 255, 255, 0.9)',
      }
    },

    feedback: {
      success: '#34D399', // Emerald 400 - Brighter for dark mode
      error: '#F87171',
      warning: palette.gold,
      neutral: palette.slate600,
    },
    
    shadow: {
      color: '#000000',
      opacity: 0.8,
      radius: 12,
      elevation: 6,
    },
    
    overlay: 'rgba(0,0,0,0.8)',
    tint: palette.white,
    tabIconDefault: '#64748B',
    tabIconSelected: palette.royalBlue, // Changed to Royal Blue to match brand
  }
};

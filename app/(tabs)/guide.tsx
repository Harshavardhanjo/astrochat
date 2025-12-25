import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ThemedText, H2, H3, BodyBold, Body, Caption, Label, Small } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useThemeContext } from '../../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const FeatureItem = ({ icon, title, description, badge, theme }: any) => {
  const isCore = badge === 'CORE';
  const badgeColor = isCore ? theme.primary : '#06b6d4'; // Gold/Primary or Cyan
  
  return (
    <Animated.View 
      entering={FadeInDown.delay(200).springify()}
      style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.message.aiBorder }]}
    >
      <View style={styles.featureHeader}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
          <Ionicons name={icon} size={24} color={theme.primary} />
        </View>
        <View style={styles.featureTitleContainer}>
          <BodyBold style={{ color: theme.text.primary }}>{title}</BodyBold>
          {badge && (
            <View style={[
              styles.badge, 
              { 
                backgroundColor: badgeColor + '15', // 15% opacity background
                borderColor: badgeColor,
                borderWidth: 1
              }
            ]}>
              <Label style={{ color: badgeColor, fontSize: 10, letterSpacing: 1 }}>{badge}</Label>
            </View>
          )}
        </View>
      </View>
      <Body style={{ color: theme.text.secondary }}>
        {description}
      </Body>
    </Animated.View>
  );
};

export default function GuideScreen() {
  const { theme: currentTheme, isDark } = useThemeContext();
  const theme = Colors[currentTheme];

  const evaluationPoints = [
    {
      title: "Part A: Interaction Performance",
      features: [
        {
          icon: "swap-horizontal-outline",
          title: "Swipe-to-Reply",
          description: "Try swiping any message to the right. Notice the haptic feel, the spring-back animation, and the 'Replying' UI preview. Uses Reanimated 3 & Gesture Handler.",
          badge: "CORE"
        },
        {
          icon: "happy-outline",
          title: "Message Reactions",
          description: "Long-press any message bubble. Experience the WhatsApp-style transition: background blur, centered message focus, and animated emoji bar.",
          badge: "CORE"
        }
      ]
    },
    {
      title: "Part B: Session Logic",
      features: [
        {
          icon: "thumbs-down-outline",
          title: "AI Feedback Loop",
          description: "Send a message to an AI astrologer. Use the Like/Dislike toggle. Notice the animated feedback chips expansion on 'Dislike'.",
          badge: "CORE"
        },
        {
          icon: "exit-outline",
          title: "Session Termination",
          description: "Tap 'End Chat' in the header. Observe the full-screen layout animation, star rating system, and data capture alert.",
          badge: "CORE"
        }
      ]
    },
    {
      title: "Bonus: Premium Polish",
      features: [
        {
          icon: "moon-outline",
          title: "Celestial Dark Mode",
          description: "Enable Dark Mode in the Profile tab. The app transforms into a 'Midnight Blue' theme inspired by luxury astrology apps.",
          badge: "BONUS"
        },
        {
          icon: "calendar-outline",
          title: "Smart Profile Editing",
          description: "In Profile, tap birth details to see native modal pickers (calendar/time) or inline editing. Everything saves instantly.",
          badge: "BONUS"
        },
        {
            icon: "sparkles-outline",
            title: "AI Personalities",
            description: "Go to 'New Chat' to see various AI astrologer categories (Finance, Love, Health). Each has unique bios and tags.",
            badge: "BONUS"
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <H2 style={{ color: theme.text.primary }}>
          Evaluation Guide
        </H2>
        <Caption style={{ color: theme.text.secondary }}>
          A guide for examiners to explore all features
        </Caption>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.welcomeBox, { backgroundColor: theme.primary }]}>
          <H3 style={{ color: '#fff', marginBottom: 8 }}>Welcome Examiner! 👋</H3>
          <Body style={{ color: 'rgba(255,255,255,0.9)' }}>
            This application goes beyond basic chat to demonstrate high-performance animations, fluid gesture logic, and a premium design system.
          </Body>
        </View>

        {evaluationPoints.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <BodyBold style={{ color: theme.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              {section.title}
            </BodyBold>
            {section.features.map((feature, fIdx) => (
              <FeatureItem key={fIdx} {...feature} theme={theme} />
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <View style={[styles.ctaContainer, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}>
             <Ionicons name="chatbubbles" size={24} color={theme.primary} />
             <BodyBold style={{ color: theme.primary, textAlign: 'center', flex: 1 }}>
                Ready to explore? Tap the "Chat" or "Profile" tab below! 👇
             </BodyBold>
          </View>
          <Small style={{ color: theme.text.tertiary, marginTop: 20 }}>
            Built with Reanimated 3, Gesture Handler, and lots of ✨
          </Small>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featureCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureTitle: {
    fontSize: 16,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  ctaContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 12,
     paddingHorizontal: 20,
     paddingVertical: 12,
     borderRadius: 30,
     borderWidth: 1,
     marginHorizontal: 10, // Added margin to prevent hitting screen edges
  },
  footerText: {
    fontSize: 12,
  },
});

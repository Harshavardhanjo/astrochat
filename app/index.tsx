import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { ThemedText, H1, Body, BodyBold, Caption } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { useThemeContext } from '../context/ThemeContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme: currentTheme, toggleTheme } = useThemeContext();
  const theme = Colors[currentTheme];

  const features = [
    { icon: 'chatbubbles', title: 'Real-time Chat', desc: 'Experience smooth, animated conversations with auto-scroll.' },
    { icon: 'sparkles', title: 'AI Simulation', desc: 'Watch typing indicators and instant smart replies.' },
    { icon: 'moon', title: 'Dark Mode', desc: 'Seamlessly switch themes in Settings.' },
  ];

  const handleGetStarted = () => {
    router.replace('/(tabs)/guide');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        
        {/* Header Image / Icon */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
            <Image 
                source={require('../assets/images/logo.png')} 
                style={{ width: 100, height: 100, marginBottom: 20 }} 
                resizeMode="contain" 
            />
            <H1 style={{ color: theme.text.primary }}>
                AstroChat
            </H1>
            <Body style={{ color: theme.text.secondary }}>
                Premium Astrological Guidance
            </Body>
        </Animated.View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
                <Animated.View 
                    key={index} 
                    entering={FadeInDown.delay(index * 200).springify()}
                    style={[styles.featureCard, { backgroundColor: theme.surface }]}
                >
                    <View style={[styles.featureIcon, { backgroundColor: theme.message.aiBackground }]}>
                        <Ionicons name={feature.icon as any} size={24} color={theme.primary} />
                    </View>
                    <View style={styles.featureText}>
                        <BodyBold style={{ color: theme.text.primary }}>{feature.title}</BodyBold>
                        <Caption style={{ color: theme.text.secondary }}>{feature.desc}</Caption>
                    </View>
                </Animated.View>
            ))}
        </View>

        {/* Start Button */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.footer}>
            <TouchableOpacity 
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleGetStarted}
                activeOpacity={0.8}
            >
                <BodyBold style={{ color: '#fff' }}>Get Started</BodyBold>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    gap: 16,
    marginVertical: 40,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
  }
});

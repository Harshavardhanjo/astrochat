import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { H1, Body, BodyBold, Caption } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { useThemeContext } from '../context/ThemeContext';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  useAnimatedStyle, 
  withDelay,
  Easing,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// --- Star Component ---
const Star = ({ index }: { index: number }) => {
  const randomX = Math.random() * width;
  const randomY = Math.random() * height;
  const size = Math.random() * 2 + 1; // 1-3px
  const duration = Math.random() * 3000 + 2000;
  const delay = Math.random() * 2000;
  
  const opacity = useSharedValue(0.2);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
      ), 
      -1, 
      true
    ));
    
    scale.value = withDelay(delay, withRepeat(
      withSequence(
         withTiming(1.5, { duration: duration }),
         withTiming(1, { duration: duration })
      ),
      -1,
      true
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View 
      style={[
        styles.star, 
        { 
          left: randomX, 
          top: randomY, 
          width: size, 
          height: size, 
          borderRadius: size / 2 
        },
        style
      ]} 
    />
  );
};

// --- Pulsing Button Component ---
const PulsingButton = ({ onPress, theme }: { onPress: () => void, theme: any }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={rStyle}>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <BodyBold style={{ color: '#fff', letterSpacing: 1 }}>GET STARTED</BodyBold>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme: currentTheme } = useThemeContext();
  const theme = Colors[currentTheme];

  // Generate 80 stars
  const stars = Array.from({ length: 80 }).map((_, i) => <Star key={i} index={i} />);

  const features = [
    { icon: 'chatbubbles', title: 'Cosmic Chat', desc: 'Real-time astrological guidance powered by AI logic.' },
    { icon: 'planet', title: 'Live Simulation', desc: 'Planetary movements and typing animations.' },
    { icon: 'moon', title: 'Moon Phase', desc: 'Personalized themes based on lunar cycles.' },
  ];

  const handleGetStarted = () => {
    router.replace('/(tabs)/guide');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#020516' }]}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Starry Background */}
      <View style={StyleSheet.absoluteFill}>
         {stars}
      </View>

      {/* 2. Floating Celestial Elements (Parallax Layers) */}
      <Animated.View entering={FadeInDown.duration(2000)} style={styles.floatingMoon}>
         <Ionicons name="moon" size={300} color="#4F5D7E" style={{ opacity: 0.1 }} />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* Header */}
          <Animated.View entering={FadeInUp.springify()} style={styles.header}>
              <View style={[styles.logoGlow, { shadowColor: theme.primary }]} />
              <Image 
                  source={require('../assets/images/logo.png')} 
                  style={styles.logo} 
                  resizeMode="contain" 
              />
              <H1 style={[styles.title, { color: '#fff' }]}>
                  AstroChat
              </H1>
              <Body style={[styles.subtitle, { color: '#8F9BB3' }]}>
                  Your Personal Gateway to the Stars
              </Body>
          </Animated.View>

          {/* Glassmorphism Feature Cards */}
          <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                  <Animated.View 
                      key={index} 
                      entering={FadeInDown.delay(300 + index * 150).springify()}
                      style={styles.cardContainer}
                  >
                      <BlurView intensity={30} tint="dark" style={styles.glassCard}>
                          <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                              <Ionicons name={feature.icon as any} size={24} color="#FFD700" />
                          </View>
                          <View style={styles.featureText}>
                              <BodyBold style={{ color: '#fff' }}>{feature.title}</BodyBold>
                              <Caption style={{ color: 'rgba(255,255,255,0.7)' }}>{feature.desc}</Caption>
                          </View>
                      </BlurView>
                  </Animated.View>
              ))}
          </View>

          {/* Footer with Pulsing Button */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.footer}>
              <PulsingButton onPress={handleGetStarted} theme={theme} />
          </Animated.View>

        </View>
      </SafeAreaView>
      
      {/* Bottom Gradient overlay for blending */}
      <View style={styles.bottomGradient} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
  floatingMoon: {
    position: 'absolute',
    top: -50,
    right: -100,
    transform: [{ rotate: '15deg' }],
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    top: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 30,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    opacity: 0.2,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  featuresContainer: {
    gap: 16,
    marginVertical: 20,
  },
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
  footer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'transparent',
  }
});

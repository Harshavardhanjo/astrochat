import React, { useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence, 
  withDelay,
  Easing
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

export const TypingIndicator = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const Dot = ({ delay }: { delay: number }) => {
    const opacity = useSharedValue(0.3);
    const translateY = useSharedValue(0);

    useEffect(() => {
      opacity.value = withDelay(delay, withRepeat(
        withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.3, { duration: 400 })
        ), -1, true
      ));
      
      translateY.value = withDelay(delay, withRepeat(
        withSequence(
            withTiming(-4, { duration: 400, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ), -1, true
      ));
    }, []);

    const style = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    }));

    return (
      <Animated.View style={[styles.dot, { backgroundColor: theme.text.secondary }, style]} />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.message.aiBackground, borderBottomLeftRadius: 4 }]}>
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    gap: 4,
    height: 44, // Match approx height of single line
    width: 60,
    justifyContent: 'center'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  }
});

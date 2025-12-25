import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert, Animated as RNAnimated } from 'react-native';
import { ThemedText, H2, Body, BodyBold } from './ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withDelay,
  ZoomIn,
  FadeIn,
  withSequence,
  runOnJS,
  withTiming
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { BlurView } from 'expo-blur';
import { useThemeContext } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

interface SessionEndModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const StarButton = ({ 
  star, 
  rating, 
  onPress, 
  theme 
}: { 
  star: number, 
  rating: number, 
  onPress: (star: number) => void,
  theme: any 
}) => {
  const scale = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = () => {
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    onPress(star);
  };

  return (
    <Animated.View style={rStyle}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={{ padding: 4 }}>
        <Ionicons 
            name={star <= rating ? "star" : "star-outline"} 
            size={40} 
            color={star <= rating ? "#FFD700" : theme.text.tertiary} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const SessionEndModal: React.FC<SessionEndModalProps> = ({ visible, onClose, onSubmit }) => {
  const { theme: currentTheme } = useThemeContext();
  const theme = Colors[currentTheme];
  const isDark = currentTheme === 'dark';
  
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
        // Haptics for error
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
    
    // Delay closing to show "Thank You"
    setTimeout(() => {
        onSubmit(rating);
        // Reset state
        setSubmitted(false);
        setRating(0);
        
        // Show the alert as requested by the task
        Alert.alert("Rating Captured", `You rated the session ${rating} stars.`);
    }, 1500);
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      {/* Full Screen Blur Overlay */}
      <BlurView intensity={isDark ? 80 : 50} tint={isDark ? "dark" : "light"} style={styles.overlay}>
        
        {/* Glassmorphism Card */}
        <Animated.View entering={FadeIn.duration(200)} style={[
            styles.card, 
            { 
               backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
               borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }
        ]}>
            {!submitted ? (
                <View style={{ alignItems: 'center' }}>
                    <H2 style={{ color: theme.text.primary, marginBottom: 8 }}>Rate Session</H2>
                    <Body style={{ color: theme.text.secondary, textAlign: 'center', marginBottom: 24 }}>
                        How was your consultation with Astrologer Vikram?
                    </Body>

                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                           <StarButton 
                              key={star} 
                              star={star} 
                              rating={rating} 
                              onPress={setRating} 
                              theme={theme}
                           />
                        ))}
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity 
                            onPress={onClose} 
                            style={[styles.cancelButton, { borderColor: theme.text.tertiary }]}
                        >
                            <BodyBold style={{ color: theme.text.secondary }}>Cancel</BodyBold>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={handleSubmit} 
                            style={[
                                styles.submitButton, 
                                { 
                                    backgroundColor: rating > 0 ? theme.primary : theme.text.tertiary,
                                    opacity: rating > 0 ? 1 : 0.7
                                }
                            ]}
                            disabled={rating === 0}
                        >
                            <BodyBold style={{ color: '#fff' }}>Submit</BodyBold>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Animated.View entering={FadeIn} style={styles.thankYouContainer}>
                    <Ionicons name="checkmark-circle" size={60} color="#10B981" />
                    <H2 style={{ color: theme.text.primary, marginTop: 16 }}>Thank You!</H2>
                    <Body style={{ color: theme.text.secondary, marginTop: 4 }}>Your feedback helps us improve.</Body>
                </Animated.View>
            )}
        </Animated.View>

      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 30,
    padding: 32,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    justifyContent: 'center',
    gap: 8,
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  thankYouContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { ThemedText, H2, Body, BodyBold } from './ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withDelay,
  ZoomIn,
  FadeIn
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

interface SessionEndModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

export const SessionEndModal: React.FC<SessionEndModalProps> = ({ visible, onClose, onSubmit }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Animation for stars
  const scale = useSharedValue(1);

  const handleRate = (star: number) => {
    setRating(star);
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const handleSubmit = () => {
    if (rating === 0) {
        Alert.alert("Please select a rating");
        return;
    }
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
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            {!submitted ? (
                <Animated.View entering={ZoomIn}>
                    <H2 style={{ color: theme.primary }}>Rate Your Session</H2>
                    <Body style={{ color: theme.text.secondary }}>How was your consultation with Astrologer Vikram?</Body>

                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity 
                            key={star} 
                            onPress={() => handleRate(star)}
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name={star <= rating ? "star" : "star-outline"} 
                                size={40} 
                                color={star <= rating ? theme.secondary : theme.text.secondary} 
                                style={{ marginHorizontal: 4 }}
                            />
                        </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={onClose} style={[styles.cancelButton, { borderColor: theme.text.secondary }]}>
                            <BodyBold style={{ color: theme.text.secondary }}>Cancel</BodyBold>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleSubmit} 
                            style={[
                                styles.submitButton, 
                                { backgroundColor: theme.primary, opacity: rating > 0 ? 1 : 0.5 }
                            ]}
                            disabled={rating === 0}
                        >
                            <BodyBold style={{ color: theme.text.inverse }}>Submit</BodyBold>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            ) : (
                <Animated.View entering={FadeIn} style={styles.thankYouContainer}>
                    <Ionicons name="checkmark-circle" size={60} color={theme.feedback.success} />
                    <H2 style={{ color: theme.primary }}>Thank You!</H2>
                    <Body style={{ color: theme.text.secondary }}>Your feedback helps us improve.</Body>
                </Animated.View>
            )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Simulating blur with dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontWeight: '600',
  },
  thankYouContainer: {
    alignItems: 'center',
    padding: 20,
  },
  thankYouTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  thankYouText: {
    fontSize: 16,
    textAlign: 'center',
  }
});

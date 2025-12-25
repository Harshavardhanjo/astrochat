import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText, BodyBold, Caption } from './ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { useThemeContext } from '../context/ThemeContext';

interface AIFeedbackProps {
  messageId: string;
  initialFeedback?: 'liked' | 'disliked' | null;
  onFeedbackChange?: (id: string, feedback: 'liked' | 'disliked' | null, reason?: string) => void;
  onDismiss?: () => void;
}

const FEEDBACK_REASONS = ['Inaccurate', 'Too Vague', 'Too Long'];

export const AIFeedback: React.FC<AIFeedbackProps> = ({ messageId, initialFeedback = null, onFeedbackChange, onDismiss }) => {
  const { theme: currentTheme } = useThemeContext();
  const theme = Colors[currentTheme];
  
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(initialFeedback);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  // Animation values
  const chipsOpacity = useSharedValue(initialFeedback === 'disliked' ? 1 : 0);
  const chipsHeight = useSharedValue(initialFeedback === 'disliked' ? 1 : 0);

  const handlePress = (type: 'liked' | 'disliked') => {
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);
    
    if (newFeedback === 'disliked') {
      chipsOpacity.value = withTiming(1, { duration: 300 });
      chipsHeight.value = withSpring(1);
    } else {
      chipsOpacity.value = withTiming(0, { duration: 200 });
      chipsHeight.value = withTiming(0);
      setSelectedReason(null);
    }

    onFeedbackChange?.(messageId, newFeedback);
    
    // Dismiss overlay after feedback is given
    if (newFeedback === 'liked') {
      // For "liked", dismiss immediately
      setTimeout(() => onDismiss?.(), 300);
    }
    // For "disliked", don't dismiss yet - wait for reason selection
  };

  const handleReasonPress = (reason: string) => {
    const newReason = selectedReason === reason ? null : reason;
    setSelectedReason(newReason);
    onFeedbackChange?.(messageId, 'disliked', newReason || undefined);
    
    // Dismiss overlay after reason is selected
    if (newReason) {
      setTimeout(() => onDismiss?.(), 300);
    }
  };

  const animatedChipsStyle = useAnimatedStyle(() => {
    return {
      opacity: chipsOpacity.value,
      transform: [{ scaleY: chipsHeight.value }],
      height: chipsHeight.value === 0 ? 0 : undefined,
    };
  });

  return (
    <View style={styles.container}>
      {/* Like Button */}
      <TouchableOpacity 
        onPress={() => handlePress('liked')} 
        style={styles.feedbackRow}
        activeOpacity={0.6}
      >
        <View style={styles.feedbackContent}>
          <Ionicons 
            name={feedback === 'liked' ? "thumbs-up" : "thumbs-up-outline"} 
            size={20} 
            color={feedback === 'liked' ? theme.primary : theme.text.primary} 
          />
          <ThemedText variant="body" style={[
            styles.feedbackText, 
            { 
              color: feedback === 'liked' ? theme.primary : theme.text.primary,
              fontFamily: feedback === 'liked' ? theme.fonts.bold : theme.fonts.regular
            }
          ]}>
            Helpful
          </ThemedText>
        </View>
        {feedback === 'liked' && (
          <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
        )}
      </TouchableOpacity>

      {/* Dislike Button */}
      <TouchableOpacity 
        onPress={() => handlePress('disliked')}
        style={styles.feedbackRow}
        activeOpacity={0.6}
      >
        <View style={styles.feedbackContent}>
          <Ionicons 
            name={feedback === 'disliked' ? "thumbs-down" : "thumbs-down-outline"} 
            size={20} 
            color={feedback === 'disliked' ? theme.feedback.error : theme.text.primary} 
          />
          <ThemedText variant="body" style={[
            styles.feedbackText, 
            { 
              color: feedback === 'disliked' ? theme.feedback.error : theme.text.primary,
              fontFamily: feedback === 'disliked' ? theme.fonts.bold : theme.fonts.regular
            }
          ]}>
            Not Helpful
          </ThemedText>
        </View>
        {feedback === 'disliked' && (
          <Ionicons name="checkmark-circle" size={18} color={theme.feedback.error} />
        )}
      </TouchableOpacity>

      {/* Reason Chips */}
      <Animated.View style={[styles.chipsContainer, animatedChipsStyle]}>
        <View style={styles.chipsRow}>
          {FEEDBACK_REASONS.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={[
                styles.chip,
                { 
                  backgroundColor: theme.background,
                  borderColor: theme.message.aiBorder 
                },
                selectedReason === reason && { 
                    backgroundColor: theme.feedback.error + '10',
                    borderColor: theme.feedback.error
                }
              ]}
              onPress={() => handleReasonPress(reason)}
              activeOpacity={0.7}
            >
              {/* <Text style={[
                styles.chipText,
                { color: theme.text.secondary, fontFamily: theme.fonts.regular },
                selectedReason === reason && { color: theme.feedback.error, fontFamily: theme.fonts.bold }
              ]}>{reason}</Text> */}
              <ThemedText variant="body" style={[
                styles.chipText,
                { color: theme.text.secondary, fontFamily: theme.fonts.regular },
                selectedReason === reason && { color: theme.feedback.error, fontFamily: theme.fonts.bold }
              ]}>{reason}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackText: {
    fontSize: 16,
  },
  chipsContainer: {
    overflow: 'hidden',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
});

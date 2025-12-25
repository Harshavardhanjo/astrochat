import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, useColorScheme } from 'react-native';
import { ThemedText, Body, Caption } from './ThemedText';
import Animated, { FadeIn, ZoomIn, useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, Easing } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Message } from '../types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { AIFeedback } from './AIFeedback';
import { useThemeContext } from '../context/ThemeContext';

interface ReactionOverlayProps {
  visible: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
  targetLayout: { x: number; y: number; width: number; height: number } | null;
  message: Message | null;
  onFeedbackChange?: (id: string, feedback: 'liked' | 'disliked' | null) => void;
  onAction?: (action: 'reply' | 'forward' | 'copy' | 'delete', message: Message) => void;
}

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];
const ACTIONS = [
  { id: 'reply', label: 'Reply', icon: 'arrow-undo-outline' },
  { id: 'forward', label: 'Forward', icon: 'arrow-redo-outline' },
  { id: 'copy', label: 'Copy', icon: 'copy-outline' },
  { id: 'delete', label: 'Delete', icon: 'trash-outline', color: '#ff4444' },
];

export const ReactionOverlay: React.FC<ReactionOverlayProps> = ({ visible, onSelect, onClose, targetLayout, message, onFeedbackChange, onAction }) => {
  const { theme: currentTheme, isDark } = useThemeContext();
  const theme = Colors[currentTheme];
  
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  // Animation Values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible && targetLayout) {
        // Calculate distance to center
        const targetY = (SCREEN_HEIGHT - targetLayout.height) / 2;
        const distance = targetY - targetLayout.y;
        
        translateY.value = withTiming(distance, { 
            duration: 250,
            easing: Easing.out(Easing.cubic)
        });
        opacity.value = withTiming(1, { duration: 200 });
    } else {
        translateY.value = 0;
        opacity.value = 0;
    }
  }, [visible, targetLayout, SCREEN_HEIGHT]);

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  if (!visible || !targetLayout || !message) return null;

  // Derived positions based on the FINAL centered position
  // We want the reaction bar and menu to appear at the final specific layout
  // So we calculate their "Final" Top/Left and just animate their opacity/entrance
  
  const centeredY = (SCREEN_HEIGHT - targetLayout.height) / 2; // The Y where message will land
  
  // 1. Reaction Bar Position (Relative to Centered Message)
  const BAR_WIDTH = 300;
  let barLeft = targetLayout.x + (targetLayout.width / 2) - (BAR_WIDTH / 2);
  if (barLeft < 16) barLeft = 16;
  if (barLeft + BAR_WIDTH > SCREEN_WIDTH - 16) barLeft = SCREEN_WIDTH - BAR_WIDTH - 16;
  const barTop = centeredY - 60; // 60px above the centered message

  // 2. Menu Position (Relative to Centered Message)
  const MENU_WIDTH = 200;
  let menuTop = centeredY + targetLayout.height + 10;
  let menuLeft = targetLayout.x;
  if (targetLayout.x > SCREEN_WIDTH / 2) {
      menuLeft = targetLayout.x + targetLayout.width - MENU_WIDTH;
  }

  const isMe = message.sender === 'user';
  const isAI = message.sender === 'ai_astrologer';

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
        <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                
                {/* Centered container for all content */}
                <View style={styles.centeredContainer}>
                    
                    {/* Reaction Bar */}
                    <Animated.View 
                        entering={ZoomIn.delay(100)} 
                        style={[styles.reactionContainer, { backgroundColor: theme.surface }]}
                    >
                        <View style={styles.bar}>
                            {REACTIONS.map((emoji) => (
                                <TouchableOpacity 
                                    key={emoji} 
                                    onPress={() => onSelect(emoji)}
                                    style={styles.emojiButton}
                                    activeOpacity={0.6}
                                >
                                    <ThemedText style={styles.emoji}>{emoji}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Message Bubble */}
                    <Animated.View 
                        entering={FadeIn.delay(150)}
                        style={[
                            styles.messageBubble,
                            {
                                backgroundColor: isMe ? theme.message.userBackground : 
                                                isAI ? theme.message.aiBackground : theme.surface,
                                borderRadius: 16,
                                borderBottomRightRadius: isMe ? 2 : 16,
                                borderBottomLeftRadius: isMe ? 16 : 2,
                                borderWidth: !isMe ? 1 : 0,
                                borderColor: isAI ? theme.message.aiBorder : '#F0F0F0',
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                            }
                        ]}
                    >
                        <Body style={{ color: isMe ? theme.message.userText : theme.message.aiText }}>
                            {message.text}
                        </Body>
                    </Animated.View>

                    {/* Context Menu */}
                    <Animated.View 
                        entering={FadeIn.delay(200)} 
                        style={[
                            styles.menuContainer, 
                            { 
                                backgroundColor: theme.surface,
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                marginTop: 12,
                            }
                        ]}
                    >
                        {/* Feedback Section */}
                        <AIFeedback 
                            messageId={message.id}
                            initialFeedback={message.feedbackType}
                            onFeedbackChange={onFeedbackChange}
                            onDismiss={onClose}
                        />

                        {/* Divider */}
                        <View style={[styles.menuDivider, { backgroundColor: theme.message.aiBorder }]} />

                        {/* Action Items */}
                        {ACTIONS.map((action, index) => (
                            <TouchableOpacity 
                                key={action.id} 
                                onPress={() => {
                                    if (message && onAction) {
                                        onAction(action.id as any, message);
                                        onClose();
                                    }
                                }}
                                style={[
                                    styles.menuItem, 
                                    index !== ACTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.message.aiBorder }
                                ]}
                            >
                                <Caption style={[styles.menuText, { color: action.color || theme.text.primary }]}>{action.label}</Caption>
                                <Ionicons name={action.icon as any} size={20} color={action.color || theme.text.primary} />
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </View>

            </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    // Legacy style removed
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  reactionContainer: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  messageBubble: {
    padding: 12,
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 60,
  },
  emojiButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 50,
    flexShrink: 0,
  },
  emoji: {
    //alt to fonts
    fontSize: 20,
  },
  clonedBubble: {
      padding: 12,
      // justifyContent: 'center', removed
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 10,
  },
  clonedText: {
      fontSize: 15,
      lineHeight: 22,
  },
  groupContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  menuContainer: {
    // Position absolute removed
      borderRadius: 16,
      paddingVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 10,
      zIndex: 15,
  },
  menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
  },
  menuBorder: {
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
  },
  menuText: {
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    width: '100%',
  }
});

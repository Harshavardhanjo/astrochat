import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme, Image, TouchableOpacity } from 'react-native';
import { ThemedText, Caption, Small } from './ThemedText';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  withTiming,
  withSequence,
  useAnimatedReaction,
  Easing
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { Message } from '../types';
import { useThemeContext } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';


interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  onSwipeToReply?: (message: Message) => void;
  onLongPress?: (message: Message, layout: { x: number; y: number; width: number; height: number }) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
  repliedMessage?: Message;
  onReplyPress?: (repliedId: string) => void;
  isHighlighted?: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const REPLY_THRESHOLD = 50;

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isMe, 
  onSwipeToReply, 
  onLongPress,
  onReactionRemove,
  repliedMessage,
  onReplyPress,
  isHighlighted
}) => {
  const { theme: currentTheme } = useThemeContext();
  const theme = Colors[currentTheme];

  // Animation values for swipe - MUST be before any early returns
  const translateX = useSharedValue(0);
  const replyIconOpacity = useSharedValue(0);
  const scale = useSharedValue(1);

  // Ref for measurement - MUST be before any early returns
  const bubbleRef = React.useRef<View>(null);

  // Highlight Animation - MUST be before any early returns
  const highlightOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (isHighlighted) {
        highlightOpacity.value = withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0, { duration: 1500, easing: Easing.out(Easing.exp) })
        );
    }
  }, [isHighlighted, highlightOpacity]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [
        { translateX: translateX.value },
        { scale: scale.value }
    ]
  }));

  const rIconStyle = useAnimatedStyle(() => ({
    opacity: replyIconOpacity.value,
    transform: [
      { scale: replyIconOpacity.value },
      { translateX: -30 }
    ]
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    backgroundColor: theme.secondary,
    opacity: highlightOpacity.value * 0.3,
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    zIndex: 1
  }));

  // System messages are different - early return AFTER all hooks
  if (message.type === 'event') {
    return (
      <View style={styles.systemContainer}>
        <Caption style={[styles.systemText, { color: theme.message.systemText, backgroundColor: theme.message.systemBackground }]}>{message.text}</Caption>
      </View>
    );
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Don't interfere with vertical scroll
    .onUpdate((event) => {
      // Only allow swiping right
      if (event.translationX > 0) {
        translateX.value = event.translationX * 0.3; // Resistance
        
        if (event.translationX > REPLY_THRESHOLD) {
            replyIconOpacity.value = withTiming(1);
        } else {
            replyIconOpacity.value = withTiming(0);
        }
      }
    })
    .onEnd((event) => {
      if (event.translationX > REPLY_THRESHOLD && onSwipeToReply) {
        runOnJS(onSwipeToReply)(message);
      }
      translateX.value = withSpring(0);
      replyIconOpacity.value = withTiming(0);
    });

  const longPressGesture = Gesture.LongPress()
    .onBegin(() => {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withTiming(0.95, { duration: 100 });
    })
    .onStart(() => {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        scale.value = withSpring(1);
        if (onLongPress) {
            runOnJS(handleLongPress)();
        }
    })
    .onFinalize(() => {
        scale.value = withSpring(1);
    });

  function handleLongPress() {
    bubbleRef.current?.measureInWindow((x, y, width, height) => {
        onLongPress?.(message, { x, y, width, height });
    });
  }

  // Combine gestures
  const composedGestures = Gesture.Simultaneous(panGesture, longPressGesture);

  const isAI = message.sender === 'ai_astrologer';

  return (
    <View style={[
      styles.container,
      message.reactions && message.reactions.length > 0 && { marginBottom: 12 }
    ]}>
      {/* Reply Icon (Hidden behind/beside) */}
      <Animated.View style={[styles.replyIconContainer, rIconStyle]}>
        <Ionicons name="arrow-undo" size={20} color={theme.text.secondary} />
      </Animated.View>

      <GestureDetector gesture={composedGestures}>
        <Animated.View 
            style={[
                styles.bubbleContainer, 
                isMe ? styles.myBubbleContainer : styles.theirBubbleContainer,
                rStyle
            ]}
        >
            <View 
                ref={bubbleRef}
                style={[
                    styles.bubble, 
                    isMe ? { backgroundColor: theme.message.userBackground, borderBottomRightRadius: 2 } 
                         : { 
                             backgroundColor: theme.message.aiBackground, // or theme.surface
                             borderBottomLeftRadius: 2,
                             borderWidth: 1,
                             borderColor: theme.message.aiBorder 
                           },
                    isAI && { borderColor: theme.secondary, borderWidth: 1.5 },
                    { 
                        shadowColor: theme.shadow.color,
                        shadowOpacity: theme.shadow.opacity,
                    }
                ]}
            >
                {/* Highlight Overlay */}
                <Animated.View style={highlightStyle} pointerEvents="none" />

                {/* Sender Name for AI/Human */}



                {/* Reply Context Block */}
                {repliedMessage && (
                    <TouchableOpacity 
                        onPress={() => onReplyPress?.(repliedMessage.id)}
                        activeOpacity={0.7}
                        style={[
                            styles.replyContainer, 
                            { 
                                backgroundColor: isMe ? theme.message.reply.userBackground : theme.message.reply.background, 
                                borderLeftColor: theme.message.reply.border 
                            }
                        ]}
                    >
                        <Caption style={{ color: isMe ? theme.message.reply.userText : theme.message.reply.border, fontFamily: theme.fonts.bold }}>
                             {repliedMessage.sender === 'user' ? 'You' : 'Astrologer'}
                        </Caption>
                        <Caption numberOfLines={1} style={{ color: isMe ? theme.message.reply.userText : theme.message.reply.text }}>
                            {repliedMessage.text}
                        </Caption>
                    </TouchableOpacity>
                )}

                {message.type === 'image' ? (
                    <Image 
                        source={{ uri: message.text }} 
                        style={[styles.messageImage, { width: 200, height: 200, borderRadius: 12 }]} 
                        resizeMode="cover"
                    />
                ) : (
                    <ThemedText variant="body" style={[
                        styles.messageText, 
                        isMe ? { color: theme.message.userText } : { color: theme.message.aiText }
                    ]}>
                        {message.text}
                    </ThemedText>
                )}

                <View style={styles.footer}>
                    <Small style={[
                        styles.timestamp, 
                        isMe ? { color: 'rgba(255, 255, 255, 0.7)' } : { color: theme.text.secondary }
                    ]}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Small>
                </View>

                {/* Reactions - WhatsApp Style */}
                {message.reactions && message.reactions.length > 0 && (
                    <TouchableOpacity 
                        style={[
                            styles.reactionBubble, 
                            { 
                                backgroundColor: theme.surface,
                                borderColor: theme.message.aiBorder,
                                right: -8,
                            }
                        ]}
                        onPress={() => {
                            // Remove the first reaction when clicked
                            if (message.reactions && message.reactions.length > 0) {
                                onReactionRemove?.(message.id, message.reactions[0]);
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        {message.reactions.map((r, i) => <ThemedText key={i} style={styles.reactionText}>{r}</ThemedText>)}
                    </TouchableOpacity>
                )}

            </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
    justifyContent: 'center',
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  systemText: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bubbleContainer: {
    maxWidth: '80%',
  },
  myBubbleContainer: {
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  theirBubbleContainer: {
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  myBubble: {
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  aiBubble: {
    borderWidth: 1.5,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
  },
  theirMessageText: {
  },
  messageImage: {
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirTimestamp: {
  },
  replyIconContainer: {
    position: 'absolute',
    left: 10,
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  reactionBubble: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reactionText: {
      fontSize: 14,
  },
  replyContainer: {
      padding: 8,
      borderRadius: 8,
      marginBottom: 8,
      borderLeftWidth: 4,
      justifyContent: 'center',
  },
  replySender: {
      fontSize: 11,
      marginBottom: 2,
  },
  replyTextSummary: {
      fontSize: 12,
  }
});

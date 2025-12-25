import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  useColorScheme,
  Image,
  ActivityIndicator,
  Keyboard,
  InteractionManager
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import { Message, MessageType, SenderType } from '../../types';
import { MessageBubble } from '../../components/MessageBubble';
import { SessionEndModal } from '../../components/SessionEndModal';
import { ReactionOverlay } from '../../components/ReactionOverlay';
import { AstrologerBioModal } from '../../components/AstrologerBioModal';
import { TypingIndicator } from '../../components/TypingIndicator';
import { CHATS, CHAT_MESSAGES } from '../../data/chatData';
import Animated, { FadeInDown, FadeOutDown, Layout } from 'react-native-reanimated';

// Remove INITIAL_MESSAGES const

import { useThemeContext } from '../../context/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { theme: currentTheme } = useThemeContext();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = currentTheme;
  const theme = Colors[colorScheme];

  const currentChat = CHATS.find(c => c.id === id);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (id && typeof id === 'string') {
        setMessages(CHAT_MESSAGES[id] || []);
    }
  }, [id]);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // Modal States
  const [isSessionEndVisible, setSessionEndVisible] = useState(false);
  const [isBioVisible, setBioVisible] = useState(false);
  const [reactionOverlayVisible, setReactionOverlayVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessageLayout, setSelectedMessageLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus after navigation transition completes
    // Using setTimeout with longer delay for reliability across platforms
    const timer = setTimeout(() => {
        inputRef.current?.focus();
    }, 600); // Slightly longer delay to ensure screen is fully mounted

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // Add small delay to ensure keyboard animation completes
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // --- Actions ---

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: Date.now(),
      type: 'text',
      replyTo: replyingTo?.id
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setReplyingTo(null);
    
    // Scroll to bottom
    setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI Reply
    setIsTyping(true);
    setTimeout(() => {
        setIsTyping(false);
        const responses = [
            "The planetary positions suggest a significant change coming up.",
            "Interesting. Your Moon sign is playing a major role here.",
            "I need to analyze your D9 chart for more clarity on this.",
            "That is a very distinct possibility given the transit of Jupiter.",
            "Focus on your breathing and meditation during this phase."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const aiMessage: Message = {
            id: Date.now().toString(),
            sender: 'ai_astrologer',
            text: randomResponse,
            timestamp: Date.now(),
            type: 'ai',
            hasFeedback: true,
            feedbackType: undefined
        };
        setMessages(prev => [...prev, aiMessage]);
    }, 2000);
  };

  const handleSwipeToReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleLongPress = (message: Message, layout: { x: number; y: number; width: number; height: number }) => {
    if (message.type === 'event') return;
    setSelectedMessage(message);
    setSelectedMessageLayout(layout);
    setReactionOverlayVisible(true);
  };

  const handleReactionSelect = (emoji: string) => {
    if (!selectedMessage) return;

    setMessages(prev => prev.map(msg => {
        if (msg.id === selectedMessage.id) {
            const currentReactions = msg.reactions || [];
            if (!currentReactions.includes(emoji)) {
                return { ...msg, reactions: [...currentReactions, emoji] };
            }
        }
        return msg;
    }));
    
    setReactionOverlayVisible(false);
    setSelectedMessage(null);
    setSelectedMessageLayout(null);
  };

  const scrollToMessage = (messageId: string) => {
      const index = messages.findIndex(m => m.id === messageId);
      if (index !== -1) {
          flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
          setHighlightedMessageId(messageId);
          setTimeout(() => setHighlightedMessageId(null), 2000); // Clear highlight after 2s
      }
  };

  const handleFeedbackChange = (id: string, feedback: 'liked' | 'disliked' | null) => {
    setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, feedbackType: feedback || undefined } : msg
    ));
  };

  const handleReactionRemove = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.reactions) {
        return { ...msg, reactions: msg.reactions.filter(r => r !== emoji) };
      }
      return msg;
    }));
  };

  const handleMessageAction = async (action: 'reply' | 'forward' | 'copy' | 'delete', message: Message) => {
      switch (action) {
          case 'reply':
              setReplyingTo(message);
              break;
          case 'copy':
              await Clipboard.setStringAsync(message.text);
              Alert.alert('Copied', 'Message copied to clipboard');
              break;
          case 'delete':
              setMessages(prev => prev.filter(m => m.id !== message.id));
              break;
          case 'forward':
              Alert.alert('Forward', 'Forwarding feature coming soon!');
              break;
      }
      setReactionOverlayVisible(false);
      setSelectedMessage(null);
  };

  const handleEndChat = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSessionEndVisible(true);
  };

  const renderReplyPreview = () => {
    if (!replyingTo) return null;

    return (
      <Animated.View 
        entering={FadeInDown} 
        exiting={FadeOutDown.springify()} 
        style={[styles.replyPreview, { backgroundColor: theme.surface, borderTopColor: theme.message.aiBorder }]}
      >
        <View style={[styles.replyLine, { backgroundColor: theme.primary }]} />
        <TouchableOpacity 
          style={styles.replyContent} 
          onPress={() => scrollToMessage(replyingTo.id)}
          activeOpacity={0.7}
      >
          <Text style={[styles.replyTitle, { color: theme.primary }]}>
              Replying to {replyingTo.sender === 'user' ? 'Yourself' : 'Astrologer'}
          </Text>
          <Text numberOfLines={1} style={[styles.replyText, { color: theme.text.secondary }]}>
              {replyingTo.text}
          </Text>
      </TouchableOpacity>
        <TouchableOpacity onPress={() => setReplyingTo(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={20} color={theme.text.secondary} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar 
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
            backgroundColor={theme.background} 
        />
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.message.aiBorder }]}>
            <View style={styles.headerTitleContainer}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
                    <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.headerTitleContainer} 
                    onPress={() => setBioVisible(true)}
                    activeOpacity={0.7}
                >
                <View style={styles.headerTitleContainer}>
                    {currentChat?.avatar ? (
                        <Image 
                            source={currentChat.avatar} 
                            style={{ width: 40, height: 40, borderRadius: 20 }} 
                        />
                    ) : (
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.message.aiBackground, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="person" size={24} color={theme.text.secondary} />
                        </View>
                    )}
                    <View>
                        <Text style={[styles.headerTitle, { color: theme.text.primary, fontFamily: theme.fonts.headingBold }]}>{currentChat?.name || 'Astrologer'}</Text>
                        <Text style={{ fontSize: 12, color: theme.text.secondary, fontFamily: theme.fonts.regular }}>
                            {currentChat?.isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            </View>
            <TouchableOpacity 
                onPress={handleEndChat} 
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: 20,
                    gap: 6
                }}
            >
                <Ionicons name="power" size={16} color="#EF4444" />
                <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '600' }}>End</Text>
            </TouchableOpacity>
        </View>

        {/* Chat List */}
        <Animated.FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble 
                message={item} 
                isMe={item.sender === 'user'} 
                onSwipeToReply={handleSwipeToReply}
                onLongPress={handleLongPress}
                onReactionRemove={handleReactionRemove}
                repliedMessage={item.replyTo ? messages.find(m => m.id === item.replyTo) : undefined}
                onReplyPress={scrollToMessage}
                isHighlighted={item.id === highlightedMessageId}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={Layout.springify()} // For smooth reordering/adding
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onScrollToIndexFailed={(info) => {
              flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
          }}
          ListFooterComponent={isTyping ? <TypingIndicator /> : <View style={{ height: 20 }} />}
        />

        {/* Input Area */}
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            {renderReplyPreview()}
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.message.aiBorder }]}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="add" size={24} color={theme.primary} />
                </TouchableOpacity>
                
                <TextInput
                    ref={inputRef}
                    style={[styles.input, { 
                        backgroundColor: theme.background, 
                        color: theme.text.primary 
                    }]}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.text.secondary}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                
                <TouchableOpacity 
                    style={[styles.sendButton, { backgroundColor: inputText.trim() ? theme.primary : theme.message.aiBorder }]} 
                    onPress={handleSendMessage}
                    disabled={!inputText.trim()}
                >
                    <Ionicons name="send" size={20} color={theme.text.inverse} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

        {/* Modals */}
        <SessionEndModal 
            visible={isSessionEndVisible} 
            onClose={() => setSessionEndVisible(false)}
            onSubmit={(rating) => {
                console.log("Rated:", rating);
                setSessionEndVisible(false);
            }}
        />

        <AstrologerBioModal 
            visible={isBioVisible}
            onClose={() => setBioVisible(false)}
            astrologer={currentChat || null}
        />

        <ReactionOverlay 
            visible={reactionOverlayVisible}
            onClose={() => {
                setReactionOverlayVisible(false);
                setSelectedMessage(null);
                setSelectedMessageLayout(null);
            }}
            onSelect={handleReactionSelect}
            targetLayout={selectedMessageLayout}
            message={selectedMessage}
            onFeedbackChange={handleFeedbackChange}
            onAction={handleMessageAction}
        />

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  endButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffeaa7',
    borderRadius: 8,
  },
  endButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d35400',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  attachButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  replyLine: {
    width: 4,
    height: '100%',
    marginRight: 10,
    borderRadius: 2,
  },
  replyContent: {
    flex: 1,
  },
  replyTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
  }
});

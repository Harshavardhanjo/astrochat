import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image, FlatList } from 'react-native';
import { ThemedText, H2, BodyBold, Body, Caption, Label } from './ThemedText';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { useThemeContext } from '../context/ThemeContext';
import { CHATS, Chat } from '../data/chatData';

interface NewChatModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (chat: Chat) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ visible, onClose, onSelect }) => {
  const { theme: currentTheme, isDark } = useThemeContext();
  const theme = Colors[currentTheme];

  const astrologers = CHATS.filter(c => c.category === 'astrologer');

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={[styles.itemContainer, { borderBottomColor: theme.message.aiBorder }]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={item.avatar} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: theme.message.aiBackground }]}>
            <Ionicons name="person" size={24} color={theme.text.secondary} />
          </View>
        )}
        {item.isOnline && <View style={[styles.onlineBadge, { borderColor: theme.surface }]} />}
      </View>
      
      <View style={styles.infoContainer}>
        <BodyBold style={{ color: theme.text.primary }}>
          {item.name}
        </BodyBold>
        <Caption numberOfLines={1} style={{ color: theme.text.secondary }}>
          {item.specialties?.join(' • ') || 'Vedic Astrology'}
        </Caption>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: theme.message.aiBackground, borderColor: theme.primary }]}>
                <Label style={{ color: theme.primary }}>{tag}</Label>
              </View>
            ))}
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.message.aiBorder }]}>
            <H2 style={{ color: theme.text.primary }}>
              New Chat
            </H2>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={24} color={theme.text.tertiary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={astrologers}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  modalContent: {
    height: '80%',
    marginTop: 'auto',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  specialties: {
    fontSize: 12,
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10,
  },
});

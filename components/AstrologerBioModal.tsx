import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { ThemedText, H2, Body, BodyBold, Caption, Label } from './ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { useThemeContext } from '../context/ThemeContext';

import { Chat } from '../data/chatData';

interface AstrologerBioModalProps {
  visible: boolean;
  onClose: () => void;
  astrologer: Chat | null;
}

export const AstrologerBioModal: React.FC<AstrologerBioModalProps> = ({ visible, onClose, astrologer }) => {
  const { theme: currentTheme } = useThemeContext();
  const theme = Colors[currentTheme];

  if (!visible || !astrologer) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.backdrop} onTouchEnd={onClose} />
        
        <Animated.View entering={ZoomIn.duration(300)} style={[styles.card, { backgroundColor: theme.surface }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text.secondary} />
          </TouchableOpacity>

          <View style={styles.profileSection}>
            {astrologer.avatar ? (
                <Image source={astrologer.avatar} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, { backgroundColor: theme.message.aiBackground, alignItems: 'center', justifyContent: 'center' }]}>
                    <Ionicons name="person" size={40} color={theme.text.secondary} />
                </View>
            )}
            <H2 style={{ color: theme.text.primary }}>{astrologer.name}</H2>
            {astrologer.rating && (
                <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
                    <Ionicons name="star" size={12} color={theme.secondary} />
                    <Caption style={{ color: theme.primary }}>
                        {astrologer.rating} ({astrologer.reviewCount} Reviews)
                    </Caption>
                </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
                <Ionicons name="ribbon-outline" size={20} color={theme.text.secondary} />
                <Body style={{ color: theme.text.primary }}>{astrologer.experience || 'Experienced'}</Body>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={20} color={theme.text.secondary} />
                <Body style={{ color: theme.text.primary }}>{astrologer.specialties?.join(', ') || 'General Astrology'}</Body>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="language-outline" size={20} color={theme.text.secondary} />
                <Body style={{ color: theme.text.primary }}>{astrologer.languages?.join(', ') || 'English'}</Body>
            </View>
          </View>

          <Body style={{ color: theme.text.secondary }}>
            {astrologer.bio}
          </Body>

          {astrologer.tags && astrologer.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Label style={{ color: theme.text.tertiary, marginBottom: 8 }}>CATEGORIES</Label>
              <View style={styles.tagsContainer}>
                {astrologer.tags.map((tag, index) => (
                  <View key={index} style={[styles.tag, { backgroundColor: theme.message.aiBackground, borderColor: theme.primary }]}>
                    <Label style={{ color: theme.primary }}>{tag}</Label>
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity 
            onPress={onClose} 
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
          >
            <BodyBold style={{ color: theme.text.inverse }}>Back to Chat</BodyBold>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1, // Allow text to wrap
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 24,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  tagsSection: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  tagsLabel: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});

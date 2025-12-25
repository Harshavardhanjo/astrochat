import React from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, Image } from 'react-native';
import { ThemedText, H2, BodyBold, Body, Caption, Label, Small } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { useThemeContext } from '../../../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CHATS, Chat, markChatAsVisible } from '../../../data/chatData';
import { AstrologerBioModal } from '../../../components/AstrologerBioModal';
import { NewChatModal } from '../../../components/NewChatModal';

export default function AllChatsScreen() {
  const router = useRouter();
  const { theme: currentTheme } = useThemeContext();
  const theme = Colors[currentTheme];

  const [selectedAstrologer, setSelectedAstrologer] = React.useState<Chat | null>(null);
  const [bioVisible, setBioVisible] = React.useState(false);
  const [newChatVisible, setNewChatVisible] = React.useState(false);

  const handleOpenBio = (chat: Chat) => {
      setSelectedAstrologer(chat);
      setBioVisible(true);
  };

  const sections = [
      {
          title: 'Astrologers',
          data: CHATS.filter(c => c.category === 'astrologer' && c.visible !== false)
      },
      {
          title: 'Support',
          data: CHATS.filter(c => c.category === 'support' && c.visible !== false)
      }
  ];

  // Force re-render when coming back or modifying logic
  const [refresh, setRefresh] = React.useState(0);

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
      <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
          <Label style={{ color: theme.text.secondary }}>{title.toUpperCase()}</Label>
      </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.chatItem, { backgroundColor: theme.surface, borderBottomColor: theme.message.aiBorder }]}
      onPress={() => router.push(`/chat/${item.id}`)}
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={() => handleOpenBio(item)}
        disabled={item.category !== 'astrologer'} // Only open for astrologers
      >
          {item.avatar ? (
              <Image source={item.avatar} style={styles.avatar} />
          ) : (
             <View style={[styles.avatarFallback, { backgroundColor: theme.message.aiBackground }]}>
                <Ionicons name="person" size={24} color={theme.text.secondary} />
             </View>
          )}
          {item.isOnline && <View style={[styles.onlineBadge, { borderColor: theme.surface }]} />}
      </TouchableOpacity>
      
      <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
              <BodyBold style={{ color: theme.text.primary }}>{item.name}</BodyBold>
              <Small style={{ color: theme.text.tertiary }}>{item.time}</Small>
          </View>
          <View style={styles.chatFooter}>
              <Caption numberOfLines={1} style={{ color: theme.text.secondary, fontFamily: item.unread > 0 ? theme.fonts.bold : theme.fonts.regular }}>
                  {item.lastMessage}
              </Caption>
              {item.unread > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
                      <Small style={styles.unreadText}>{item.unread}</Small>
                  </View>
              )}
          </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.message.aiBorder }]}>
          <H2 style={{ color: theme.text.primary }}>Chats</H2>
          <TouchableOpacity onPress={() => setNewChatVisible(true)}>
             <Ionicons name="create-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
      </View>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />
      
      <AstrologerBioModal 
        visible={bioVisible}
        onClose={() => setBioVisible(false)}
        astrologer={selectedAstrologer}
      />

      <NewChatModal
        visible={newChatVisible}
        onClose={() => setNewChatVisible(false)}
        onSelect={(chat) => {
            markChatAsVisible(chat.id);
            setRefresh(prev => prev + 1); // Trigger re-render to show new chat
            setNewChatVisible(false);
            router.push(`/chat/${chat.id}`);
        }}
      />
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 12,
  },
  sectionHeaderText: {
      fontSize: 12,
      letterSpacing: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
  },
  chatFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  lastMessage: {
      flex: 1,
      fontSize: 14,
      marginRight: 8,
  },
  unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
  },
  unreadText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
  }
});

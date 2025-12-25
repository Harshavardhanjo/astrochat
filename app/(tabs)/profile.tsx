import React from 'react';
import { View, StyleSheet, Switch, TouchableOpacity, ScrollView, Platform, TextInput, Modal } from 'react-native';
import { ThemedText, H2, BodyBold, Body, Caption, Label, Small } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useThemeContext } from '../../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { USER_PROFILE, updateUserProfile } from '../../data/userData';
import { EditAstroModal } from '../../components/EditAstroModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';

export default function SettingsScreen() {
  const { theme: currentTheme, toggleTheme, isDark } = useThemeContext();
  const theme = Colors[currentTheme];
  
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [profileVersion, setProfileVersion] = React.useState(0);
  
  // Individual pickers for birth details
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [editingPlace, setEditingPlace] = React.useState(false);
  const [tempPlace, setTempPlace] = React.useState(USER_PROFILE.birthPlace);
  
  // Parse dates
  const parseDate = (dateStr: string) => {
    try {
      const parts = dateStr.split(' ');
      if (parts.length !== 3) return new Date();
      const day = parseInt(parts[0]);
      const monthStr = parts[1];
      const year = parseInt(parts[2]);
      const months: { [key: string]: number } = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3,
        'May': 4, 'June': 5, 'July': 6, 'August': 7,
        'September': 8, 'October': 9, 'November': 10, 'December': 11
      };
      const month = months[monthStr];
      if (month === undefined) return new Date();
      return new Date(year, month, day);
    } catch (e) {
      return new Date();
    }
  };
  
  const parseTime = (timeStr: string) => {
    try {
      const [time, period] = timeStr.split(' ');
      const [hoursStr, minutesStr] = time.split(':');
      const hours = parseInt(hoursStr);
      const minutes = parseInt(minutesStr);
      const date = new Date();
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 = hours + 12;
      else if (period === 'AM' && hours === 12) hour24 = 0;
      date.setHours(hour24, minutes, 0, 0);
      return date;
    } catch (e) {
      return new Date();
    }
  };
  
  const [birthDate, setBirthDate] = React.useState(parseDate(USER_PROFILE.birthDate));
  const [birthTime, setBirthTime] = React.useState(parseTime(USER_PROFILE.birthTime));
  
  const formatDate = (date: Date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
      updateUserProfile({ birthDate: formatDate(selectedDate) });
      setProfileVersion(prev => prev + 1);
    }
  };
  
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setBirthTime(selectedTime);
      updateUserProfile({ birthTime: formatTime(selectedTime) });
      setProfileVersion(prev => prev + 1);
    }
  };
  
  const handlePlaceSave = () => {
    updateUserProfile({ birthPlace: tempPlace });
    setEditingPlace(false);
    setProfileVersion(prev => prev + 1);
  };

  const handleSaveProfile = (updates: any) => {
    updateUserProfile(updates);
    setProfileVersion(prev => prev + 1); // Force re-render
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.message.aiBorder }]}>
        <H2 style={{ color: theme.text.primary }}>Profile</H2>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Subscription Section */}
        <View style={[styles.subscriptionCard, { backgroundColor: theme.primary }]}>
            <View style={styles.subscriptionHeader}>
                <View>
                    <Caption style={{ color: '#fff' }}>Active Plan</Caption>
                    <H2 style={{ color: '#fff' }}>Premium Astrology</H2>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#10B981' }]}>
                    <BodyBold style={{ color: '#fff' }}>Active</BodyBold>
                </View>
            </View>
            <View style={styles.subscriptionDetails}>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Caption style={{ color: 'rgba(255,255,255,0.9)' }}>Renews on Jan 25, 2026</Caption>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="chatbubbles-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Caption style={{ color: 'rgba(255,255,255,0.9)' }}>Unlimited Chats</Caption>
                </View>
            </View>
            <TouchableOpacity style={styles.manageButton}>
                <BodyBold style={{ color: theme.primary }}>Manage Subscription</BodyBold>
                <Ionicons name="arrow-forward" size={16} color={theme.primary} />
            </TouchableOpacity>
        </View>
        
        {/* Birth Details Section */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Label style={{ color: theme.text.secondary, paddingTop: 16, paddingBottom: 4, paddingHorizontal: 16, letterSpacing: 1 }}>BIRTH DETAILS</Label>
          <Small style={{ color: theme.text.tertiary, paddingHorizontal: 16, paddingBottom: 8 }}>Tap to change</Small>
          
          <TouchableOpacity 
            style={[styles.row, { borderBottomColor: theme.message.aiBorder }]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.message.aiBorder : theme.surface }]}>
                    <Ionicons name="calendar" size={20} color={theme.primary} />
                </View>
                <Body style={{ color: theme.text.primary }}>Date of Birth</Body>
            </View>
            <Caption style={{ color: theme.text.secondary }}>{USER_PROFILE.birthDate}</Caption>
          </TouchableOpacity>
          
          {/* Date Picker Modal */}
          <Modal
            visible={showDatePicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
              <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPress={() => setShowDatePicker(false)}
              />
              <View style={[styles.pickerModal, { backgroundColor: theme.surface }]}>
                <View style={[styles.pickerHeader, { borderBottomColor: theme.message.aiBorder }]}>
                  <Body>Select Date</Body>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Body>Done</Body>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  themeVariant={isDark ? 'dark' : 'light'}
                  textColor={theme.text.primary}
                  style={styles.picker}
                />
              </View>
            </BlurView>
          </Modal>

          <TouchableOpacity 
            style={[styles.row, { borderBottomColor: theme.message.aiBorder }]}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.message.aiBorder : theme.surface }]}>
                    <Ionicons name="time" size={20} color={theme.primary} />
                </View>
                <Body>Time of Birth</Body>
            </View>
            <Caption>{USER_PROFILE.birthTime}</Caption>
          </TouchableOpacity>
          
          {/* Time Picker Modal */}
          <Modal
            visible={showTimePicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
              <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPress={() => setShowTimePicker(false)}
              />
              <View style={[styles.pickerModal, { backgroundColor: theme.surface }]}>
                <View style={[styles.pickerHeader, { borderBottomColor: theme.message.aiBorder }]}>
                  <Body>Select Time</Body>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Body>Done</Body>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={birthTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  themeVariant={isDark ? 'dark' : 'light'}
                  textColor={theme.text.primary}
                  style={styles.picker}
                />
              </View>
            </BlurView>
          </Modal>

          {editingPlace ? (
            <View style={[styles.row, { borderBottomWidth: 0, flexDirection: 'column', alignItems: 'stretch' }]}>
              <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.message.aiBorder }]}>
                <Ionicons name="location" size={20} color={theme.primary} />
                <TextInput
                  style={[styles.input, { color: theme.text.primary }]}
                  value={tempPlace}
                  onChangeText={setTempPlace}
                  placeholder="Enter city, country"
                  placeholderTextColor={theme.text.tertiary}
                  autoFocus
                />
              </View>
              <View style={styles.placeActions}>
                <TouchableOpacity 
                  style={[styles.placeButton, { backgroundColor: theme.message.aiBorder }]}
                  onPress={() => {
                    setTempPlace(USER_PROFILE.birthPlace);
                    setEditingPlace(false);
                  }}
                >
                  <Body>Cancel</Body>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.placeButton, { backgroundColor: theme.primary }]}
                  onPress={handlePlaceSave}
                >
                  <Body>Save</Body>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.row, { borderBottomWidth: 0 }]}
              onPress={() => setEditingPlace(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.message.aiBorder : theme.surface }]}>
                      <Ionicons name="location" size={20} color={theme.primary} />
                  </View>
                  <Body>Place of Birth</Body>
              </View>
              <Caption>{USER_PROFILE.birthPlace}</Caption>
            </TouchableOpacity>
          )}
        </View>

        {/* Astrological Profile Section */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <View style={styles.sectionHeaderRow}>
            <Label style={{ color: theme.text.secondary, paddingTop: 16, paddingBottom: 4, paddingHorizontal: 16, letterSpacing: 1 }}>ASTROLOGICAL PROFILE</Label>
            <TouchableOpacity 
              onPress={() => setEditModalVisible(true)}
              style={styles.editButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="create-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.row, { borderBottomColor: theme.message.aiBorder }]}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.message.aiBorder : theme.surface }]}>
                    <Ionicons name="sunny" size={20} color={theme.secondary} />
                </View>
                <Body>Sun Sign</Body>
            </View>
            <Caption>{USER_PROFILE.sunSign}</Caption>
          </View>

          <View style={[styles.row, { borderBottomColor: theme.message.aiBorder }]}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.message.aiBorder : theme.surface }]}>
                    <Ionicons name="moon" size={20} color={theme.secondary} />
                </View>
                <Body>Moon Sign</Body>
            </View>
            <Caption>{USER_PROFILE.moonSign}</Caption>
          </View>

          <View style={[styles.row, { borderBottomColor: theme.message.aiBorder }]}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.message.aiBorder : theme.surface }]}>
                    <Ionicons name="planet" size={20} color={theme.secondary} />
                </View>
                <Body>Ascendant</Body>
            </View>
            <Caption>{USER_PROFILE.ascendant}</Caption>
          </View>

          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.message.aiBorder : theme.surface }]}>
                    <Ionicons name="hourglass" size={20} color={theme.secondary} />
                </View>
                <Body>Current Dasha</Body>
            </View>
            <Caption>{USER_PROFILE.currentDasha}</Caption>
          </View>
        </View>
        
        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Label style={{ color: theme.text.secondary, paddingTop: 16, paddingBottom: 4, paddingHorizontal: 16, letterSpacing: 1 }}>APPEARANCE</Label>
          
          <View style={[styles.row, { borderBottomColor: theme.message.aiBorder }]}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.message.aiBorder : theme.surface }]}>
                    <Ionicons name="moon" size={20} color={isDark ? theme.secondary : theme.text.tertiary} />
                </View>
                <Body>Dark Mode</Body>
            </View>
            <Switch 
                value={isDark} 
                onValueChange={toggleTheme}
                trackColor={{ false: '#cbd5e1', true: theme.primary }}
                thumbColor={'#fff'}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: theme.surface, marginTop: 24 }]}>
          <Label style={{ color: theme.text.secondary, paddingTop: 16, paddingBottom: 4, paddingHorizontal: 16, letterSpacing: 1 }}>ABOUT</Label>
          
           <View style={[styles.row, { borderBottomWidth: 0 }]}>
             <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#e0f2fe' }]}>
                    <Ionicons name="information" size={20} color={theme.primary} />
                </View>
                <Body>Version</Body>
            </View>
            <Caption>1.0.0 (Demo)</Caption>
          </View>
        </View>

        <EditAstroModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          currentProfile={USER_PROFILE}
          onSave={handleSaveProfile}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
  },
  content: {
    padding: 20,
  },
  subscriptionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  subscriptionLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  subscriptionPlan: {
    color: '#fff',
    fontSize: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  subscriptionDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  manageButtonText: {
    fontSize: 15,
  },
  section: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    paddingTop: 16,
    paddingBottom: 4,
    paddingHorizontal: 16,
    letterSpacing: 1,
  },
  sectionHint: {
    fontSize: 11,
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 16,
  },
  versionText: {
    fontSize: 16,
  },
  valueText: {
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  editButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  placeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  placeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeButtonText: {
    fontSize: 14,
  },
  pickerContainer: {
    marginVertical: 8,
  },
  modalOverlay: {
    flex: 1,
  },
  pickerModal: {
    marginTop: 'auto',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  pickerTitle: {
    fontSize: 18,
  },
  doneButton: {
    fontSize: 16,
  },
  picker: {
    height: 200,
  },
});

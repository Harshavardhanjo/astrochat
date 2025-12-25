import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText, H2, BodyBold, Caption } from './ThemedText';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { useThemeContext } from '../context/ThemeContext';
import { ZODIAC_SIGNS, DASHAS, UserProfile } from '../data/userData';

interface EditAstroModalProps {
  visible: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
}

export const EditAstroModal: React.FC<EditAstroModalProps> = ({ 
  visible, 
  onClose, 
  currentProfile,
  onSave 
}) => {
  const { theme: currentTheme, isDark } = useThemeContext();
  const theme = Colors[currentTheme];

  const [sunSign, setSunSign] = useState(currentProfile.sunSign);
  const [moonSign, setMoonSign] = useState(currentProfile.moonSign);
  const [ascendant, setAscendant] = useState(currentProfile.ascendant);
  const [currentDasha, setCurrentDasha] = useState(currentProfile.currentDasha);

  const handleSave = () => {
    onSave({
      sunSign,
      moonSign,
      ascendant,
      currentDasha
    });
    onClose();
  };

  const renderPicker = (
    title: string, 
    value: string, 
    options: string[], 
    onSelect: (value: string) => void
  ) => (
    <View style={styles.pickerSection}>
      <BodyBold style={{ color: theme.text.primary }}>
        {title}
      </BodyBold>
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              { 
                backgroundColor: value === option ? theme.primary : theme.surface,
                borderColor: theme.message.aiBorder
              }
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
          >
            <Caption style={[
              styles.optionText,
              { 
                color: value === option ? '#fff' : theme.text.primary
              }
            ]}>
              {option}
            </Caption>
            {value === option && (
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.message.aiBorder }]}>
            <H2 style={{ color: theme.text.primary }}>
              Edit Astrological Profile
            </H2>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={28} color={theme.text.tertiary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderPicker("Sun Sign", sunSign, ZODIAC_SIGNS, setSunSign)}
            {renderPicker("Moon Sign", moonSign, ZODIAC_SIGNS, setMoonSign)}
            {renderPicker("Ascendant", ascendant, ZODIAC_SIGNS, setAscendant)}
            {renderPicker("Current Dasha", currentDasha, DASHAS, setCurrentDasha)}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.message.aiBorder }]}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <BodyBold style={{ color: '#fff' }}>
                Save Changes
              </BodyBold>
            </TouchableOpacity>
          </View>
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
    height: '85%',
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
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pickerSection: {
    marginBottom: 24,
  },
  pickerTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  optionsContainer: {
    maxHeight: 200,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  saveButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

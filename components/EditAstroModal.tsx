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
  editingField: keyof UserProfile | null;
}

export const EditAstroModal: React.FC<EditAstroModalProps> = ({ 
  visible, 
  onClose, 
  currentProfile,
  onSave,
  editingField
}) => {
  const { theme: currentTheme, isDark } = useThemeContext();
  const theme = Colors[currentTheme];

  const [tempValue, setTempValue] = useState('');

  // Reset temp value when modal opens for a new field
  React.useEffect(() => {
    if (editingField && visible) {
        setTempValue(currentProfile[editingField] || '');
    }
  }, [editingField, visible, currentProfile]);

  const handleSave = () => {
    if (editingField) {
        onSave({ [editingField]: tempValue });
    }
    onClose();
  };

  const getOptionsForField = (field: keyof UserProfile | null): string[] => {
      switch (field) {
          case 'sunSign':
          case 'moonSign':
          case 'ascendant':
              return ZODIAC_SIGNS;
          case 'currentDasha':
              return DASHAS;
          default:
              return [];
      }
  };

  const getTitleForField = (field: keyof UserProfile | null): string => {
      switch (field) {
          case 'sunSign': return 'Select Sun Sign';
          case 'moonSign': return 'Select Moon Sign';
          case 'ascendant': return 'Select Ascendant';
          case 'currentDasha': return 'Select Current Dasha';
          default: return 'Edit Profile';
      }
  };

  const options = getOptionsForField(editingField);
  const title = getTitleForField(editingField);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.message.aiBorder }]}>
            <H2 style={{ color: theme.text.primary }}>
              {title}
            </H2>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={28} color={theme.text.tertiary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.pickerSection}>
                {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[
                    styles.option,
                    { 
                        backgroundColor: tempValue === option ? theme.primary : theme.surface,
                        borderColor: theme.message.aiBorder
                    }
                    ]}
                    onPress={() => setTempValue(option)}
                    activeOpacity={0.7}
                >
                    <Caption style={[
                    styles.optionText,
                    { 
                        color: tempValue === option ? '#fff' : theme.text.primary
                    }
                    ]}>
                    {option}
                    </Caption>
                    {tempValue === option && (
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    )}
                </TouchableOpacity>
                ))}
            </View>
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

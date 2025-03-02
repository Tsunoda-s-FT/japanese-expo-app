import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { FadeInView, SlideInView } from './animations';
import { useTheme } from 'react-native-paper';
import { LanguageCode } from '../i18n';
import { getFlagIconForLanguage } from '../utils/languageUtils';

// 言語名マッピング
const languageNames: Record<string, string> = {
  ja: '日本語',
  en: 'English',
  zh: '中文',
  ko: '한국어',
  es: 'Español'
};

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const isSmallScreen = width < 375;
  const buttonSize = isSmallScreen ? 40 : 48;

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    setModalVisible(false);
  };

  const renderLanguageButton = (lang: LanguageCode) => {
    const iconName = getFlagIconForLanguage(lang) as any;
    const isActive = language === lang;

    return (
      <TouchableOpacity
        key={lang}
        style={[
          styles.languageButton,
          isActive && styles.activeButton,
          { height: buttonSize, minWidth: buttonSize }
        ]}
        onPress={() => changeLanguage(lang)}
        accessibilityLabel={`${languageNames[lang]}に変更`}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <MaterialCommunityIcons name={iconName} size={24} color={isActive ? colors.surface : colors.text} />
        {!compact && <Text style={[styles.buttonText, isActive && styles.activeText]}>{languageNames[lang]}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 言語選択トリガーボタン */}
      <TouchableOpacity
        style={[styles.selectorButton, shadows.small]}
        onPress={toggleModal}
        accessibilityLabel="言語選択"
        accessibilityHint="タップして言語を選択してください"
      >
        <MaterialCommunityIcons 
          name={getFlagIconForLanguage(language) as any} 
          size={24} 
          color={colors.primary} 
        />
        {!compact && (
          <Text style={styles.selectorText}>{t('common.language')}</Text>
        )}
      </TouchableOpacity>

      {/* 言語選択モーダル */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleModal}>
          <FadeInView style={styles.modalContainer}>
            <SlideInView direction="bottom" style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('common.selectLanguage')}</Text>
                <TouchableOpacity onPress={toggleModal} accessibilityLabel="閉じる">
                  <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.languageButtonsContainer}>
                {Object.keys(languageNames).map(key => renderLanguageButton(key as LanguageCode))}
              </View>
            </SlideInView>
          </FadeInView>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  selectorText: {
    marginLeft: spacing.sm,
    color: colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    minWidth: 100,
    gap: spacing.xs,
  },
  buttonText: {
    marginLeft: spacing.xs,
    color: colors.text,
  },
  activeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
});

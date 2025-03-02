import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { FadeInView, SlideInView } from './animations';
import { LanguageCode } from '../i18n';
import { getFlagIconForLanguage, getNativeLanguageName } from '../utils/languageUtils';

interface LanguageSelectorProps {
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ showLabel = false }) => {
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const changeLanguage = (lang: LanguageCode) => {
    if (lang !== language) {
      setLanguage(lang);
    }
    setModalVisible(false);
  };

  const renderLanguageButton = (lang: LanguageCode) => {
    const iconName = getFlagIconForLanguage(lang) as any;
    const isActive = language === lang;
    const nativeName = getNativeLanguageName(lang);

    return (
      <TouchableOpacity
        key={lang}
        style={[
          styles.languageButton,
          isActive && styles.activeButton
        ]}
        onPress={() => changeLanguage(lang)}
        accessibilityLabel={`${nativeName}に変更`}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <MaterialCommunityIcons name={iconName} size={24} color={isActive ? colors.surface : colors.text} />
        <Text style={[styles.buttonText, isActive && styles.activeText]}>{nativeName}</Text>
        {isActive && (
          <MaterialCommunityIcons name="check" size={20} color={colors.surface} style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 言語選択トリガーボタン */}
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={toggleModal}
        accessibilityLabel="言語選択"
        accessibilityHint="タップして言語を選択してください"
      >
        <MaterialCommunityIcons 
          name={getFlagIconForLanguage(language) as any} 
          size={24} 
          color={colors.primary} 
        />
        {showLabel && (
          <Text style={styles.selectorText}>{t('common.language')}</Text>
        )}
      </TouchableOpacity>

      {/* 言語選択ボトムシート */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleModal}>
          <SlideInView direction="bottom" style={styles.bottomSheetContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('common.selectLanguage')}</Text>
              <TouchableOpacity onPress={toggleModal} accessibilityLabel="閉じる">
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.languageButtonsContainer}>
              {['ja', 'en', 'zh', 'ko', 'es'].map(key => renderLanguageButton(key as LanguageCode))}
            </View>
          </SlideInView>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  selectorText: {
    marginLeft: spacing.sm,
    color: colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    gap: spacing.sm,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  buttonText: {
    marginLeft: spacing.md,
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
  activeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: spacing.sm,
  }
});

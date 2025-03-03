import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LanguageCode, LANGUAGES, getLanguageInfo } from '../../i18n';
import { useLanguage } from '../../context/LanguageContext';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { FadeInView, SlideInView } from '../animations';

// 言語アイコンマッピング - 国旗アイコンではなく言語コードと絵文字を使用
const languageIcons: Record<LanguageCode, string> = {
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  ko: '🇰🇷',
  es: '🇪🇸'
};

// サポートされている言語コード
const supportedLanguages: LanguageCode[] = LANGUAGES.map(lang => lang.code);

interface LanguageSelectorProps {
  compact?: boolean; // コンパクトモード（ヘッダー用）
  onClose?: () => void; // モーダル閉じる時のコールバック
  showLabel?: boolean; // 古いインターフェースとの互換性のため
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  compact = false,
  onClose,
  showLabel = false
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  // 言語変更ハンドラー
  const handleLanguageChange = (newLang: LanguageCode) => {
    if (newLang !== language) {
      setLanguage(newLang);
    }
    setModalVisible(false);
    if (onClose) onClose();
  };

  // 現在の言語情報
  const currentLanguageInfo = getLanguageInfo(language);
  const currentIcon = languageIcons[language];
  const currentName = currentLanguageInfo.nativeName;

  // コンパクトモードでのレンダリング（ヘッダー用）
  if (compact) {
    return (
      <View>
        <TouchableOpacity 
          style={styles.compactButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel={t('accessibility.changeLanguage', '言語を変更')}
          accessibilityRole="button"
        >
          <Text style={styles.compactButtonText}>{currentIcon}</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View 
              style={styles.languageMenu}
              onStartShouldSetResponder={() => true}
              onResponderRelease={(e) => e.stopPropagation()}
            >
              {supportedLanguages.map((langCode) => {
                const langInfo = getLanguageInfo(langCode);
                return (
                  <TouchableOpacity
                    key={langCode}
                    style={[
                      styles.languageMenuItem,
                      language === langCode && styles.activeLanguageItem
                    ]}
                    onPress={() => handleLanguageChange(langCode)}
                    accessibilityLabel={`${langInfo.name} (${langInfo.nativeName})`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: language === langCode }}
                  >
                    <Text style={styles.languageIcon}>{languageIcons[langCode]}</Text>
                    <Text style={styles.languageName}>{langInfo.nativeName}</Text>
                    {language === langCode && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }

  // 通常モードでのレンダリング（言語設定画面用）
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.selectLanguage', '言語を選択')}</Text>
      
      {supportedLanguages.map((langCode) => {
        const langInfo = getLanguageInfo(langCode);
        return (
          <TouchableOpacity
            key={langCode}
            style={[
              styles.languageButton,
              language === langCode && styles.activeLanguageButton
            ]}
            onPress={() => handleLanguageChange(langCode)}
            accessibilityLabel={`${langInfo.name} (${langInfo.nativeName})`}
            accessibilityRole="radio"
            accessibilityState={{ checked: language === langCode }}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageIconLarge}>{languageIcons[langCode]}</Text>
              <View style={styles.languageTextContainer}>
                <Text style={[
                  styles.languageNameLarge,
                  language === langCode && styles.activeText
                ]}>
                  {langInfo.nativeName}
                </Text>
                <Text style={styles.languageEnglishName}>
                  {langInfo.name}
                </Text>
              </View>
            </View>
            {language === langCode && <Text style={styles.checkmarkLarge}>✓</Text>}
          </TouchableOpacity>
        );
      })}

      <Text style={styles.note}>
        {t('settings.languageChangeNote', 'アプリ内のテキストは選択した言語で表示されます。コンテンツ自体は引き続き日本語学習用の教材です。')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: colors.text,
  },
  compactButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.round,
  },
  compactButtonText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageMenu: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    width: '80%',
    maxWidth: 300,
    ...shadows.medium,
  },
  languageMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  activeLanguageItem: {
    backgroundColor: colors.primary + '15', // 15% opacity
  },
  languageIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  checkmark: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  activeLanguageButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIconLarge: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  languageTextContainer: {
    flexDirection: 'column',
  },
  languageNameLarge: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  languageEnglishName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  checkmarkLarge: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  note: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  }
}); 
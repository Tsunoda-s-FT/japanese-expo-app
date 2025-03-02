import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, LanguageCode } from '../i18n';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { getFlagIconForLanguage, getNativeLanguageName, getEnglishLanguageName } from '../utils/languageUtils';
import HeaderWithLanguage from '../components/HeaderWithLanguage';
import { ImprovedHeader } from '../components/ImprovedHeader';

const LanguageSettingsScreen: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const changeLanguage = (lang: LanguageCode) => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ImprovedHeader title={t('settings.language', '言語設定')} showBack={true} />
      
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          {t('settings.languageDescription', '表示言語を選択します。学習コンテンツは選択した言語で表示されます。')}
        </Text>

        <View style={styles.languageList}>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            const flagIcon = getFlagIconForLanguage(lang.code) as any;

            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.languageItem, isSelected && styles.selectedLanguage]}
                onPress={() => changeLanguage(lang.code)}
                accessibilityLabel={`${lang.nativeName}を選択`}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
              >
                <View style={styles.languageIconContainer}>
                  <MaterialCommunityIcons
                    name={flagIcon}
                    size={28}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                </View>
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageName, isSelected && styles.selectedText]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.languageNameEn}>{lang.name}</Text>
                </View>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={colors.primary}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>{t('settings.languageNote', '言語設定について')}</Text>
            <Text style={styles.infoText}>
              {t('settings.automaticDetection', 'アプリは初回起動時にデバイスの言語設定を自動的に検出します。')}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  languageList: {
    marginBottom: spacing.lg,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  selectedLanguage: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  languageIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  languageNameEn: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default LanguageSettingsScreen; 
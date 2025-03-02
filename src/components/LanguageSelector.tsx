import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, LanguageCode } from '../i18n';
import { colors, spacing, borderRadius } from '../theme/theme';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('selectLanguage')}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode={language === 'ja' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('ja')}
          style={styles.button}
          labelStyle={language === 'ja' ? styles.activeLabel : styles.inactiveLabel}
          icon={({ size, color }) => <Icon name="flag" size={size} color={color} />}
        >
          日本語
        </Button>
        <Button
          mode={language === 'en' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('en')}
          style={styles.button}
          labelStyle={language === 'en' ? styles.activeLabel : styles.inactiveLabel}
          icon={({ size, color }) => <Icon name="flag-outline" size={size} color={color} />}
        >
          English
        </Button>
        <Button
          mode={language === 'zh' ? 'contained' : 'outlined'}
          onPress={() => setLanguage('zh')}
          style={styles.button}
          labelStyle={language === 'zh' ? styles.activeLabel : styles.inactiveLabel}
          icon={({ size, color }) => <Icon name="translate" size={size} color={color} />}
        >
          中文
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    marginBottom: spacing.sm,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    minWidth: 100,
    borderRadius: borderRadius.md,
    margin: spacing.xs,
  },
  activeLabel: {
    fontWeight: 'bold',
  },
  inactiveLabel: {
    fontWeight: 'normal',
  },
});

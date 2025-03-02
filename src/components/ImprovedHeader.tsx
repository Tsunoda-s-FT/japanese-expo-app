import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { useImprovedLanguage } from '../context/ImprovedLanguageContext';
import { colors, spacing, shadows } from '../theme/theme';
import { LocalizedText } from './LocalizedText';
import { ImprovedLanguageSelector } from './ImprovedLanguageSelector';

interface ImprovedHeaderProps {
  title: string;
  showBack?: boolean;
  showLanguageSelector?: boolean;
  rightAction?: React.ReactNode;
  onSettingsPress?: () => void;
  testID?: string;
}

export const ImprovedHeader: React.FC<ImprovedHeaderProps> = ({
  title,
  showBack = false,
  showLanguageSelector = true,
  rightAction,
  onSettingsPress,
  testID,
}) => {
  const navigation = useNavigation();
  const { t } = useImprovedLanguage();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSettings = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      // デフォルトでは言語設定画面に遷移
      navigation.navigate('LanguageSettings' as never);
    }
  };

  return (
    <Appbar.Header style={styles.header} testID={testID}>
      {showBack && (
        <Appbar.BackAction
          onPress={handleBack}
          accessibilityLabel={t('accessibility.back', '戻る')}
        />
      )}

      <Appbar.Content
        title={<LocalizedText size="lg" style={styles.title}>{title}</LocalizedText>}
      />

      <View style={styles.rightContainer}>
        {rightAction}

        {showLanguageSelector && (
          <ImprovedLanguageSelector compact={true} />
        )}

        {!rightAction && !showLanguageSelector && (
          <Appbar.Action
            icon="cog"
            color={colors.text}
            onPress={handleSettings}
            accessibilityLabel={t('accessibility.settings', '設定')}
          />
        )}
      </View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 
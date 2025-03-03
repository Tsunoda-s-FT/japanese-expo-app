import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import { colors, spacing, shadows } from '../../theme/theme';
import { LanguageCode, getLanguageInfo } from '../../i18n';

const getLanguageDisplay = (code: LanguageCode): string => {
  switch(code) {
    case 'en': return 'EN';
    case 'ja': return 'JP';
    case 'zh': return 'CN';
    case 'ko': return 'KR';
    case 'es': return 'ES';
    default: return 'EN'; // デフォルトは英語
  }
};

const getLanguageColor = (code: LanguageCode): string => {
  switch(code) {
    case 'en': return '#3c71c4';
    case 'ja': return '#d03438';
    case 'zh': return '#d4b12f';
    case 'ko': return '#1e7b1e';
    case 'es': return '#9c27b0';
    default: return '#888888';
  }
};

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  showClose?: boolean;
  showLanguageSelector?: boolean;
  showSettings?: boolean;
  subtitle?: string;
  progress?: number;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
  onClosePress?: () => void;
  onLanguagePress?: () => void;
  onSettingsPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  showClose = false,
  showLanguageSelector = true,
  showSettings = true,
  subtitle,
  progress,
  rightAction,
  onBackPress,
  onClosePress,
  onLanguagePress,
  onSettingsPress,
}) => {
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleClose = () => {
    if (onClosePress) {
      onClosePress();
    } else {
      navigation.goBack();
    }
  };

  const handleLanguagePress = () => {
    if (onLanguagePress) {
      onLanguagePress();
    } else {
      // 言語切り替えロジック
      const nextLanguage: LanguageCode = language === 'en' ? 'ja' : 'en';
      setLanguage(nextLanguage);
    }
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      navigation.navigate('Settings' as never);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            {showBack && (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            )}
            {showClose && (
              <TouchableOpacity
                onPress={handleClose}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {title}
              </Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>

          <View style={styles.rightContainer}>
            {rightAction}
            
            {showLanguageSelector && (
              <TouchableOpacity
                onPress={handleLanguagePress}
                style={[
                  styles.languageButton,
                  { backgroundColor: getLanguageColor(language) }
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.languageText}>
                  {getLanguageDisplay(language)}
                </Text>
              </TouchableOpacity>
            )}

            {showSettings && (
              <TouchableOpacity
                onPress={handleSettingsPress}
                style={[styles.iconButton, styles.settingsButton]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="cog"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    ...shadows.small,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: spacing.xs,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  iconButton: {
    padding: 4,
  },
  settingsButton: {
    marginLeft: spacing.sm,
  },
  languageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: spacing.sm,
    ...shadows.small,
  },
  languageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 3,
    backgroundColor: colors.border,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});

export default AppHeader; 
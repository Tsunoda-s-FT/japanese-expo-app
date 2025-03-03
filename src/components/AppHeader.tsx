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
import { useLanguage } from '../context/LanguageContext';
import { colors, spacing, shadows } from '../theme/theme';
import { LanguageCode } from '../i18n';

const getLanguageDisplay = (code: LanguageCode): string => {
  switch(code) {
    case 'en': return 'EN';
    case 'ja': return 'JP';
    case 'zh': return 'CN';
    case 'ko': return 'KR';
    case 'es': return 'ES';
    default: return '?';
  }
};

const getLanguageColor = (code: LanguageCode): string => {
  switch(code) {
    case 'en': return '#3c71c4';
    case 'ja': return '#d03438';
    case 'zh': return '#de2910';
    case 'ko': return '#003478';
    case 'es': return '#c60b1e';
    default: return colors.primary;
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
  const { language, t } = useLanguage();
  const navigation = useNavigation();
  
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  
  const handleClose = () => {
    if (onClosePress) {
      onClosePress();
    } else {
      navigation.getParent()?.goBack();
    }
  };
  
  const handleLanguagePress = () => {
    if (onLanguagePress) {
      onLanguagePress();
    } else {
      navigation.navigate('LanguageSettings' as never);
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
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            {showBack && (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.iconButton}
                accessibilityLabel={t('accessibility.back', '戻る')}
                accessibilityRole="button"
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
                accessibilityLabel={t('accessibility.close', '閉じる')}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.titleSection}>
            <Text 
              style={styles.title} 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            {subtitle && (
              <Text 
                style={styles.subtitle} 
                numberOfLines={1} 
                ellipsizeMode="tail"
              >
                {subtitle}
              </Text>
            )}
          </View>
          
          <View style={styles.rightSection}>
            {rightAction}
            
            {showLanguageSelector && (
              <TouchableOpacity
                onPress={handleLanguagePress}
                style={styles.iconButton}
                accessibilityLabel={t('accessibility.changeLanguage', '言語を変更')}
                accessibilityRole="button"
              >
                <View style={[
                  styles.languageButton,
                  { backgroundColor: getLanguageColor(language) }
                ]}>
                  <Text style={styles.languageText}>
                    {getLanguageDisplay(language)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            
            {showSettings && (
              <TouchableOpacity
                onPress={handleSettingsPress}
                style={styles.iconButton}
                accessibilityLabel={t('accessibility.settings', '設定')}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="cog"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
      
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(Math.max(progress * 100, 0), 100)}%` }
              ]} 
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  safeArea: {
    backgroundColor: colors.surface,
  },
  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  languageButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 4,
    width: '100%',
  },
  progressBackground: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});

export default AppHeader; 
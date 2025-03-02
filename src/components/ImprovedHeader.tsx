import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Platform, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useImprovedLanguage } from '../context/ImprovedLanguageContext';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { LanguageCode } from '../i18n';

// 言語表示
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

// 言語の色
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
  const { language, setLanguage, t } = useImprovedLanguage();
  const [menuVisible, setMenuVisible] = useState(false);
  const settingsAnchor = useRef<View>(null);
  
  // 設定メニューの位置を保持
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSettingsPress = () => {
    // アイコンの位置情報を取得して設定メニューを表示
    if (settingsAnchor.current) {
      settingsAnchor.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({ 
          top: Platform.OS === 'ios' ? pageY + height : pageY + height,
          right: 10
        });
        setMenuVisible(true);
      });
    } else {
      setMenuVisible(true);
    }
  };

  const handleLanguageSettings = () => {
    setMenuVisible(false);
    navigation.navigate('LanguageSettings' as never);
  };
  
  const handleSettings = () => {
    setMenuVisible(false);
    navigation.navigate('Settings' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={colors.surface}
        translucent={false}
      />
      <Appbar.Header style={styles.header} testID={testID}>
        {showBack && (
          <Appbar.BackAction 
            onPress={handleBack} 
            color={colors.text}
            accessibilityLabel={t('accessibility.back', '戻る')}
          />
        )}

        <Appbar.Content 
          title={title} 
          titleStyle={styles.titleText}
        />

        <View style={styles.rightContainer}>
          {rightAction}

          {showLanguageSelector && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleLanguageSettings}
              accessibilityLabel={t('accessibility.changeLanguage', '言語を変更')}
              accessibilityRole="button"
            >
              <View style={[
                styles.languageFlag, 
                { backgroundColor: getLanguageColor(language) }
              ]}>
                <Text style={styles.languageText}>{getLanguageDisplay(language)}</Text>
              </View>
            </TouchableOpacity>
          )}

          <View ref={settingsAnchor}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleSettingsPress}
              accessibilityLabel={t('accessibility.settings', '設定')}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons 
                name="cog" 
                size={24} 
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Appbar.Header>

      {/* 設定メニュー - Modalに変更 */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View 
            style={[
              styles.settingsMenu,
              {
                position: 'absolute',
                top: menuPosition.top,
                right: menuPosition.right
              }
            ]}
            onStartShouldSetResponder={() => true}
            onResponderRelease={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLanguageSettings}
            >
              <MaterialCommunityIcons name="translate" size={20} color={colors.primary} style={styles.menuIcon} />
              <Text style={styles.menuText}>{language === 'ja' ? "言語設定" : "Language Settings"}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSettings}
            >
              <MaterialCommunityIcons name="cog" size={20} color={colors.primary} style={styles.menuIcon} />
              <Text style={styles.menuText}>{language === 'ja' ? "設定" : "Settings"}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
            >
              <MaterialCommunityIcons name="information" size={20} color={colors.primary} style={styles.menuIcon} />
              <Text style={styles.menuText}>{language === 'ja' ? "アプリについて" : "About App"}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.surface,
    width: '100%',
  },
  header: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: 56,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  languageFlag: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingsMenu: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    ...shadows.medium,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    marginRight: spacing.sm,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
  },
}); 
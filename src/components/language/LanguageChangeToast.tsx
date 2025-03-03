import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode, LANGUAGES, getLanguageInfo } from '../../i18n';

// 言語アイコンマッピング
const languageIcons: Record<LanguageCode, string> = {
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  ko: '🇰🇷',
  es: '🇪🇸'
};

interface LanguageChangeToastProps {
  visible: boolean;
  onDismiss: () => void;
  language?: LanguageCode; // 古いインターフェースとの互換性のため
}

export const LanguageChangeToast: React.FC<LanguageChangeToastProps> = ({
  visible,
  onDismiss,
  language: propLanguage
}) => {
  const { language: contextLanguage, t } = useLanguage();
  const language = propLanguage || contextLanguage;
  const languageInfo = getLanguageInfo(language);
  
  // アニメーション用の値
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    if (visible) {
      // フェードインとスライドアップのアニメーション
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        })
      ]).start();
      
      // 3秒後に自動的に消える
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  const hideToast = () => {
    // フェードアウトとスライドダウンのアニメーション
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      onDismiss();
    });
  };
  
  if (!visible) return null;
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{languageIcons[language]}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('language.changed', '言語を変更しました')}</Text>
          <Text style={styles.subtitle}>
            {languageInfo.nativeName} ({languageInfo.name})
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.medium,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 14,
    marginTop: 2,
  }
}); 
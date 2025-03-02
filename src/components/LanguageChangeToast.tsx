import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';
import { getNativeLanguageName } from '../utils/languageUtils';
import { LanguageCode } from '../i18n';

interface LanguageChangeToastProps {
  visible: boolean;
  onDismiss: () => void;
  language: LanguageCode;
}

const LanguageChangeToast: React.FC<LanguageChangeToastProps> = ({
  visible,
  onDismiss,
  language
}) => {
  const [animation] = useState(new Animated.Value(0));
  const { t } = useLanguage();

  useEffect(() => {
    if (visible) {
      // アニメーションを開始
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.delay(2000),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => {
        onDismiss();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: animation,
          transform: [{
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <MaterialCommunityIcons name="check-circle" size={20} color={colors.surface} />
      <Text style={styles.text}>
        {t('language.changed', `言語を${getNativeLanguageName(language)}に変更しました`)}
      </Text>
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
    padding: 15,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
    zIndex: 1000,
  },
  text: {
    color: colors.surface,
    marginLeft: 10,
    fontWeight: '500',
  }
});

export default LanguageChangeToast; 
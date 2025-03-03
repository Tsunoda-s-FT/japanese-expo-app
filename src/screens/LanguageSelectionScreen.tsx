import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { LanguageCode } from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedView } from '../components/animations/AnimatedView';
import { FadeInView } from '../components/animations/FadeInView';
import { SlideInView } from '../components/animations/SlideInView';

// 言語アイコンマッピング
const languageIcons: Record<LanguageCode, string> = {
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  ko: '🇰🇵',
  es: '🇪🇸'
};

// 言語名のマッピング
const languageNames: Record<LanguageCode, { native: string, english: string }> = {
  en: { native: 'English', english: 'English' },
  ja: { native: '日本語', english: 'Japanese' },
  zh: { native: '中文', english: 'Chinese' },
  ko: { native: '한국어', english: 'Korean' },
  es: { native: 'Español', english: 'Spanish' }
};

// 各言語でのウェルカムテキスト
const welcomeText: Record<LanguageCode, string> = {
  en: 'Welcome to Japanese Learning App',
  ja: '日本語学習アプリへようこそ',
  zh: '欢迎使用日语学习应用',
  ko: '일본어 학습 앱에 오신 것을 환영합니다',
  es: 'Bienvenido a la aplicación de aprendizaje de japonés'
};

// 各言語での説明テキスト
const descriptionText: Record<LanguageCode, string> = {
  en: 'Choose your preferred language for the app interface. You can change it anytime in settings.',
  ja: 'アプリのインターフェイス言語を選択してください。設定でいつでも変更できます。',
  zh: '选择您偏好的应用界面语言。您可以随时在设置中更改。',
  ko: '앱 인터페이스에 사용할 언어를 선택하세요. 설정에서 언제든지 변경할 수 있습니다.',
  es: 'Elija su idioma preferido para la interfaz de la aplicación. Puede cambiarlo en cualquier momento en la configuración.'
};

// 各言語での続行ボタンテキスト
const continueText: Record<LanguageCode, string> = {
  en: 'Continue',
  ja: '続ける',
  zh: '继续',
  ko: '계속하기',
  es: 'Continuar'
};

// サポートされている言語コード
const supportedLanguages: LanguageCode[] = ['en', 'ja', 'zh', 'ko', 'es'];

interface LanguageSelectionScreenProps {
  onComplete: () => void; // 言語選択完了時のコールバック
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onComplete }) => {
  const { setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  
  // 言語選択完了ハンドラー
  const handleComplete = async () => {
    await setLanguage(selectedLanguage);
    // 初回起動フラグを保存
    await AsyncStorage.setItem('has_selected_language', 'true');
    onComplete();
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <AnimatedView animation="fade" duration={800}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo}
            />
            
            <Text style={styles.title}>{welcomeText[selectedLanguage]}</Text>
            <Text style={styles.description}>{descriptionText[selectedLanguage]}</Text>
          </View>
        </AnimatedView>
        
        <View style={styles.languagesContainer}>
          {supportedLanguages.map((langCode, index) => (
            <SlideInView key={langCode} direction="right" delay={index * 100} duration={500}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  selectedLanguage === langCode && styles.selectedLanguageButton
                ]}
                onPress={() => setSelectedLanguage(langCode)}
                accessibilityLabel={`${languageNames[langCode].english} (${languageNames[langCode].native})`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedLanguage === langCode }}
              >
                <Text style={styles.languageIcon}>{languageIcons[langCode]}</Text>
                <View style={styles.languageTextContainer}>
                  <Text style={[
                    styles.languageName,
                    selectedLanguage === langCode && styles.selectedLanguageText
                  ]}>
                    {languageNames[langCode].native}
                  </Text>
                  <Text style={styles.languageEnglishName}>
                    {languageNames[langCode].english}
                  </Text>
                </View>
                {selectedLanguage === langCode && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            </SlideInView>
          ))}
        </View>
        
        <AnimatedView animation="fade" duration={800} delay={800}>
          <Button
            mode="contained"
            style={styles.continueButton}
            labelStyle={styles.continueButtonText}
            onPress={handleComplete}
          >
            {continueText[selectedLanguage]}
          </Button>
        </AnimatedView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.text,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  languagesContainer: {
    marginBottom: spacing.xl,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  selectedLanguageButton: {
    backgroundColor: colors.primary + '10',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  languageIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  selectedLanguageText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  languageEnglishName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkmark: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  continueButton: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LanguageSelectionScreen; 
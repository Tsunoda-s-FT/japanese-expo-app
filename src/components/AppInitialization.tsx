import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useImprovedLanguage } from '../context/ImprovedLanguageContext';
import { LanguageCode, getDeviceLanguage } from '../i18n';
import { colors } from '../theme/theme';
import RootNavigator from '../navigation/RootNavigator';
import { LocalizedText } from './LocalizedText';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';

const AppInitialization: React.FC = () => {
  const { language, setLanguage } = useImprovedLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    checkLanguageSettings();
  }, []);

  const checkLanguageSettings = async () => {
    try {
      // アプリの初回起動かどうかをチェック
      const hasSelectedLanguage = await AsyncStorage.getItem('has_selected_language');
      
      if (!hasSelectedLanguage) {
        // 初回起動の場合
        setIsFirstLaunch(true);
        setIsLoading(false);
      } else {
        // 保存された言語設定を読み込む
        const savedLanguage = await AsyncStorage.getItem('user_language');
        
        if (savedLanguage && ['en', 'ja', 'zh', 'ko', 'es'].includes(savedLanguage as LanguageCode)) {
          // 保存された言語設定がある場合
          await setLanguage(savedLanguage as LanguageCode);
        } else {
          // デバイス言語を検出して設定
          const deviceLanguage = getDeviceLanguage();
          await setLanguage(deviceLanguage);
        }
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error initializing language settings:', error);
      // エラーが発生した場合はデフォルト言語を使用
      setIsLoading(false);
    }
  };

  const handleLanguageSelectionComplete = () => {
    setIsFirstLaunch(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <LocalizedText style={styles.loadingText}>
          起動中...
        </LocalizedText>
      </View>
    );
  }

  if (isFirstLaunch) {
    return <LanguageSelectionScreen onComplete={handleLanguageSelectionComplete} />;
  }

  return <RootNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
});

export default AppInitialization; 
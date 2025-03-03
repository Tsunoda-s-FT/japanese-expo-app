import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode, getDeviceLanguage, getStoredLanguage } from '../i18n/i18n';
import { colors } from '../theme/theme';
import RootNavigator from '../navigation/RootNavigator';
import { LocalizedText } from './ui/LocalizedText';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';

const AppInitialization: React.FC = () => {
  const { language, setLanguage } = useLanguage();
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
        const savedLanguage = await getStoredLanguage();
        await setLanguage(savedLanguage);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to load language settings:', error);
      // エラーが発生した場合はデフォルト言語を使用
      const deviceLanguage = getDeviceLanguage();
      await setLanguage(deviceLanguage);
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
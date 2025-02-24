import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ProgressProvider } from './src/context/ProgressContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { SettingsProvider } from './src/context/SettingsContext';
import RootNavigator from './src/navigation/RootNavigator';
import { paperTheme } from './src/theme/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <PaperProvider theme={paperTheme}>
        <SettingsProvider>
          <ProgressProvider>
            <LanguageProvider>
              <RootNavigator />
            </LanguageProvider>
          </ProgressProvider>
        </SettingsProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

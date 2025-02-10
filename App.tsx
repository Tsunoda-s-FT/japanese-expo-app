import React from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { ProgressProvider } from './src/context/ProgressContext';
import { LanguageProvider } from './src/context/LanguageContext';
import RootNavigator from './src/navigation/RootNavigator';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF5722',
    secondary: '#FFC107',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ProgressProvider>
        <LanguageProvider>
          <RootNavigator />
        </LanguageProvider>
      </ProgressProvider>
    </PaperProvider>
  );
}

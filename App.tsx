import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { paperTheme } from './src/theme/theme';
import { ImprovedLanguageProvider } from './src/context/ImprovedLanguageContext';
import { AppProvider } from './src/context/AppContext';
import AppInitialization from './src/components/AppInitialization';
import { colors } from './src/theme/theme';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <StatusBar 
            barStyle="dark-content" 
            backgroundColor={colors.surface}
            translucent={false} 
          />
          <ImprovedLanguageProvider>
            <AppProvider>
              <AppInitialization />
            </AppProvider>
          </ImprovedLanguageProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

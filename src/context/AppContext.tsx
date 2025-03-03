import React, { createContext, useContext } from 'react';
import { LanguageProvider } from './LanguageContext';
import { ProgressProvider } from './ProgressContext';
import { SettingsProvider } from './SettingsContext';
import { QuizSessionProvider } from './QuizSessionContext';
import { ContentProvider } from './ContentContext';

/** アプリケーション全体のコンテキスト型 */
interface AppContextType {
  appVersion: string;
  buildNumber: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * アプリケーション全体のプロバイダー
 * コンテキストの順序はプロバイダーの依存関係に基づいています
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // アプリケーション情報
  const appState: AppContextType = {
    appVersion: '1.0.0',
    buildNumber: '1',
  };

  return (
    <AppContext.Provider value={appState}>
      <SettingsProvider>
        <LanguageProvider>
          <ContentProvider>
            <ProgressProvider>
              <QuizSessionProvider>
                {children}
              </QuizSessionProvider>
            </ProgressProvider>
          </ContentProvider>
        </LanguageProvider>
      </SettingsProvider>
    </AppContext.Provider>
  );
};

/**
 * アプリケーションコンテキストを使用するためのフック
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import React, { createContext, useContext } from 'react';
import { LanguageProvider } from './LanguageContext';
import { UserProgressProvider } from './UserProgressContext';
import { SettingsProvider } from './SettingsContext';

// 型定義のみをインポート（実装は分離）
type QuizSessionProviderProps = {
  children: React.ReactNode;
};

type ContentProviderProps = {
  children: React.ReactNode;
};

// プレースホルダーコンポーネント（実際のファイルを遅延インポート）
const QuizSessionProvider: React.FC<QuizSessionProviderProps> = ({ children }) => {
  // 遅延インポートを実装（実際のアプリで使用時に解決される）
  const ActualQuizSessionProvider = require('./QuizSessionContext').QuizSessionProvider;
  return <ActualQuizSessionProvider>{children}</ActualQuizSessionProvider>;
};

const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  // 遅延インポートを実装（実際のアプリで使用時に解決される）
  const ActualContentProvider = require('./ContentContext').ContentProvider;
  return <ActualContentProvider>{children}</ActualContentProvider>;
};

interface AppContextType {
  appVersion: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const appState: AppContextType = {
    appVersion: '1.0.0',
  };

  return (
    <AppContext.Provider value={appState}>
      <SettingsProvider>
        <LanguageProvider>
          <ContentProvider>
            <UserProgressProvider>
              <QuizSessionProvider>
                {children}
              </QuizSessionProvider>
            </UserProgressProvider>
          </ContentProvider>
        </LanguageProvider>
      </SettingsProvider>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

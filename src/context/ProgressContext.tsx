import React, { createContext, useContext, useState } from 'react';

interface ProgressContextValue {
  learnedPhrases: Set<string>;
  addLearnedPhrase: (phraseId: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [learnedPhrases, setLearnedPhrases] = useState<Set<string>>(new Set());

  const addLearnedPhrase = (phraseId: string) => {
    setLearnedPhrases((prev) => new Set(prev).add(phraseId));
  };

  return (
    <ProgressContext.Provider value={{ learnedPhrases, addLearnedPhrase }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
};

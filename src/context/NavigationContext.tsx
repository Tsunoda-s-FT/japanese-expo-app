import React, { createContext, useContext, useState } from 'react';

type NavigationContextType = {
  afterSessionCourseId: string | null;
  setAfterSessionCourseId: (courseId: string | null) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [afterSessionCourseId, setAfterSessionCourseId] = useState<string | null>(null);

  return (
    <NavigationContext.Provider value={{ afterSessionCourseId, setAfterSessionCourseId }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

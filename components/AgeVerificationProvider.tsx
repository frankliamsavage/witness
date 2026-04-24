'use client';

import { createContext, useContext } from 'react';

// Age verification disabled - all users are treated as verified adults
interface AgeVerificationContextType {
  isAgeVerified: boolean;
  isMinor: boolean;
  requiresParentalConsent: boolean;
  showModal: () => void;
  checkAge: () => Promise<void>;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | null>(null);

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (!context) {
    throw new Error('useAgeVerification must be used within AgeVerificationProvider');
  }
  return context;
}

interface AgeVerificationProviderProps {
  children: React.ReactNode;
}

export function AgeVerificationProvider({ children }: AgeVerificationProviderProps) {
  // Stub values - all users are treated as verified adults
  const stubValue: AgeVerificationContextType = {
    isAgeVerified: true,
    isMinor: false,
    requiresParentalConsent: false,
    showModal: () => {},
    checkAge: async () => {}
  };

  return (
    <AgeVerificationContext.Provider value={stubValue}>
      {children}
    </AgeVerificationContext.Provider>
  );
}
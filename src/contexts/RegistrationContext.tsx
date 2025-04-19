
import React, { createContext, useContext, useState, ReactNode } from "react";
import { RegistrationData } from "../firebase/firestoreUtils";

interface RegistrationContextType {
  registrationData: Partial<RegistrationData> | null;
  setRegistrationData: React.Dispatch<React.SetStateAction<Partial<RegistrationData> | null>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData> | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        setRegistrationData,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error("useRegistration must be used within a RegistrationProvider");
  }
  return context;
};

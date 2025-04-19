import React, { useRef, useState } from "react";
import { RegistrationProvider, useRegistration } from "../contexts/RegistrationContext";
import Particles from "../components/ui/Particles";
import HeroSection from "../components/HeroSection";
import RegistrationForm from "../components/RegistrationForm";
import PaymentStep from "../components/PaymentStep";
import ReceiptUpload from "../components/ReceiptUpload";
import { motion } from "framer-motion";

const RegistrationSteps = () => {
  const { currentStep } = useRegistration();
  const formRef = useRef<HTMLDivElement>(null);
  
  // Function to render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegistrationForm />;
      case 2:
        return <PaymentStep />;
      case 3:
        return <ReceiptUpload />;
      default:
        return <RegistrationForm />;
    }
  };
  
  return (
    <div ref={formRef} id="registration-section" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Join the Final Celebration
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-400"
          >
            Complete the steps below to secure your spot
          </motion.p>
        </div>
        
        <div className="mb-10">
          <div className="max-w-3xl mx-auto flex items-center justify-between relative">
            {/* Step connection line - z-0 to keep it behind the step indicators */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-700 -translate-y-1/2 z-0"></div>
            
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className="z-10 flex items-center justify-center relative"
              >
                {/* Step number indicator */}
                <div 
                  className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg ${
                    currentStep === step 
                      ? "bg-party-pink text-white shadow-party-pink/30" 
                      : currentStep > step 
                        ? "bg-green-500 text-white shadow-green-500/30"
                        : "bg-gray-800 text-gray-400 shadow-gray-900/40"
                  }`}
                >
                  {currentStep > step ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg sm:text-xl font-semibold">{step}</span>
                  )}
                </div>
                {/* Step label below the number */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                  {step === 1 ? "Register" : step === 2 ? "Payment" : "Receipt"}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

const Home = () => {
  const handleScrollToForm = () => {
    document.getElementById("registration-section")?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <RegistrationProvider>
      <div className="min-h-screen">
        <Particles count={30} />
        <HeroSection onClickReserve={handleScrollToForm} />
        <RegistrationSteps />
      </div>
    </RegistrationProvider>
  );
};

export default Home;

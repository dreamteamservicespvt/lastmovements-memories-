
import React, { useEffect, useState } from "react";
import { useRegistration } from "../contexts/RegistrationContext";
import { motion } from "framer-motion";
import QRCode from "qrcode";

const PaymentStep: React.FC = () => {
  const { registrationData, setCurrentStep } = useRegistration();
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [isQrLoading, setIsQrLoading] = useState(true);

  useEffect(() => {
    if (!registrationData) return;

    const generateQRCode = async () => {
      try {
        const { name, rollNumber, year, phone } = registrationData;
        const amount = "600";
        const payeeName = "Govardhan";
        const payeeUpi = "9849834102@ybl";
        const transactionNote = `Entry Fee for ${name} - ${rollNumber} - ${year} - ${phone}`;
        
        const upiUrl = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
        
        const qrUrl = await QRCode.toDataURL(upiUrl, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#FFFFFF',
            light: '#00000000'
          }
        });
        
        setQrImageUrl(qrUrl);
        setIsQrLoading(false);
      } catch (error) {
        console.error("Error generating QR code:", error);
        setIsQrLoading(false);
      }
    };

    generateQRCode();
  }, [registrationData]);

  // Add the missing handlePaymentClick function
  const handlePaymentClick = () => {
    if (!registrationData) return;
    
    const { name, rollNumber, year, phone } = registrationData;
    const amount = "600";
    const payeeName = "Govardhan";
    const payeeUpi = "9849834102@ybl";
    const transactionNote = `Entry Fee for ${name} - ${rollNumber} - ${year} - ${phone}`;
    
    const upiUrl = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    // Open the UPI payment URL
    window.location.href = upiUrl;
  };

  // Add the missing goToReceiptUpload function
  const goToReceiptUpload = () => {
    setCurrentStep(3); // Move to receipt upload step
  };

  if (!registrationData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 sm:px-0"
    >
      <div className="glass-card rounded-xl p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white text-center">Payment Details</h2>
        
        <div className="mb-6">
          <div className="text-gray-300 text-center mb-4">
            <p className="mb-1">Hi <span className="text-party-gold font-semibold">{registrationData.name}</span></p>
            <p className="mb-1">
              Roll No: <span className="text-party-pink">{registrationData.rollNumber}</span>, 
              Year: <span className="text-party-pink">{registrationData.year}</span>
            </p>
            <p>Phone: <span className="text-party-pink">{registrationData.phone}</span></p>
            <p className="mt-2">You're one step away from confirming your spot!</p>
          </div>
          
          <div className="flex justify-center mb-6">
            {isQrLoading ? (
              <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-900/50 rounded-lg">
                <div className="w-8 h-8 border-4 border-party-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <img src={qrImageUrl} alt="Payment QR Code" className="max-w-full h-auto" />
              </div>
            )}
          </div>
          
          <div className="text-center mb-6">
            <p className="text-white font-semibold mb-2">Entry Fee: ₹600</p>
            <p className="text-sm text-gray-300">Scan the QR code or click the button below to pay</p>
          </div>
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePaymentClick}
              className="btn-glow w-full py-3 px-4 rounded-lg bg-party-gold text-gray-900 font-medium transition-all duration-300"
            >
              Pay Entry Fee ₹600
            </motion.button>
            
            <div className="text-center text-sm text-gray-400 mt-3">
              <p>Once paid, please upload your payment receipt in the next step.</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={goToReceiptUpload}
              className="w-full py-2 px-4 rounded-lg bg-transparent border border-party-pink/50 text-party-pink font-medium transition-all duration-300 hover:bg-party-pink/10"
            >
              I've Paid - Upload Receipt
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;

import React, { useState } from "react";
import { addRegistration } from "../firebase/firestoreUtils";
import { useRegistration } from "../contexts/RegistrationContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FormErrors {
  name?: string;
  year?: string;
  rollNumber?: string;
  phone?: string;
}

const RegistrationForm: React.FC = () => {
  const { setRegistrationData, setCurrentStep } = useRegistration();
  
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!year.trim()) newErrors.year = "Year is required";
    if (!rollNumber.trim()) newErrors.rollNumber = "Roll Number is required";
    
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Adding +91 prefix to the phone number
      const formData = { name, year, rollNumber, phone: `+91${phone}` };
      const result = await addRegistration(formData);
      
      // Save the original data in context without the +91 prefix for consistency
      setRegistrationData({ name, year, rollNumber, phone });
      toast.success("Registration successful!");
      setCurrentStep(2); // Move to payment step
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 sm:px-0"
    >
      <div className="glass-card rounded-xl p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white text-center">Register for the Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`glass-input w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base rounded-lg text-white ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-200 mb-1">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`glass-input w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base rounded-lg text-white ${
                errors.year ? "border-red-500" : ""
              }`}
              style={{ color: year ? 'white' : '#9ca3af' }}
            >
              <option value="" disabled style={{ color: '#111827', backgroundColor: '#f3f4f6' }}>Select your year</option>
              <option value="3rd" style={{ color: '#111827', backgroundColor: '#f3f4f6' }}>3rd Year</option>
              <option value="4th" style={{ color: '#111827', backgroundColor: '#f3f4f6' }}>4th Year</option>
            </select>
            {errors.year && (
              <p className="mt-1 text-xs text-red-400">{errors.year}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-200 mb-1">
              Roll Number
            </label>
            <input
              id="rollNumber"
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className={`glass-input w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base rounded-lg text-white ${
                errors.rollNumber ? "border-red-500" : ""
              }`}
              placeholder="e.g. 22CS01"
            />
            {errors.rollNumber && (
              <p className="mt-1 text-xs text-red-400">{errors.rollNumber}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-sm sm:text-base font-medium">
                +91
              </div>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className={`glass-input w-full pl-10 sm:pl-12 px-3 sm:px-4 py-2.5 text-sm sm:text-base rounded-lg text-white ${
                  errors.phone ? "border-red-500" : ""
                }`}
                placeholder="10-digit phone number"
                maxLength={10}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="btn-glow w-full mt-6 py-3 px-4 rounded-lg bg-party-purple text-white text-base font-medium transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              "Continue to Payment"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegistrationForm;

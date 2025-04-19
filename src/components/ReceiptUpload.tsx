import React, { useState, useRef } from "react";
import { useRegistration } from "../contexts/RegistrationContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "../utils/cloudinaryUtils";
import { updateRegistrationWithReceipt } from "../firebase/firestoreUtils";

const ReceiptUpload: React.FC = () => {
  const { registrationData, setCurrentStep } = useRegistration();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };
  
  const handleFileSelected = (selectedFile: File) => {
    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check if file size is less than 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file || !registrationData?.phone) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Simulating upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload to Cloudinary
      const response = await uploadImageToCloudinary(file);
      
      setUploadProgress(95);
      
      // Add +91 prefix to phone number to match the format used during registration
      const phoneWithPrefix = registrationData.phone.startsWith('+91') 
        ? registrationData.phone 
        : `+91${registrationData.phone}`;
      
      // Update Firestore with receipt URL
      await updateRegistrationWithReceipt(
        { field: "phone", value: phoneWithPrefix },
        { receiptUrl: response.secure_url, cloudinaryId: response.public_id }
      );
      
      clearInterval(interval);
      setUploadProgress(100);
      setIsSuccess(true);
      
      toast.success("Receipt uploaded successfully!");
      
      // Wait a moment to show success animation before clearing
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
      }, 3000);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload receipt. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  if (!registrationData) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Upload Payment Receipt</h2>
        
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-green-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Registration Complete!</h3>
            <p className="text-gray-300 mb-6">Your payment has been verified. See you at the event!</p>
            
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-party-pink rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-party-purple rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-party-gold rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        ) : (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${
                isDragging 
                  ? "border-party-pink bg-party-pink/10" 
                  : file 
                    ? "border-green-500 bg-green-500/10"
                    : "border-gray-500 hover:border-party-pink/70 hover:bg-party-pink/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
              />
              
              {file ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-green-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <p className="text-gray-300">Drag & drop your receipt or click to browse</p>
                  <p className="text-xs text-gray-400">
                    Accepts images only (max 5MB)
                  </p>
                </div>
              )}
            </div>
            
            {isUploading && (
              <div className="mb-4">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-party-pink"
                    style={{ width: `${uploadProgress}%`, transition: "width 0.3s ease" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 text-right mt-1">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !file || isUploading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "btn-glow bg-party-pink text-white"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload Receipt"}
              </motion.button>
              
              <button
                onClick={() => setCurrentStep(2)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ReceiptUpload;

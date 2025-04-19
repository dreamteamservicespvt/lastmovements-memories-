import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEventSettings } from "../contexts/EventSettingsContext";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { eventDetails } = useEventSettings();
  
  const openWhatsApp = () => {
    const message = "Hello, I'd like to enquire about the farewell party event.";
    window.open(`https://wa.me/919849834102?text=${encodeURIComponent(message)}`, "_blank");
  };

  const makePhoneCall = () => {
    window.location.href = "tel:+919849834102";
  };

  const sendEmail = () => {
    window.location.href = "mailto:thedreamteamservicespvt@gmail.com?subject=Farewell Party Enquiry";
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-gray-800">
      {/* Background gradient & decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-95"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-party-pink/40 to-transparent"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-party-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-party-pink/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Contact section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 pb-2 border-b border-gray-700 inline-block">
              Get in Touch
            </h3>
            <div className="mt-6 space-y-4">
              <motion.div 
                className="flex items-center space-x-4 group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.button 
                  onClick={openWhatsApp}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="h-5 w-5">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                  </svg>
                </motion.button>
                <div>
                  <p className="text-white font-medium">WhatsApp</p>
                  <p className="text-gray-400 text-sm">Chat with us anytime</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4 group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.button 
                  onClick={makePhoneCall}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </motion.button>
                <div>
                  <p className="text-white font-medium">Call Us</p>
                  <p className="text-gray-400 text-sm">+91 9849834102</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4 group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.button 
                  onClick={sendEmail}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-party-pink/20 text-party-pink group-hover:bg-party-pink group-hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </motion.button>
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-400 text-sm">contact@dreamteamservices.com</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* About section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 pb-2 border-b border-gray-700 inline-block">
              Event Details
            </h3>
            <ul className="mt-6 space-y-3 text-gray-300">
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-party-pink flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {eventDetails?.eventDate || "May 28, 2023"} | {eventDetails?.eventTime || "7:00 PM"}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-party-pink flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{eventDetails?.eventLocation || "Campus Auditorium, Main Building"}</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-party-pink flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{eventDetails?.eventRestrictions || "Only for 3rd & 4th year students"}</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter/CTA section */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-white text-xl font-bold mb-4 pb-2 border-b border-gray-700 inline-block">
              Don't Miss Out!
            </h3>
            <div className="mt-6">
              <p className="text-gray-300 mb-4">Reserve your spot now for the most memorable farewell party of the year!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-party-purple to-party-pink text-white rounded-lg font-medium"
                onClick={() => document.getElementById("registration-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Register Now
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Copyright bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <div className="w-10 h-10 bg-white rounded-full mr-3 flex items-center justify-center overflow-hidden">
              <img src="/src/images/logo.jpg" alt="DTS Logo" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-400 text-sm">
              <span className="text-white">Memory Lane</span> Farewell Party
            </p>
          </div>
          
          <div className="text-gray-500 text-sm">
            © {currentYear} All rights reserved. 
            <span className="block md:inline-block md:ml-2">
              Developed with <span className="text-red-500">❤</span> by{" "}
              <a 
                href="https://www.thedreamteamservices.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-party-pink font-medium hover:underline transition-all"
              >
                DREAM TEAM SERVICES
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

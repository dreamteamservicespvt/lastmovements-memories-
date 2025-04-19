import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onClickReserve: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onClickReserve }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    // Split by words instead of individual letters
    const words = "Last Moments & Memories".split(" ");
    headingRef.current.innerHTML = "";

    // Create a wrapper for each word
    words.forEach((word, wordIndex) => {
      const wordWrapper = document.createElement("span");
      wordWrapper.className = "inline-block whitespace-nowrap";
      
      // Still animate individual letters within each word
      const letters = word.split("");
      letters.forEach((letter, i) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = `${(wordIndex * 5 + i) * 0.1}s`;
        span.className = "inline-block hover:text-party-pink transition-colors duration-300";
        wordWrapper.appendChild(span);
      });
      
      headingRef.current?.appendChild(wordWrapper);
      
      // Add space between words (except after the last word)
      if (wordIndex < words.length - 1) {
        const space = document.createElement("span");
        space.textContent = " ";
        space.className = "inline-block w-4";
        headingRef.current?.appendChild(space);
      }
    });
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-pink-600/30 opacity-30 z-0"></div>
      
      {/* Background Images */}
      <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 opacity-20 z-0">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          alt="Party"
          className="w-full h-full object-cover rounded-lg"
        />
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3"
          alt="Celebration"
          className="w-full h-full object-cover rounded-lg"
        />
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"
          alt="Friends"
          className="w-full h-full object-cover rounded-lg hidden md:block"
        />
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44"
          alt="Memories"
          className="w-full h-full object-cover rounded-lg hidden md:block"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center w-full max-w-[95%] sm:max-w-4xl mx-auto px-2 sm:px-4 bg-black/30 backdrop-blur-sm rounded-xl py-6 sm:py-8"
      >
        <h1 
          ref={headingRef}
          className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 text-white tracking-tight whitespace-normal sm:whitespace-nowrap"
        >
          Last Moments & Memories
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-base sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-[85vw] sm:max-w-2xl mx-auto"
        >
          A student-only epic send-off packed with beats, bites, and mocktail nights!
        </motion.p>
        
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClickReserve}
          className="btn-glow w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium bg-party-pink text-white shadow-lg shadow-party-pink/20 hover:shadow-party-pink/40 transition-all duration-300"
        >
          Reserve My Spot
        </motion.button>

        <p className="mt-3 text-gray-400 text-xs sm:text-sm">
          *Only open for 3rd and 4th year students
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;

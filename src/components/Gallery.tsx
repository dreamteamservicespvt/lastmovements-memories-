import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGalleryImages, GalleryImage } from "../firebase/galleryUtils";

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  useEffect(() => {
    fetchImages();
  }, []);
  
  useEffect(() => {
    filterImages();
  }, [selectedCategory, images]);
  
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const data = await getGalleryImages();
      setImages(data);
      setFilteredImages(data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterImages = () => {
    if (selectedCategory === "all") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory));
    }
  };
  
  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Event Gallery</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our collection of event photos, posters, and memorable moments
          </p>
        </motion.div>
        
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["all", "poster", "event", "memory", "other"].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? "bg-party-pink text-white shadow-lg shadow-party-pink/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-party-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-300">No images found</h3>
            <p className="text-gray-500 mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
                    <img
                      src={image.thumbnailUrl}
                      alt={image.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-lg font-semibold text-white">{image.title}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2 mt-1">{image.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Lightbox for selected image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-5xl w-full max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            
            <div className="mt-4 text-white">
              <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
              <p className="text-gray-300 mt-2">{selectedImage.description}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

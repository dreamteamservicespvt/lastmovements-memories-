import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  getGalleryImages, addGalleryImage, updateGalleryImage, 
  deleteGalleryImage, GalleryImage 
} from "../../firebase/galleryUtils";
import ImageUploader from "./ImageUploader"; // corrected import (ensure this file exists)

const GalleryManager: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUploader, setShowUploader] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);
  
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const data = await getGalleryImages(selectedCategory === "all" ? undefined : selectedCategory);
      setImages(data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      toast.error("Failed to load gallery images");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageAdd = async (file: File, data: Partial<GalleryImage>) => {
    try {
      await addGalleryImage(file, {
        title: data.title || "Untitled",
        description: data.description || "",
        category: data.category || "other",
        featured: data.featured || false
      });
      
      toast.success("Image added successfully!");
      fetchImages();
      setShowUploader(false);
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Failed to add image");
    }
  };
  
  const handleImageUpdate = async (id: string, data: Partial<GalleryImage>) => {
    try {
      await updateGalleryImage(id, data);
      toast.success("Image updated successfully!");
      fetchImages();
      setEditingImage(null);
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  };
  
  const handleImageDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) {
      return;
    }
    
    try {
      await deleteGalleryImage(id);
      toast.success("Image deleted successfully!");
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };
  
  const toggleFeature = async (image: GalleryImage) => {
    try {
      await updateGalleryImage(image.id!, { featured: !image.featured });
      toast.success(`Image ${image.featured ? "unfeatured" : "featured"} successfully!`);
      fetchImages();
    } catch (error) {
      console.error("Error updating feature status:", error);
      toast.error("Failed to update feature status");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-party-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gallery Manager
          </h2>
          <p className="text-gray-400 mt-1">Manage event posters, photos, and memories</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploader(true)}
          className="px-4 py-2 bg-gradient-to-r from-party-purple to-party-pink text-white rounded-lg shadow-lg flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Image</span>
        </motion.button>
      </div>
      
      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
        {["all", "poster", "event", "memory", "other"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedCategory === category
                ? "bg-party-pink text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-party-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-300">No images found</h3>
          <p className="text-gray-500 mt-2">Upload some images to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploader(true)}
            className="mt-4 px-4 py-2 bg-party-purple text-white rounded-lg inline-flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add First Image</span>
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.thumbnailUrl}
                    alt={image.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-white truncate">{image.title}</h3>
                    <span className={`text-xs rounded-full px-2 py-1 ${getCategoryColor(image.category)}`}>
                      {image.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{image.description}</p>
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1 bg-black/60 backdrop-blur-sm rounded-lg p-1">
                    <button
                      onClick={() => toggleFeature(image)}
                      className={`p-1.5 rounded-md ${image.featured ? 'text-yellow-400 hover:bg-yellow-400/20' : 'text-gray-400 hover:bg-gray-700'}`}
                      title={image.featured ? "Unfeature image" : "Feature image"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={image.featured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditingImage(image)}
                      className="p-1.5 text-blue-400 hover:bg-blue-400/20 rounded-md"
                      title="Edit image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleImageDelete(image.id!)}
                      className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-md"
                      title="Delete image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Image Uploader Modal */}
      {showUploader && (
        <ImageUploader 
          onClose={() => setShowUploader(false)}
          onUpload={handleImageAdd}
        />
      )}
      
      {/* Image Editor Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">Edit Image</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editingImage.title}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-party-pink focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={editingImage.description}
                  onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-party-pink focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={editingImage.category}
                  onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value as any })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-party-pink focus:border-transparent"
                >
                  <option value="poster">Poster</option>
                  <option value="event">Event</option>
                  <option value="memory">Memory</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingImage.featured}
                  onChange={(e) => setEditingImage({ ...editingImage, featured: e.target.checked })}
                  className="w-4 h-4 text-party-pink bg-gray-700 border-gray-600 rounded focus:ring-party-pink focus:ring-2"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-300">
                  Featured image
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleImageUpdate(editingImage.id!, editingImage)}
                className="px-4 py-2 bg-party-pink hover:bg-party-pink/90 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Helper function to get category color
const getCategoryColor = (category: string) => {
  switch (category) {
    case "poster":
      return "bg-blue-500/20 text-blue-400";
    case "event":
      return "bg-green-500/20 text-green-400";
    case "memory":
      return "bg-purple-500/20 text-purple-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

export default GalleryManager;

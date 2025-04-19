import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GalleryImage } from "../../firebase/galleryUtils";

interface ImageUploaderProps {
	onClose: () => void;
	onUpload: (file: File, data: Partial<GalleryImage>) => Promise<void>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onClose, onUpload }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState<"poster" | "event" | "memory" | "other">("poster");
	const [featured, setFeatured] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [dragActive, setDragActive] = useState(false);
  
	const fileInputRef = useRef<HTMLInputElement>(null);
  
	const handleFileChange = (files: FileList | null) => {
		if (files && files.length > 0) {
			const selectedFile = files[0];
			if (!selectedFile.type.match("image.*")) {
				alert("Please select an image file (JPEG, PNG, etc.)");
				return;
			}
			if (selectedFile.size > 5 * 1024 * 1024) {
				alert("File size must be less than 5MB");
				return;
			}
			setFile(selectedFile);
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreview(e.target?.result as string);
			};
			reader.readAsDataURL(selectedFile);
			if (!title) {
				setTitle(selectedFile.name.split(".")[0].replace(/_/g, " ").replace(/-/g, " "));
			}
		}
	};
  
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setDragActive(true);
	};
  
	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setDragActive(false);
	};
  
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragActive(false);
		handleFileChange(e.dataTransfer.files);
	};
  
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) {
			alert("Please select an image file");
			return;
		}
		if (!title.trim()) {
			alert("Please enter a title for the image");
			return;
		}
		setIsUploading(true);
		setUploadProgress(10);
		const interval = setInterval(() => {
			setUploadProgress((prev) => Math.min(prev + 10, 90));
		}, 300);
		try {
			await onUpload(file, {
				title,
				description,
				category,
				featured
			});
			clearInterval(interval);
			setUploadProgress(100);
		} catch (error) {
			console.error("Upload error:", error);
			clearInterval(interval);
			setUploadProgress(0);
		} finally {
			setIsUploading(false);
		}
	};
  
	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				className="bg-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
			>
				<h3 className="text-xl font-bold text-white mb-4">Upload New Image</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					{!file ? (
						<div
							className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive ? "border-party-pink bg-party-pink/10" : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/30"}`}
							onClick={() => fileInputRef.current?.click()}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} className="hidden" accept="image/*" />
							<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
							<p className="text-white font-medium mb-1">Drag and drop your image here</p>
							<p className="text-gray-400 text-sm">or click to browse</p>
							<p className="text-gray-500 text-xs mt-2">Maximum file size: 5MB</p>
						</div>
					) : (
						<div className="relative">
							<img src={preview!} alt="Preview" className="w-full h-auto rounded-lg object-cover max-h-[300px]" />
							<button type="button" onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					)}
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
						<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-party-pink" placeholder="Image title" required />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
						<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-party-pink" placeholder="Optional description"></textarea>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
						<select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-party-pink">
							<option value="poster">Poster</option>
							<option value="event">Event</option>
							<option value="memory">Memory</option>
							<option value="other">Other</option>
						</select>
					</div>
					<div className="flex items-center">
						<input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 text-party-pink bg-gray-700 border-gray-600 rounded" />
						<label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-300">Featured image (shown on homepage)</label>
					</div>
					{isUploading && (
						<div className="mt-4">
							<div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
								<div className="h-full bg-party-pink" style={{ width: `${uploadProgress}%`, transition: "width 0.3s ease" }}></div>
							</div>
							<p className="text-xs text-gray-400 text-right mt-1">{uploadProgress}% uploaded</p>
						</div>
					)}
					<div className="flex justify-end gap-2 mt-6">
						<button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg" disabled={isUploading}>Cancel</button>
						<button type="submit" className="px-4 py-2 bg-party-pink hover:bg-party-pink/90 text-white rounded-lg flex items-center space-x-2" disabled={!file || isUploading}>
							{isUploading ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span>Uploading...</span>
								</>
							) : (
								"Upload Image"
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

export default ImageUploader;

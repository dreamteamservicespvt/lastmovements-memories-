
// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "duq15xsse";
const CLOUDINARY_UPLOAD_PRESET = "freefire";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

export const uploadImageToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResponse> => {
  try {
    if (!file) throw new Error("No file provided");

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Check file type (images only)
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to upload image");
    }

    const data = await response.json();
    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

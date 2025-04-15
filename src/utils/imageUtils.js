/**
 * Constructs a full URL for images from the Laravel backend
 * @param {string} imagePath - The relative image path from the API
 * @returns {string} - The complete image URL or a fallback image
 */
export const getImageUrl = (imagePath) => {
  // If no image path is provided, return a placeholder
  if (!imagePath) {
    return "/placeholder.svg"
  }

  // Check if the path is already a full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  // Base URL for Laravel storage
  const storageBaseUrl = "http://127.0.0.1:8000/storage/"

  // Clean the path (remove any leading slashes)
  const cleanPath = imagePath.replace(/^\/+/, "")

  // Return the complete URL
  return `${storageBaseUrl}${cleanPath}`
}

/**
 * Handles image loading errors by replacing with a fallback image
 * @param {Event} event - The error event
 */
export const handleImageError = (event) => {
  console.log("Image failed to load:", event.target.src)
  event.target.src = "/placeholder.svg"
  event.target.onerror = null // Prevent infinite loop if placeholder also fails
}

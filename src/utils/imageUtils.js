/**
 * Constructs a full URL for images from the Laravel backend
 * @param {string} imagePath - The relative image path from the API
 * @returns {string} - The complete image URL or a fallback image
 */
export const getImageUrl = (imagePath) => {
  // If no image path is provided, return a data URI placeholder
  if (!imagePath) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"
  }

  // Check if the path is already a full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  // Check if the path is just "storage/" with nothing after it
  if (imagePath === "storage/" || imagePath === "/storage/") {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"
  }

  // Base URL for Laravel storage
  // Get the base URL from environment variable or use default
  const storageBaseUrl = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL.replace("/api", "")}/storage/`
    : "http://127.0.0.1:8000/storage/"

  // Clean the path (remove any leading slashes and "storage/" if present)
  let cleanPath = imagePath.replace(/^\/+/, "")
  cleanPath = cleanPath.replace(/^storage\//, "")

  // If after cleaning, the path is empty, return the fallback
  if (!cleanPath) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"
  }

  // Return the complete URL
  return `${storageBaseUrl}${cleanPath}`
}

/**
 * Handles image loading errors by replacing with a fallback image
 * @param {Event} event - The error event
 */
export const handleImageError = (event) => {
  console.log("Image failed to load:", event.target.src)

  // Use data URI directly instead of placeholder.svg
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"

  // Set the fallback image and prevent further error handling
  event.target.src = fallbackImage
  event.target.onerror = null
}

/**
 * Gets the appropriate image URL for an event
 * @param {Object} event - The event object
 * @returns {string} - The image URL or a fallback
 */
export const getEventImageUrl = (event) => {
  if (!event) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"
  }

  // Check for image_path first (from API response)
  if (event.image_path) {
    // Validate the image_path
    if (event.image_path === "storage/" || event.image_path === "/storage/" || !event.image_path.trim()) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"
    }
    return getImageUrl(event.image_path)
  }

  // Fallback to image property if available
  if (event.image) {
    // Validate the image
    if (event.image === "storage/" || event.image === "/storage/" || !event.image.trim()) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"
    }
    return getImageUrl(event.image)
  }

  // Default fallback - using data URI
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"
}

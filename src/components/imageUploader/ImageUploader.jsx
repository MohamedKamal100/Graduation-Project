import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUpload,
  faImage,
  faSearch,
  faTimes,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import { useToast } from "../../context/ToastContext"

const ImageUploader = ({ initialImage, onImageSelect, className = "" }) => {
  const [selectedImage, setSelectedImage] = useState(initialImage || null)
  const [previewUrl, setPreviewUrl] = useState(initialImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const [showImageSearch, setShowImageSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const fileInputRef = useRef(null)
  const toast = useToast()

  // Update preview when initialImage changes
  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage)
      setPreviewUrl(initialImage)
    }
  }, [initialImage])

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageFile(file)
    }
  }

  // Handle image file processing
  const handleImageFile = (file) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG, GIF, etc.)")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
      setSelectedImage(file)
      if (onImageSelect) {
        onImageSelect(file)
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleImageFile(files[0])
    }
  }

  // Handle image search
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setSearchResults([])

    try {
      // This is a placeholder for an actual image search API
      // In a real application, you would use a proper API like Unsplash, Pexels, or Pixabay
      // For demo purposes, we'll simulate a search with a timeout
      setTimeout(() => {
        // Generate some placeholder results
        const dummyResults = [
          {
            id: 1,
            url: `https://source.unsplash.com/300x200/?${encodeURIComponent(searchQuery)}&sig=1`,
            thumbnail: `https://source.unsplash.com/100x100/?${encodeURIComponent(searchQuery)}&sig=1`,
          },
          {
            id: 2,
            url: `https://source.unsplash.com/300x200/?${encodeURIComponent(searchQuery)}&sig=2`,
            thumbnail: `https://source.unsplash.com/100x100/?${encodeURIComponent(searchQuery)}&sig=2`,
          },
          {
            id: 3,
            url: `https://source.unsplash.com/300x200/?${encodeURIComponent(searchQuery)}&sig=3`,
            thumbnail: `https://source.unsplash.com/100x100/?${encodeURIComponent(searchQuery)}&sig=3`,
          },
          {
            id: 4,
            url: `https://source.unsplash.com/300x200/?${encodeURIComponent(searchQuery)}&sig=4`,
            thumbnail: `https://source.unsplash.com/100x100/?${encodeURIComponent(searchQuery)}&sig=4`,
          },
          {
            id: 5,
            url: `https://source.unsplash.com/300x200/?${encodeURIComponent(searchQuery)}&sig=5`,
            thumbnail: `https://source.unsplash.com/100x100/?${encodeURIComponent(searchQuery)}&sig=5`,
          },
          {
            id: 6,
            url: `https://source.unsplash.com/300x200/?${encodeURIComponent(searchQuery)}&sig=6`,
            thumbnail: `https://source.unsplash.com/100x100/?${encodeURIComponent(searchQuery)}&sig=6`,
          },
        ]
        setSearchResults(dummyResults)
        setIsSearching(false)
      }, 1500)
    } catch (error) {
      console.error("Error searching for images:", error)
      setSearchError("Failed to search for images. Please try again.")
      setIsSearching(false)
    }
  }

  // Handle image selection from search results
  const handleSelectSearchImage = async (imageUrl) => {
    try {
      // Fetch the image and convert it to a File object
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], `image-${Date.now()}.jpg`, { type: "image/jpeg" })

      // Set the selected image
      setPreviewUrl(imageUrl)
      setSelectedImage(file)
      if (onImageSelect) {
        onImageSelect(file)
      }

      // Close the search modal
      setShowImageSearch(false)
      toast.success("Image selected successfully")
    } catch (error) {
      console.error("Error selecting image:", error)
      toast.error("Failed to select image. Please try again.")
    }
  }

  // Clear selected image
  const handleClearImage = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onImageSelect) {
      onImageSelect(null)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${isDragging
          ? "border-primary bg-primary/5"
          : "border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary"
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="mx-auto max-h-64 rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={handleClearImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-8">
            <FontAwesomeIcon icon={faImage} className="text-gray-400 dark:text-gray-600 text-4xl mb-2" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supports: JPEG, PNG, GIF (Max 5MB)
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload image"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          Browse Computer
        </button>
        <button
          type="button"
          onClick={() => setShowImageSearch(true)}
          className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faSearch} className="mr-2" />
          Search Images
        </button>
      </div>

      {/* Image search modal */}
      {showImageSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search Images</h3>
              <button
                onClick={() => setShowImageSearch(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 transition-colors"
                >
                  {isSearching ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faSearch} />
                  )}
                </button>
              </form>

              <div className="overflow-y-auto max-h-[60vh]">
                {searchError && (
                  <div className="text-center p-4 text-red-500 dark:text-red-400">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                    {searchError}
                  </div>
                )}

                {isSearching ? (
                  <div className="text-center p-8">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-primary mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Searching for images...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {searchResults.map((image) => (
                      <div
                        key={image.id}
                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => handleSelectSearchImage(image.url)}
                      >
                        <img
                          src={image.thumbnail || "/placeholder.svg"}
                          alt={`Search result ${image.id}`}
                          className="w-full h-32 object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-primary text-white px-3 py-1 rounded-md text-sm">
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500 dark:text-gray-400">No images found. Try a different search term.</p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <FontAwesomeIcon icon={faSearch} className="text-2xl text-gray-400 dark:text-gray-600 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Enter a search term to find images
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Note: These are placeholder images from Unsplash. In a production environment, you would integrate with a proper image API or service.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader

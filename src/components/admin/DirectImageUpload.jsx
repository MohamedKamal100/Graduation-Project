"use client"

import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes, faImage } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "../../context/ToastContext"

const DirectImageUpload = ({ initialImage, onImageSelect, className = "" }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const toast = useToast() || { error: console.error, success: console.log }

  // Initialize with initial image if provided
  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage)
    }
  }, [initialImage])

  // Update the component to handle file validation better
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG, GIF, etc.)")
        toast.error("Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        toast.error("Image size should be less than 5MB")
        return
      }

      setError(null)
      setSelectedFile(file)

      // Create a local preview URL
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Pass the file to parent component
      if (onImageSelect) {
        onImageSelect(file)
        toast.info("Image selected and ready for upload")
      }
    }
  }

  const handleClearImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onImageSelect) {
      onImageSelect(null)
    }
  }

  // Create a fallback image data URI
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' fontFamily='Arial' fontSize='14' textAnchor='middle' alignmentBaseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"

  // Handle image load error
  const handleImageError = () => {
    console.log("Preview image failed to load")
    setPreviewUrl(fallbackImage)
  }

  // Add a method to manually trigger file selection
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Update the render method to use a button instead of relying on the hidden input for clicks
  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className="border-2 border-dashed rounded-lg p-4 text-center transition-colors border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary relative"
        onClick={triggerFileSelect}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="mx-auto max-h-64 rounded-lg object-contain"
              onError={handleImageError}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation() // Prevent triggering the parent onClick
                handleClearImage()
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-8">
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={isUploading ? faSpinner : faImage}
                className={`text-gray-400 dark:text-gray-600 text-4xl mb-2 ${isUploading ? "animate-spin" : ""}`}
              />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                {isUploading ? "Uploading..." : "Click to select an image file"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Supports: JPEG, PNG, GIF (Max 5MB)</p>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden" // Hide the input completely
          aria-label="Upload image"
        />
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </div>
  )
}

export default DirectImageUpload

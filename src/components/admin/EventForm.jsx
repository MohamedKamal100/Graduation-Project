"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faDollarSign,
  faUsers,
  faTags,
  faInfoCircle,
  faSave,
  faTimes,
  faTicketAlt,
  faClock,
  faArrowLeft,
  faEdit,
  faPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import { createEvent, updateEvent, fetchEventById, fetchCategories } from "../../api/adminApi"
import { useToast } from "../../context/ToastContext"
import ImageUploader from "../ImageUploader/ImageUploader"

const EventForm = ({ isEditing = false }) => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)

  // Add this useEffect to fetch categories when component mounts
  useEffect(() => {
    fetchCategoriesData()
  }, [])

  const fetchCategoriesData = async () => {
    try {
      const categoriesData = await fetchCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
      // Fallback categories if API fails
      setCategories([
        { id: 1, name: "music" },
        { id: 2, name: "sports" },
        { id: 3, name: "arts" },
        { id: 4, name: "technology" },
        { id: 5, name: "food" },
        { id: 6, name: "business" },
        { id: 7, name: "education" },
        { id: 8, name: "theater" },
      ])
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    capacity: "",
    category: "", // Changed from category_id to category
    image: "",
    available_tickets: "",
  })

  useEffect(() => {
    if (isEditing && eventId) {
      fetchEventData(eventId)
    }
  }, [isEditing, eventId])

  const fetchEventData = async (id) => {
    setLoading(true)
    try {
      const eventData = await fetchEventById(id)

      // Format date and time for form inputs
      const dateObj = new Date(eventData.date)
      const formattedDate = dateObj.toISOString().split("T")[0]
      const formattedTime = dateObj.toTimeString().split(" ")[0].substring(0, 5)

      setFormData({
        name: eventData.name || "",
        description: eventData.description || "",
        date: formattedDate || "",
        time: formattedTime || "",
        location: eventData.location || "",
        price: eventData.price || "",
        capacity: eventData.capacity || "",
        category: eventData.category || "", // Changed from category_id to category
        image: eventData.image || "",
        available_tickets: eventData.available_tickets || eventData.capacity || "",
      })
    } catch (error) {
      console.error("Error fetching event data:", error)
      toast.error("Failed to load event data")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageSelect = (file) => {
    setImageFile(file)
    if (file) {
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        image: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Format date to YYYY-MM-DD as required by the API
      const dateOnly = formData.date // Already in YYYY-MM-DD format from the date input

      const eventData = {
        ...formData,
        date: dateOnly, // Use only the date part in the required format
        price: Number.parseFloat(formData.price),
        capacity: Number.parseInt(formData.capacity),
        available_tickets: Number.parseInt(formData.available_tickets),
        // category is already a string, no need to parse
      }

      // Remove time field as it's not needed in the API
      delete eventData.time

      // Handle image upload if there's a new image file
      if (imageFile) {
        // In a real application, you would upload the image to a server
        // and get back a URL to store in the database
        // For this example, we'll just use the local file URL
        eventData.image = URL.createObjectURL(imageFile)

        // In a real application, you would do something like:
        // const formData = new FormData()
        // formData.append('image', imageFile)
        // const response = await fetch('/api/upload', { method: 'POST', body: formData })
        // const data = await response.json()
        // eventData.image = data.imageUrl
      }

      if (isEditing) {
        await updateEvent(eventId, eventData)
        toast.success("Event updated successfully")
      } else {
        await createEvent(eventData)
        toast.success("Event created successfully")
      }

      navigate("/admin/events")
    } catch (error) {
      console.error("Error saving event:", error)
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(", ")
        toast.error(`Failed: ${errorMessages}`)
      } else {
        toast.error(isEditing ? "Failed to update event" : "Failed to create event")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fadeIn">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/events")}
            className="mr-4 p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hover-scale"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FontAwesomeIcon
                icon={isEditing ? faEdit : faPlus}
                className="mr-2 text-primary dark:text-primary-dark"
              />
              {isEditing ? "Edit Event" : "Create New Event"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEditing ? "Update the event details below" : "Fill in the details to create a new event"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div className="col-span-1 md:col-span-2 animate-slideUp">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                placeholder="Enter event name"
              />
            </div>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2 animate-slideUp delay-100">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
              placeholder="Enter event description"
            />
          </div>

          {/* Date */}
          <div className="animate-slideUp delay-200">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </div>
          </div>

          {/* Time */}
          <div className="animate-slideUp delay-200">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
              </div>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </div>
          </div>

          {/* Location */}
          <div className="animate-slideUp delay-300">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                placeholder="Enter event location"
              />
            </div>
          </div>

          {/* Category */}
          <div className="animate-slideUp delay-300">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faTags} className="text-gray-400" />
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="animate-slideUp delay-400">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Capacity */}
          <div className="animate-slideUp delay-400">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Capacity
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                placeholder="Enter maximum capacity"
              />
            </div>
          </div>

          {/* Available Tickets */}
          <div className="animate-slideUp delay-500">
            <label
              htmlFor="available_tickets"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Available Tickets
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faTicketAlt} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="available_tickets"
                name="available_tickets"
                value={formData.available_tickets}
                onChange={handleChange}
                required
                min="0"
                max={formData.capacity}
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                placeholder="Enter available tickets"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="col-span-1 md:col-span-2 animate-slideUp delay-500">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Image
            </label>
            <ImageUploader initialImage={formData.image} onImageSelect={handleImageSelect} className="mt-1" />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3 animate-slideUp delay-600">
          <button
            type="button"
            onClick={() => navigate("/admin/events")}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover-scale"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-scale"
          >
            <FontAwesomeIcon
              icon={submitting ? faSpinner : faSave}
              className={`mr-2 ${submitting ? "animate-spin" : ""}`}
            />
            {submitting ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventForm

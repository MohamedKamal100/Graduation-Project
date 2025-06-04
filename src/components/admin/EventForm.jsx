

// "use client"

// import { useState, useContext } from "react"
// import { useNavigate } from "react-router-dom"
// import { UserContext } from "../../context/UserContext"

// const EventForm = () => {
//   const { userLogin } = useContext(UserContext)
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     category_id: "",
//     category: "",
//     name: "",
//     description: "",
//     date: "",
//     location: "",
//     capacity: "",
//     price: "",
//     image: null,
//   })

//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState("")
//   const [error, setError] = useState("")

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
//     })
//   }

//   const handleImageChange = (e) => {
//     setFormData({
//       ...formData,
//       image: e.target.files[0],
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setMessage("")
//     setError("")

//     try {
//       const data = new FormData()

//       // Append all form fields to FormData
//       Object.keys(formData).forEach((key) => {
//         if (key === "image") {
//           if (formData.image) {
//             data.append("image_path", formData.image)
//           }
//         } else {
//           data.append(key, formData[key])
//         }
//       })

//       // Add available_tickets field (same as capacity initially)
//       if (formData.capacity) {
//         data.append("available_tickets", formData.capacity)
//       }

//       // Get authentication token from localStorage
//       const token = localStorage.getItem("token")

//       if (!token) {
//         throw new Error("Authentication token not found. Please log in again.")
//       }

//       // Log the token for debugging
//       console.log("Using token:", token ? "Token exists" : "Token missing")

//       // Log FormData contents for debugging
//       for (const pair of data.entries()) {
//         console.log(pair[0] + ": " + (pair[0] === "image_path" ? "File object" : pair[1]))
//       }

//       const baseUrl = "http://127.0.0.1:8000/api"
//       const response = await fetch(`${baseUrl}/events`, {
//         method: "POST",
//         body: data,
//         headers: {
//           // Include authentication token
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       })

//       // Check if response is JSON
//       const contentType = response.headers.get("content-type")
//       if (!contentType || !contentType.includes("application/json")) {
//         throw new Error("Server returned non-JSON response. Please check server logs.")
//       }

//       const result = await response.json()

//       if (response.ok) {
//         setMessage("Event created successfully!")
//         // Reset form after successful submission
//         setFormData({
//           category_id: "",
//           category: "",
//           name: "",
//           description: "",
//           date: "",
//           location: "",
//           capacity: "",
//           price: "",
//           image: null,
//         })
//         // Reset file input
//         document.getElementById("image-upload").value = ""

//         // Navigate to events list after a short delay
//         setTimeout(() => navigate("/admin/events"), 1500)
//       } else {
//         if (response.status === 401) {
//           setError("Authentication failed. Please log in again.")
//           // Redirect to login page after a short delay
//           setTimeout(() => navigate("/login"), 2000)
//         } else {
//           setError(result.message || "Failed to create event")
//         }
//         console.error("API Error:", result)
//       }
//     } catch (err) {
//       setError(`An error occurred: ${err.message}`)
//       console.error("Form submission error:", err)

//       // If authentication error, redirect to login
//       if (err.message.includes("Authentication token")) {
//         setTimeout(() => navigate("/login"), 2000)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

//       {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}

//       {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="category_id">
//               Category ID
//             </label>
//             <input
//               type="text"
//               id="category_id"
//               name="category_id"
//               value={formData.category_id}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="category">
//               Category
//             </label>
//             <input
//               type="text"
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="name">
//               Event Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="date">
//               Date
//             </label>
//             <input
//               type="date"
//               id="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="location">
//               Location
//             </label>
//             <input
//               type="text"
//               id="location"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="capacity">
//               Capacity
//             </label>
//             <input
//               type="number"
//               id="capacity"
//               name="capacity"
//               value={formData.capacity}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="price">
//               Price
//             </label>
//             <input
//               type="number"
//               id="price"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               required
//             />
//           </div>

//           <div className="mb-4 md:col-span-2">
//             <label className="block text-gray-700 mb-2" htmlFor="image-upload">
//               Event Image
//             </label>
//             <input
//               type="file"
//               id="image-upload"
//               name="image"
//               onChange={handleImageChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               accept="image/*"
//             />
//           </div>

//           <div className="mb-4 md:col-span-2">
//             <label className="block text-gray-700 mb-2" htmlFor="description">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
//               required
//             ></textarea>
//           </div>
//         </div>

//         <div className="mt-6">
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
//           >
//             {loading ? "Creating..." : "Create Event"}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default EventForm


"use client"

import { useState, useContext, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../context/UserContext"
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
  faFileImage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

const EventForm = ({ isEditing = false }) => {
  const { userLogin } = useContext(UserContext)
  const navigate = useNavigate()
  const { eventId } = useParams()

  // Predefined categories
  const categories = [
    { id: 1, name: "concert", label: "Concert", icon: "🎵" },
    { id: 2, name: "theater", label: "Theater", icon: "🎭" },
    { id: 3, name: "sports", label: "Sports", icon: "⚽" },
    { id: 4, name: "conference", label: "Conference", icon: "💼" },
  ]

  const [formData, setFormData] = useState({
    category_id: "",
    category: "",
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    price: "",
    available_tickets: "",
    image: null,
  })

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  // Load event data for editing
  useEffect(() => {
    if (isEditing && eventId) {
      loadEventData()
    }
  }, [isEditing, eventId])

  const loadEventData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://127.0.0.1:8000/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const eventData = await response.json()
        const eventDate = new Date(eventData.date)

        setFormData({
          category_id: eventData.category_id || "",
          category: eventData.category || "",
          name: eventData.name || "",
          description: eventData.description || "",
          date: eventDate.toISOString().split("T")[0] || "",
          time: eventDate.toTimeString().slice(0, 5) || "",
          location: eventData.location || "",
          capacity: eventData.capacity || "",
          price: eventData.price || "",
          available_tickets: eventData.available_tickets || "",
          image: null,
        })

        if (eventData.image_path) {
          setImagePreview(eventData.image_path)
        }
      }
    } catch (err) {
      setError("Failed to load event data")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))

      // Clear specific field error
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }))
      }
    },
    [errors],
  )

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }))
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }))
        return
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)

      // Clear image error
      setErrors((prev) => ({
        ...prev,
        image: "",
      }))
    }
  }, [])

  const removeImage = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }))
    setImagePreview(null)
    document.getElementById("image-upload").value = ""
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Event name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = "Valid capacity is required"
    if (!formData.price || formData.price < 0) newErrors.price = "Valid price is required"
    if (!formData.available_tickets || formData.available_tickets < 0) {
      newErrors.available_tickets = "Valid available tickets is required"
    }
    if (formData.available_tickets > formData.capacity) {
      newErrors.available_tickets = "Available tickets cannot exceed capacity"
    }
    if (!formData.category_id) newErrors.category_id = "Category ID is required"

    // Date validation
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      newErrors.date = "Event date cannot be in the past"
    }

    // Date format validation (Y-m-d)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(formData.date)) {
      newErrors.date = "Date must be in Y-m-d format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setError("Please fix the errors below")
      return
    }

    setSubmitting(true)
    setMessage("")
    setError("")

    try {
      const data = new FormData()

      // Combine date and time
      const eventDateTime = formData.date // إرسال التاريخ فقط بصيغة Y-m-d

      // Append form data
      data.append("category_id", formData.category_id)
      data.append("category", formData.category)
      data.append("name", formData.name.trim())
      data.append("description", formData.description.trim())
      data.append("date", eventDateTime)
      data.append("location", formData.location.trim())
      data.append("capacity", formData.capacity)
      data.append("price", formData.price)
      data.append("available_tickets", formData.available_tickets)

      if (formData.image) {
        data.append("image_path", formData.image)
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const url = isEditing ? `http://127.0.0.1:8000/api/events/${eventId}` : "http://127.0.0.1:8000/api/events"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(isEditing ? "Event updated successfully!" : "Event created successfully!")

        if (!isEditing) {
          // Reset form for new event
          setFormData({
            category_id: "",
            category: "",
            name: "",
            description: "",
            date: "",
            time: "",
            location: "",
            capacity: "",
            price: "",
            available_tickets: "",
            image: null,
          })
          setImagePreview(null)
          document.getElementById("image-upload").value = ""
        }

        setTimeout(() => navigate("/admin/events"), 1500)
      } else {
        if (response.status === 401) {
          setError("Authentication failed. Please log in again.")
          setTimeout(() => navigate("/login"), 2000)
        } else {
          setError(result.message || `Failed to ${isEditing ? "update" : "create"} event`)
        }
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`)
      if (err.message.includes("Authentication token")) {
        setTimeout(() => navigate("/login"), 2000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-6 py-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/admin/events")}
                className="mr-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 transform hover:scale-110"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <FontAwesomeIcon icon={isEditing ? faEdit : faPlus} className="mr-3 text-white/90" />
                  {isEditing ? "Edit Event" : "Create New Event"}
                </h1>
                <p className="text-blue-100 dark:text-purple-100 mt-2">
                  {isEditing ? "Update the event details below" : "Fill in the details to create a new event"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg animate-fadeIn">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {message}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg animate-fadeIn">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300"
        >
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Name */}
              <div className="lg:col-span-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Event Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-12 w-full rounded-lg border-2 ${errors.name
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                    placeholder="Enter event name"
                  />
                </div>
                {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faTags} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`pl-12 w-full rounded-lg border-2 ${errors.category
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
              </div>

              {/* Category ID */}
              <div>
                <label
                  htmlFor="category_id"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category ID *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faTags} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`pl-12 w-full rounded-lg border-2 ${errors.category_id
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                    placeholder="Enter category ID"
                  />
                </div>
                {errors.category_id && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category_id}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`pl-12 w-full rounded-lg border-2 ${errors.date
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                  />
                </div>
                {errors.date && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.date}</p>}
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Time *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faClock} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`pl-12 w-full rounded-lg border-2 ${errors.time
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                  />
                </div>
                {errors.time && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.time}</p>}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`pl-12 w-full rounded-lg border-2 ${errors.location
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                    placeholder="Enter event location"
                  />
                </div>
                {errors.location && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faDollarSign} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`pl-12 w-full rounded-lg border-2 ${errors.price
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
              </div>

              {/* Capacity */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Capacity *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUsers} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className={`pl-12 w-full rounded-lg border-2 ${errors.capacity
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                    placeholder="Enter maximum capacity"
                  />
                </div>
                {errors.capacity && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.capacity}</p>}
              </div>

              {/* Available Tickets */}
              <div>
                <label
                  htmlFor="available_tickets"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Available Tickets *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faTicketAlt} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="available_tickets"
                    name="available_tickets"
                    value={formData.available_tickets}
                    onChange={handleChange}
                    min="0"
                    max={formData.capacity || undefined}
                    className={`pl-12 w-full rounded-lg border-2 ${errors.available_tickets
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200`}
                    placeholder="Enter available tickets"
                  />
                </div>
                {errors.available_tickets && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.available_tickets}</p>
                )}
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full rounded-lg border-2 ${errors.description
                      ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                      : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    } bg-white dark:bg-gray-700 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 resize-none`}
                  placeholder="Enter event description"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="image-upload"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Event Image
                </label>
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed ${errors.image ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                      } rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200`}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                      <FontAwesomeIcon icon={faFileImage} className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</span>
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>
                {errors.image && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.image}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/events")}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-200 transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 border-2 border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                <FontAwesomeIcon
                  icon={submitting ? faSpinner : faSave}
                  className={`mr-2 ${submitting ? "animate-spin" : ""}`}
                />
                {submitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm

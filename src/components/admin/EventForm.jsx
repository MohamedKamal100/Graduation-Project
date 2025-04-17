// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faCalendarAlt,
//   faMapMarkerAlt,
//   faDollarSign,
//   faUsers,
//   faTags,
//   faInfoCircle,
//   faSave,
//   faTimes,
//   faTicketAlt,
//   faClock,
//   faArrowLeft,
//   faEdit,
//   faPlus,
//   faSpinner,
// } from "@fortawesome/free-solid-svg-icons"
// import { createEvent, updateEvent, fetchEventById, fetchCategories } from "../../api/adminApi"
// import { useToast } from "../../context/ToastContext"
// import { getImageUrl } from "../../utils/imageUtils"
// import axios from "axios"
// // Import the simplified image uploader
// import DirectImageUpload from "./DirectImageUpload"
// // Add this import at the top:
// import { uploadEventImage } from "../../api/adminApi"

// const EventForm = ({ isEditing = false }) => {
//   const { eventId } = useParams()
//   const navigate = useNavigate()
//   const toast = useToast()
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const [categories, setCategories] = useState([])
//   const [imageFile, setImageFile] = useState(null)

//   // Add this useEffect to fetch categories when component mounts
//   useEffect(() => {
//     fetchCategoriesData()
//   }, [])

//   const fetchCategoriesData = async () => {
//     try {
//       const categoriesData = await fetchCategories()
//       setCategories(categoriesData)
//     } catch (error) {
//       console.error("Error fetching categories:", error)
//       toast.error("Failed to load categories")
//       // Fallback categories if API fails
//       setCategories([
//         { id: 1, name: "music" },
//         { id: 2, name: "sports" },
//         { id: 3, name: "arts" },
//         { id: 4, name: "technology" },
//         { id: 5, name: "food" },
//         { id: 6, name: "business" },
//         { id: 7, name: "education" },
//         { id: 8, name: "theater" },
//       ])
//     }
//   }

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     date: "",
//     time: "",
//     location: "",
//     price: "",
//     capacity: "",
//     category: "", // Changed from category_id to category
//     image: "",
//     available_tickets: "",
//   })

//   useEffect(() => {
//     if (isEditing && eventId) {
//       fetchEventData(eventId)
//     }
//   }, [isEditing, eventId])

//   const fetchEventData = async (id) => {
//     setLoading(true)
//     try {
//       const eventData = await fetchEventById(id)

//       // Format date and time for form inputs
//       const dateObj = new Date(eventData.date)
//       const formattedDate = dateObj.toISOString().split("T")[0]
//       const formattedTime = dateObj.toTimeString().split(" ")[0].substring(0, 5)

//       // Update the formData setting to handle image_path directly
//       setFormData({
//         name: eventData.name || "",
//         description: eventData.description || "",
//         date: formattedDate || "",
//         time: formattedTime || "",
//         location: eventData.location || "",
//         price: eventData.price || "",
//         capacity: eventData.capacity || "",
//         category: eventData.category || "",
//         // Use image_path directly if it's a full URL
//         image: eventData.image_path || getImageUrl(eventData.image_path) || "",
//         available_tickets: eventData.available_tickets || eventData.capacity || "",
//       })
//     } catch (error) {
//       console.error("Error fetching event data:", error)
//       toast.error("Failed to load event data")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleImageSelect = (file) => {
//     setImageFile(file)
//     if (file) {
//       // Create a temporary URL for preview
//       const imageUrl = URL.createObjectURL(file)
//       setFormData((prev) => ({
//         ...prev,
//         image: imageUrl,
//       }))
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         image: "",
//       }))
//     }
//   }

//   // Then update the uploadImage function to try both methods:
//   const uploadImage = async (file) => {
//     if (!file) {
//       console.log("No file provided for upload")
//       return null
//     }

//     const formData = new FormData()
//     formData.append("image", file)

//     try {
//       // First try with axios
//       const token = localStorage.getItem("token")
//       const baseUrl = process.env.REACT_APP_API_URL
//         ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, "")
//         : "http://127.0.0.1:8000"

//       console.log("Uploading image to:", `${baseUrl}/api/upload-image`)

//       try {
//         const response = await axios.post(`${baseUrl}/api/upload-image`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//             "X-Requested-With": "XMLHttpRequest",
//           },
//         })

//         console.log("Image upload response:", response.data)

//         if (response.data && (response.data.path || response.data.url || response.data.image_path)) {
//           return response.data.path || response.data.url || response.data.image_path
//         }
//       } catch (axiosError) {
//         console.error("Axios upload failed, trying alternative method:", axiosError)
//         // If axios fails, try the alternative method
//         return await uploadEventImage(file)
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error)
//       throw new Error("Failed to upload image: " + (error.response?.data?.message || error.message))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSubmitting(true)

//     try {
//       // Format date to YYYY-MM-DD as required by the API
//       const dateOnly = formData.date // Already in YYYY-MM-DD format from the date input

//       const eventData = {
//         ...formData,
//         date: dateOnly, // Use only the date part in the required format
//         price: Number.parseFloat(formData.price),
//         capacity: Number.parseInt(formData.capacity),
//         available_tickets: Number.parseInt(formData.available_tickets),
//         // category is already a string, no need to parse
//       }

//       // Remove time field as it's not needed in the API
//       delete eventData.time

//       // Handle image upload if there's a new image file
//       if (imageFile) {
//         try {
//           // Upload the image to the server
//           const imagePath = await uploadImage(imageFile)
//           console.log("Image uploaded successfully, path:", imagePath)
//           // Set the image path in the event data
//           if (imagePath) {
//             eventData.image_path = imagePath
//           }
//         } catch (error) {
//           console.error("Image upload error:", error)
//           // Ask the user if they want to continue without an image
//           if (window.confirm("Failed to upload image. Do you want to continue saving the event without an image?")) {
//             // Continue without an image
//             console.log("Continuing without image")
//           } else {
//             // Stop the submission
//             setSubmitting(false)
//             return
//           }
//         }
//       }

//       // Remove the image field as it's just for preview
//       delete eventData.image

//       if (isEditing) {
//         await updateEvent(eventId, eventData)
//         toast.success("Event updated successfully")
//       } else {
//         await createEvent(eventData)
//         toast.success("Event created successfully")
//       }

//       navigate("/admin/events")
//     } catch (error) {
//       console.error("Error saving event:", error)
//       if (error.response && error.response.data && error.response.data.errors) {
//         const errorMessages = Object.values(error.response.data.errors).flat().join(", ")
//         toast.error(`Failed: ${errorMessages}`)
//       } else {
//         toast.error(isEditing ? "Failed to update event" : "Failed to create event")
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fadeIn">
//       <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
//         <div className="flex items-center">
//           <button
//             onClick={() => navigate("/admin/events")}
//             className="mr-4 p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hover-scale"
//             aria-label="Go back"
//           >
//             <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
//           </button>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
//               <FontAwesomeIcon
//                 icon={isEditing ? faEdit : faPlus}
//                 className="mr-2 text-primary dark:text-primary-dark"
//               />
//               {isEditing ? "Edit Event" : "Create New Event"}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {isEditing ? "Update the event details below" : "Fill in the details to create a new event"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Event Name */}
//           <div className="col-span-1 md:col-span-2 animate-slideUp">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Event Name
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//                 placeholder="Enter event name"
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="col-span-1 md:col-span-2 animate-slideUp delay-100">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               rows={4}
//               className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//               placeholder="Enter event description"
//             />
//           </div>

//           {/* Date */}
//           <div className="animate-slideUp delay-200">
//             <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Date
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
//               </div>
//               <input
//                 type="date"
//                 id="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//                 className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//               />
//             </div>
//           </div>

//           {/* Time */}
//           <div className="animate-slideUp delay-200">
//             <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Time
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faClock} className="text-gray-400" />
//               </div>
//               <input
//                 type="time"
//                 id="time"
//                 name="time"
//                 value={formData.time}
//                 onChange={handleChange}
//                 required
//                 className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//               />
//             </div>
//           </div>

//           {/* Location */}
//           <div className="animate-slideUp delay-300">
//             <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Location
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 required
//                 className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//                 placeholder="Enter event location"
//               />
//             </div>
//           </div>

//           {/* Category */}
//           <div className="animate-slideUp delay-300">
//             <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Category
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faTags} className="text-gray-400" />
//               </div>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.name}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Price */}
//           <div className="animate-slideUp delay-400">
//             <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Price
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
//               </div>
//               <input
//                 type="number"
//                 id="price"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 required
//                 min="0"
//                 step="0.01"
//                 className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//                 placeholder="0.00"
//               />
//             </div>
//           </div>

//           {/* Capacity */}
//           <div className="animate-slideUp delay-400">
//             <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Capacity
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
//               </div>
//               <input
//                 type="number"
//                 id="capacity"
//                 name="capacity"
//                 value={formData.capacity}
//                 onChange={handleChange}
//                 required
//                 min="1"
//                 className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//                 placeholder="Enter maximum capacity"
//               />
//             </div>
//           </div>

//           {/* Available Tickets */}
//           <div className="animate-slideUp delay-500">
//             <label
//               htmlFor="available_tickets"
//               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//             >
//               Available Tickets
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faTicketAlt} className="text-gray-400" />
//               </div>
//               <input
//                 type="number"
//                 id="available_tickets"
//                 name="available_tickets"
//                 value={formData.available_tickets}
//                 onChange={handleChange}
//                 required
//                 min="0"
//                 max={formData.capacity}
//                 className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
//                 placeholder="Enter available tickets"
//               />
//             </div>
//           </div>

//           {/* Image Upload - Simplified to just one component */}
//           <div className="col-span-1 md:col-span-2 animate-slideUp delay-500">
//             <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Event Image
//             </label>
//             <DirectImageUpload initialImage={formData.image} onImageSelect={handleImageSelect} className="mt-1" />
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="mt-8 flex justify-end space-x-3 animate-slideUp delay-600">
//           <button
//             type="button"
//             onClick={() => navigate("/admin/events")}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover-scale"
//           >
//             <FontAwesomeIcon icon={faTimes} className="mr-2" />
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-scale"
//           >
//             <FontAwesomeIcon
//               icon={submitting ? faSpinner : faSave}
//               className={`mr-2 ${submitting ? "animate-spin" : ""}`}
//             />
//             {submitting ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default EventForm

"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../context/UserContext"

const EventForm = () => {
  const { userLogin } = useContext(UserContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    category_id: "",
    category: "",
    name: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    price: "",
    image: null,
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const data = new FormData()

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "image") {
          if (formData.image) {
            data.append("image_path", formData.image)
          }
        } else {
          data.append(key, formData[key])
        }
      })

      // Add available_tickets field (same as capacity initially)
      if (formData.capacity) {
        data.append("available_tickets", formData.capacity)
      }

      // Get authentication token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      // Log the token for debugging
      console.log("Using token:", token ? "Token exists" : "Token missing")

      // Log FormData contents for debugging
      for (const pair of data.entries()) {
        console.log(pair[0] + ": " + (pair[0] === "image_path" ? "File object" : pair[1]))
      }

      const baseUrl = "http://127.0.0.1:8000/api"
      const response = await fetch(`${baseUrl}/events`, {
        method: "POST",
        body: data,
        headers: {
          // Include authentication token
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please check server logs.")
      }

      const result = await response.json()

      if (response.ok) {
        setMessage("Event created successfully!")
        // Reset form after successful submission
        setFormData({
          category_id: "",
          category: "",
          name: "",
          description: "",
          date: "",
          location: "",
          capacity: "",
          price: "",
          image: null,
        })
        // Reset file input
        document.getElementById("image-upload").value = ""

        // Navigate to events list after a short delay
        setTimeout(() => navigate("/admin/events"), 1500)
      } else {
        if (response.status === 401) {
          setError("Authentication failed. Please log in again.")
          // Redirect to login page after a short delay
          setTimeout(() => navigate("/login"), 2000)
        } else {
          setError(result.message || "Failed to create event")
        }
        console.error("API Error:", result)
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`)
      console.error("Form submission error:", err)

      // If authentication error, redirect to login
      if (err.message.includes("Authentication token")) {
        setTimeout(() => navigate("/login"), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="category_id">
              Category ID
            </label>
            <input
              type="text"
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="category">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="capacity">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 mb-2" htmlFor="image-upload">
              Event Image
            </label>
            <input
              type="file"
              id="image-upload"
              name="image"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              accept="image/*"
            />
          </div>

          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            ></textarea>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventForm

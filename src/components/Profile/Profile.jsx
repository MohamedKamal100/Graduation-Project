"use client"

import { useState, useContext, useEffect } from "react"
import { UserContext } from "../../context/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faEnvelope,
  faPhone,
  faVenusMars,
  faCalendarAlt,
  faTicketAlt,
  faHeart,
  faEdit,
  faCamera,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import { useBooking } from "../../context/BookingContext"
import { useEvents } from "../../context/EventsContext"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const { userData, updateUserData } = useContext(UserContext)
  const { tickets } = useBooking()
  const { getFavoriteEvents } = useEvents()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
  })

  const favoriteEvents = getFavoriteEvents()

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        fname: userData.fname || "",
        lname: userData.lname || "",
        phone: userData.phone || "",
        email: userData.email || "",
      })
    }
  }, [userData])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically make an API call to update the user data
    // For now, we'll just update the local state
    updateUserData(formData)
    setIsEditing(false)
  }

  // Handle profile picture upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file upload
    const reader = new FileReader()
    reader.onloadend = () => {
      // In a real app, you would upload the file to your server
      // and get back a URL to the uploaded image
      setTimeout(() => {
        updateUserData({ profile_picture: reader.result })
        setIsUploading(false)
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData) return "U"

    const fname = userData.fname || ""
    const lname = userData.lname || ""

    return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mr-2" />
            <span className="text-gray-600 dark:text-gray-300">Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
            <div className="relative h-40 bg-gradient-to-r from-purple-600 to-blue-500">
              <div className="absolute -bottom-16 left-6">
                <div className="relative">
                  {userData.profile_picture ? (
                    <img
                      src={userData.profile_picture || "/placeholder.svg"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-white dark:border-gray-800 flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-gray-300">
                      {getUserInitials()}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md">
                    <FontAwesomeIcon icon={faCamera} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      disabled={isUploading}
                    />
                    <span className="sr-only">Upload profile picture</span>
                  </label>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faSpinner} spin className="text-white text-xl" />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md shadow-sm flex items-center text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.fname} {userData.lname}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{userData.username ? `@${userData.username}` : ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile information */}
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {isEditing ? "Edit Profile Information" : "Profile Information"}
                </h2>

                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="fname"
                          value={formData.fname}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lname"
                          value={formData.lname}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 mr-3"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-gray-900 dark:text-white">
                          {userData.fname} {userData.lname}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-white">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-gray-900 dark:text-white">{userData.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faVenusMars} className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                        <p className="text-gray-900 dark:text-white">
                          {userData.gender === "M" ? "Male" : userData.gender === "F" ? "Female" : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent tickets */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tickets</h2>
                  <button
                    onClick={() => navigate("/tickets")}
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-6">
                    <FontAwesomeIcon icon={faTicketAlt} className="text-gray-400 dark:text-gray-600 text-4xl mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">You haven't purchased any tickets yet</p>
                    <button
                      onClick={() => navigate("/events")}
                      className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                    >
                      Browse Events
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.slice(0, 3).map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => navigate(`/eventDetails/${ticket.event.id}`)}
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                          <img
                            src={ticket.event.image_path || "/placeholder.svg"}
                            alt={ticket.event.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {ticket.event.name}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            <span>{ticket.event.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-md">
                            {ticket.quantity} {ticket.quantity > 1 ? "tickets" : "ticket"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Favorites */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Favorites</h2>
                  <button
                    onClick={() => navigate("/favorite")}
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>

                {favoriteEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <FontAwesomeIcon icon={faHeart} className="text-gray-400 dark:text-gray-600 text-4xl mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No favorite events yet</p>
                    <button
                      onClick={() => navigate("/events")}
                      className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                    >
                      Browse Events
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favoriteEvents.slice(0, 5).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => navigate(`/eventDetails/${event.id}`)}
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                          <img
                            src={event.image_path || "/placeholder.svg"}
                            alt={event.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{event.name}</h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            <span>{event.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile


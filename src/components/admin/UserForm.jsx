"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faTimes,
  faSave,
  faIdCard,
  faVenusMars,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons"

const UserForm = ({ user, isEditing, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "M",
    role: "customer",
    image_path: null,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        id: user.id,
        fname: user.fname || "",
        lname: user.lname || "",
        username: user.username || "",
        email: user.email || "",
        password: "", // Don't populate password for security
        phone: user.phone || "",
        gender: user.gender || "M",
        role: user.role || "customer",
        image_path: user.image_path || null,
      })
    }
  }, [user, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.fname) newErrors.fname = "First name is required"
    if (!formData.lname) newErrors.lname = "Last name is required"
    if (!formData.username) newErrors.username = "Username is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!isEditing && !formData.password) newErrors.password = "Password is required"
    if (!formData.phone) newErrors.phone = "Phone number is required"

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    // Phone validation (Egyptian phone number)
    if (formData.phone && !/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid (must be Egyptian format)"
    }

    // Password validation (only for new users or if password is provided)
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // If editing and password is empty, remove it from the payload
      const payload = { ...formData }
      if (isEditing && !payload.password) {
        delete payload.password
      }

      await onSubmit(payload, isEditing)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-scaleIn">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? `Edit User: ${user?.fname} ${user?.lname}` : "Add New User"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* First Name */}
            <div className="col-span-1">
              <label htmlFor="fname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.fname ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
                  placeholder="First name"
                />
              </div>
              {errors.fname && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.fname}</p>}
            </div>

            {/* Last Name */}
            <div className="col-span-1">
              <label htmlFor="lname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.lname ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
                  placeholder="Last name"
                />
              </div>
              {errors.lname && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.lname}</p>}
            </div>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faIdCard} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${errors.username ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
                placeholder="Username"
              />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
                placeholder="Email address"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
                placeholder="Phone number"
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isEditing ? "Password (leave blank to keep current)" : "Password"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
                placeholder="Password"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.password}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Gender */}
            <div className="col-span-1">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faVenusMars} className="text-gray-400" />
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>

            {/* Role */}
            <div className="col-span-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUserTag} className="text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm

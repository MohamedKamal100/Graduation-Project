
import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEye,
  faEyeSlash,
  faCheck,
  faPhone,
  faLock,
  faEnvelope,
  faUser,
  faVenusMars,
  faCircleNotch,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { motion, AnimatePresence } from "framer-motion"

const RegisterSchema = Yup.object().shape({
  fname: Yup.string()
    .min(2, "First name is too short")
    .max(50, "First name is too long")
    .required("First name is required"),
  lname: Yup.string()
    .min(2, "Last name is too short")
    .max(50, "Last name is too long")
    .required("Last name is required"),
  username: Yup.string()
    .min(4, "Username is too short")
    .max(50, "Username is too long")
    .required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  phone: Yup.string()
    .matches(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number")
    .required("Phone number is required"),
  gender: Yup.string().oneOf(["M", "F"], "Please select a valid gender").required("Gender is required"),
})

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 2

  // API endpoint for registration - Using the provided API
  const API_URL = "http://127.0.0.1:8000/api/register"

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setApiError(null)
      console.log("📤 Sending data:", values)

      const response = await axios.post(API_URL, values, {
        headers: { "Content-Type": "application/json" },
      })

      console.log("✅ Response:", response.data)

      if (response.data?.status === 201 && response.data?.message === "success") {
        setRegistrationSuccess(true)
        resetForm()
      } else {
        setApiError("Registration failed, please try again.")
      }
    } catch (error) {
      console.error("❌ Server Error:", error.response?.data || error.message)

      // Extract errors from API
      if (error.response?.status === 422) {
        const errorData = error.response?.data?.data || {}
        const errorMessages = []

        Object.keys(errorData).forEach((field) => {
          errorMessages.push(`${field}: ${errorData[field].join(" ")}`)
        })

        setApiError(errorMessages.join("\n"))
      } else {
        setApiError(error.response?.data?.message || "An error occurred.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  }

  const backgroundImages = [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  ]

  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <div className="min-h-screen py-10 relative font-sans overflow-hidden">
      {/* Animated background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBgIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 z-0"
        >
          <img
            src={backgroundImages[currentBgIndex] || "/placeholder.svg"}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 dark:from-gray-900/90 dark:to-indigo-900/90"></div>

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/20"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: Math.random() * 0.5 + 0.3,
                }}
                animate={{
                  y: [null, Math.random() * 100 + "%"],
                  opacity: [null, Math.random() * 0.3 + 0.1],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white/10 dark:bg-gray-900/20 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 dark:border-gray-700/30"
        >
          {registrationSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="mx-auto w-16 h-16 flex items-center justify-center bg-green-500/20 text-green-400 rounded-full mb-4 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faCheck} className="text-2xl" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-white mb-2">Registration Successful!</h2>
              <p className="text-gray-300 mb-6">Your account has been created successfully.</p>
              <motion.a
                href="/login"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-purple-700/20"
              >
                Proceed to Login
              </motion.a>
            </motion.div>
          ) : (
            <Formik
              initialValues={{
                fname: "",
                lname: "",
                username: "",
                phone: "",
                email: "",
                password: "",
                gender: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, values }) => (
                <Form>
                  <motion.div variants={itemVariants} className="p-6 text-center">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-2 text-white">Create Account</h1>
                    <p className="text-sm text-gray-200 mb-4">Join our community today</p>

                    {/* Progress indicator */}
                    <div className="flex justify-center items-center space-x-2 mb-4">
                      {[...Array(totalSteps)].map((_, index) => (
                        <motion.div
                          key={index}
                          className={`h-2 rounded-full ${index + 1 === currentStep
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 w-8"
                            : index + 1 < currentStep
                              ? "bg-purple-500 w-8"
                              : "bg-gray-500/30 w-4"
                            }`}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => {
                            // Only allow going back or to completed steps
                            if (index + 1 < currentStep) {
                              setCurrentStep(index + 1)
                            }
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {apiError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mx-6 mb-4 p-4 bg-red-500/20 border border-red-500/30 text-red-200 text-sm rounded-xl backdrop-blur-sm flex items-start"
                      >
                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3 mt-0.5 text-red-400" />
                        <span>{apiError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence custom={currentStep}>
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        custom={1}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        variants={slideVariants}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="px-6 pb-2 text-start font-semibold"
                      >
                        {/* First Name */}
                        <div className="mb-5">
                          <label htmlFor="fname" className="block text-sm font-medium mb-2 text-gray-200">
                            First Name
                          </label>
                          <div className="relative group">
                            <Field name="fname">
                              {({ field }) => (
                                <input
                                  id="fname"
                                  type="text"
                                  placeholder="Enter your first name"
                                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.fname && touched.fname
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-purple-500/30 focus:border-purple-500/70"
                                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm transition-all duration-300`}
                                  {...field}
                                />
                              )}
                            </Field>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200">
                              <FontAwesomeIcon icon={faUser} className="text-lg" />
                            </div>
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 w-0 group-focus-within:w-full transition-all duration-300"
                              layoutId="fnameUnderline"
                            />
                          </div>
                          <ErrorMessage name="fname">
                            {(msg) => (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-2 flex items-center"
                              >
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                {msg}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </div>

                        {/* Last Name */}
                        <div className="mb-5">
                          <label htmlFor="lname" className="block text-sm font-medium mb-2 text-gray-200">
                            Last Name
                          </label>
                          <div className="relative group">
                            <Field name="lname">
                              {({ field }) => (
                                <input
                                  id="lname"
                                  type="text"
                                  placeholder="Enter your last name"
                                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.lname && touched.lname
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-purple-500/30 focus:border-purple-500/70"
                                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm transition-all duration-300`}
                                  {...field}
                                />
                              )}
                            </Field>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200">
                              <FontAwesomeIcon icon={faUser} className="text-lg" />
                            </div>
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 w-0 group-focus-within:w-full transition-all duration-300"
                              layoutId="lnameUnderline"
                            />
                          </div>
                          <ErrorMessage name="lname">
                            {(msg) => (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-2 flex items-center"
                              >
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                {msg}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </div>

                        {/* Username */}
                        <div className="mb-5">
                          <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-200">
                            Username
                          </label>
                          <div className="relative group">
                            <Field name="username">
                              {({ field }) => (
                                <input
                                  id="username"
                                  type="text"
                                  placeholder="Choose a username"
                                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.username && touched.username
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-purple-500/30 focus:border-purple-500/70"
                                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm transition-all duration-300`}
                                  {...field}
                                />
                              )}
                            </Field>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200">
                              <FontAwesomeIcon icon={faUser} className="text-lg" />
                            </div>
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 w-0 group-focus-within:w-full transition-all duration-300"
                              layoutId="usernameUnderline"
                            />
                          </div>
                          <ErrorMessage name="username">
                            {(msg) => (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-2 flex items-center"
                              >
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                {msg}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        custom={2}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        variants={slideVariants}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="px-6 pb-2 text-start font-semibold"
                      >
                        {/* Email */}
                        <div className="mb-5">
                          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-200">
                            Email
                          </label>
                          <div className="relative group">
                            <Field name="email">
                              {({ field }) => (
                                <input
                                  id="email"
                                  type="email"
                                  placeholder="Enter your email"
                                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.email && touched.email
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-purple-500/30 focus:border-purple-500/70"
                                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm transition-all duration-300`}
                                  {...field}
                                />
                              )}
                            </Field>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200">
                              <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
                            </div>
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 w-0 group-focus-within:w-full transition-all duration-300"
                              layoutId="emailUnderline"
                            />
                          </div>
                          <ErrorMessage name="email">
                            {(msg) => (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-2 flex items-center"
                              >
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                {msg}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </div>

                        {/* Phone */}
                        <div className="mb-5">
                          <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-200">
                            Phone Number
                          </label>
                          <div className="relative group">
                            <Field name="phone">
                              {({ field }) => (
                                <input
                                  id="phone"
                                  type="tel"
                                  placeholder="Enter your phone number (e.g., 01xxxxxxxxx)"
                                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.phone && touched.phone
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-purple-500/30 focus:border-purple-500/70"
                                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm transition-all duration-300`}
                                  {...field}
                                />
                              )}
                            </Field>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200">
                              <FontAwesomeIcon icon={faPhone} className="text-lg" />
                            </div>
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 w-0 group-focus-within:w-full transition-all duration-300"
                              layoutId="phoneUnderline"
                            />
                          </div>
                          <ErrorMessage name="phone">
                            {(msg) => (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-2 flex items-center"
                              >
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                {msg}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </div>

                        {/* Password */}
                        <div className="mb-5">
                          <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-200">
                            Password
                          </label>
                          <div className="relative group">
                            <Field name="password">
                              {({ field }) => (
                                <input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a password"
                                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${errors.password && touched.password
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-purple-500/30 focus:border-purple-500/70"
                                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm transition-all duration-300`}
                                  {...field}
                                />
                              )}
                            </Field>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200">
                              <FontAwesomeIcon icon={faLock} className="text-lg" />
                            </div>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-lg" />
                              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                            </motion.button>
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 w-0 group-focus-within:w-full transition-all duration-300"
                              layoutId="passwordUnderline"
                            />
                          </div>
                          <ErrorMessage name="password">
                            {(msg) => (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-2 flex items-center"
                              >
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                {msg}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </div>

                        {/* Gender */}
                        <div className="mb-5">
                          <label htmlFor="gender" className="block text-sm font-medium mb-2 text-gray-200">
                            Gender
                          </label>
                          <div className="relative group">
                            <Field name="gender">
                              {({ field }) => (
                                <select
                                  id="gender"
                                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.gender && touched.gender
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-purple-500/30 focus:border-purple-500/70"
                                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm transition-all duration-300 appearance-none`}
                                  {...field}
                                >
                                  <option value="" className="bg-gray-800">
                                    Select your gender
                                  </option>
                                  <option value="M" className="bg-gray-800">
                                    Male
                                  </option>
                                  <option value="F" className="bg-gray-800">
                                    Female
                                  </option>
                                </select>
                              )}
                            </Field>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-200">
                              <FontAwesomeIcon icon={faVenusMars} className="text-lg" />
                            </div>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none">
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </div>
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 w-0 group-focus-within:w-full transition-all duration-300"
                              layoutId="genderUnderline"
                            />
                          </div>
                          <ErrorMessage name="gender">
                            {(msg) => (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-2 flex items-center"
                              >
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                {msg}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants} className="px-6 pb-6 flex justify-between">
                    {currentStep > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="py-3 px-6 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-xl text-sm font-medium transition-all duration-300"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Back
                      </motion.button>
                    )}

                    {currentStep < totalSteps ? (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-purple-700/20 ml-auto"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Next
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-purple-700/20 ml-auto flex items-center ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                          }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="mr-2"
                            >
                              <FontAwesomeIcon icon={faCircleNotch} />
                            </motion.div>
                            Processing...
                          </>
                        ) : (
                          "Register"
                        )}
                      </motion.button>
                    )}
                  </motion.div>

                  <div className="px-6 pb-6">
                    <p className="text-sm text-center text-gray-300">
                      Already have an account?{" "}
                      <motion.a
                        href="/login"
                        className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Sign in
                      </motion.a>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Register

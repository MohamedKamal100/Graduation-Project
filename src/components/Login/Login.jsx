
// import { useState, useEffect, useContext } from "react"
// import { Formik, Form, Field, ErrorMessage } from "formik"
// import * as Yup from "yup"
// import { ClipLoader } from "react-spinners"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faEye, faEyeSlash, faCheck, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons"
// import { UserContext } from "../../context/UserContext"

// // Login Validation schema
// const LoginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email address").required("Email is required"),
//   password: Yup.string().required("Password is required"),
// })

// const Login = () => {
//   const navigate = useNavigate()
//   const [showPassword, setShowPassword] = useState(false)
//   const [apiError, setApiError] = useState(null)
//   const [loginSuccess, setLoginSuccess] = useState(false)
//   const [currentDateTime, setCurrentDateTime] = useState(new Date())
//   const { handleLogin } = useContext(UserContext)

//   // Update the date and time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDateTime(new Date())
//     }, 1000)

//     // Clean up the interval on component unmount
//     return () => clearInterval(timer)
//   }, [])

//   // API endpoint for login
//   const API_URL = "http://127.0.0.1:8000/api/login"

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       setApiError(null)

//       const response = await axios.post(API_URL, values, {
//         headers: { "Content-Type": "application/json" },
//       })

//       console.log("Login successful:", response.data)

//       if (response?.data?.data?.token && response?.data?.data?.user) {
//         // Use the new handleLogin function from context
//         handleLogin(response.data.data.token, response.data.data.user)

//         setLoginSuccess(true)

//         setTimeout(() => {
//           navigate(response.data.data.user.role === "admin" ? "/dashboard" : "/home")
//         }, 1500)
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       if (error.response) {
//         setApiError(error.response.data.message || `Error: ${error.response.status} - ${error.response.statusText}`)
//       } else if (error.request) {
//         setApiError("No response received from server. Please try again later.")
//       } else {
//         setApiError(error.message || "An error occurred during login")
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="min-h-screen relative font-sans">
//       {/* Full-screen fixed background image */}
//       <div className="fixed inset-0 z-0">
//         <img
//           src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
//           alt="Events background"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/70"></div>
//       </div>

//       {/* Content overlay */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
//         <div className="w-full max-w-md bg-white/70 rounded-lg shadow-xl backdrop-blur-md border border-white/20">
//           <div className="p-6 text-center">
//             <h1 className="text-2xl font-bold mb-2 text-gray-900">Welcome Back</h1>
//             <p className="text-sm text-gray-600 mb-4">Sign in to your account to continue</p>
//           </div>

//           {loginSuccess ? (
//             <div className="px-6 py-8 text-center">
//               <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-100/80 text-green-600 rounded-full mb-4 backdrop-blur-sm">
//                 <FontAwesomeIcon icon={faCheck} className="text-xl" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Successful!</h2>
//               <p className="text-gray-700 mb-6">You are being redirected to the home page...</p>
//               <div className="flex justify-center">
//                 <ClipLoader size={24} color="#6d28d9" />
//               </div>
//             </div>
//           ) : (
//             <Formik
//               initialValues={{
//                 email: "",
//                 password: "",
//               }}
//               validationSchema={LoginSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched, isSubmitting }) => (
//                 <Form>
//                   {apiError && (
//                     <div className="mx-6 mb-4 p-3 bg-red-100/80 border border-red-200 text-red-700 text-sm rounded-md backdrop-blur-sm">
//                       {apiError}
//                     </div>
//                   )}

//                   <div className="px-6 pb-2 text-start font-semibold ">
//                     <div className="mb-5">
//                       <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800">
//                         Email
//                       </label>
//                       <div className="relative">
//                         <Field name="email">
//                           {({ field }) => (
//                             <input
//                               id="email"
//                               type="email"
//                               placeholder="Enter your email"
//                               className={`w-full pl-9 pr-3 py-2 rounded-md border ${errors.email && touched.email ? "border-red-500" : "border-white/30"
//                                 } text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
//                               {...field}
//                             />
//                           )}
//                         </Field>
//                         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
//                           <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
//                         </div>
//                       </div>
//                       <ErrorMessage name="email">
//                         {(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}
//                       </ErrorMessage>
//                     </div>

//                     <div className="mb-5">
//                       <div className="flex items-center justify-between mb-2">
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-800">
//                           Password
//                         </label>
//                         <a href="/forgot-password" className="text-xs text-purple-700 hover:underline">
//                           Forgot password?
//                         </a>
//                       </div>
//                       <div className="relative">
//                         <Field name="password">
//                           {({ field }) => (
//                             <input
//                               id="password"
//                               type={showPassword ? "text" : "password"}
//                               placeholder="Enter your password"
//                               className={`w-full pl-9 pr-10 py-2 rounded-md border ${errors.password && touched.password ? "border-red-500" : "border-white/30"
//                                 } text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
//                               {...field}
//                             />
//                           )}
//                         </Field>
//                         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
//                           <FontAwesomeIcon icon={faLock} className="text-sm" />
//                         </div>
//                         <button
//                           type="button"
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
//                           onClick={() => setShowPassword(!showPassword)}
//                         >
//                           <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
//                           <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
//                         </button>
//                       </div>
//                       <ErrorMessage name="password">
//                         {(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}
//                       </ErrorMessage>
//                     </div>
//                   </div>

//                   <div className="px-6 pb-6">
//                     <button
//                       type="submit"
//                       className={`w-full py-2 px-4 bg-purple-700/90 text-white rounded-md text-sm font-medium transition-colors mb-4 flex items-center justify-center backdrop-blur-sm ${isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:bg-purple-800"
//                         }`}
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <ClipLoader size={16} color="#ffffff" className="mr-2" />
//                           Signing in...
//                         </>
//                       ) : (
//                         "Sign in"
//                       )}
//                     </button>
//                     <p className="text-sm text-center text-gray-700">
//                       Don't have an account?{" "}
//                       <a href="/register" className="text-purple-700 hover:underline">
//                         Register now
//                       </a>
//                     </p>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login

"use client"

import { useState, useEffect, useContext } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEye,
  faEyeSlash,
  faCheck,
  faLock,
  faEnvelope,
  faCircleNotch,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { UserContext } from "../../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"

// Login Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const { handleLogin } = useContext(UserContext)

  // Update the date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    // Clean up the interval on component unmount
    return () => clearInterval(timer)
  }, [])

  // API endpoint for login
  const API_URL = "http://127.0.0.1:8000/api/login"

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setApiError(null)

      const response = await axios.post(API_URL, values, {
        headers: { "Content-Type": "application/json" },
      })

      console.log("Login successful:", response.data)

      if (response?.data?.data?.token && response?.data?.data?.user) {
        // Use the new handleLogin function from context
        handleLogin(response.data.data.token, response.data.data.user)

        setLoginSuccess(true)

        setTimeout(() => {
          navigate(response.data.data.user.role === "admin" ? "/dashboard" : "/home")
        }, 1500)
      }
    } catch (error) {
      console.error("Login error:", error)
      if (error.response) {
        setApiError(error.response.data.message || `Error: ${error.response.status} - ${error.response.statusText}`)
      } else if (error.request) {
        setApiError("No response received from server. Please try again later.")
      } else {
        setApiError(error.message || "An error occurred during login")
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

  const backgroundImages = [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
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
    <div className="min-h-screen relative font-sans overflow-hidden">
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
          <motion.div variants={itemVariants} className="p-6 text-center">
            <motion.div
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <FontAwesomeIcon icon={faLock} className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
            <p className="text-sm text-gray-200 mb-4">Sign in to your account to continue</p>
          </motion.div>

          {loginSuccess ? (
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
              <h2 className="text-2xl font-semibold text-white mb-2">Login Successful!</h2>
              <p className="text-gray-300 mb-6">You are being redirected to the home page...</p>
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <FontAwesomeIcon icon={faCircleNotch} className="text-purple-400 text-2xl" />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
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

                  <motion.div variants={itemVariants} className="px-6 pb-2 text-start font-semibold">
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

                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                          Password
                        </label>
                        <motion.a
                          href="/forgot-password"
                          className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Forgot password?
                        </motion.a>
                      </div>
                      <div className="relative group">
                        <Field name="password">
                          {({ field }) => (
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
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
                  </motion.div>

                  <motion.div variants={itemVariants} className="px-6 pb-6">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-300 mb-4 flex items-center justify-center shadow-lg shadow-purple-700/20 ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""
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
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </motion.button>
                    <p className="text-sm text-center text-gray-300">
                      Don't have an account?{" "}
                      <motion.a
                        href="/register"
                        className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Register now
                      </motion.a>
                    </p>
                  </motion.div>
                </Form>
              )}
            </Formik>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Login

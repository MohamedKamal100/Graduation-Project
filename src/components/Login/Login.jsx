

// import { useState, useEffect, useContext } from "react"
// import { Formik, Form, Field, ErrorMessage } from "formik"
// import * as Yup from "yup"
// import { ClipLoader } from "react-spinners"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faCalendarDays,
//   faEye,
//   faEyeSlash,
//   faCheck,
//   faClock,
//   faLock,
//   faEnvelope,
// } from "@fortawesome/free-solid-svg-icons"
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
//   let { userLogin, setUserLogin } = useContext(UserContext)
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

//       if (response?.data?.data?.token && response?.data?.data?.user?.role) {
//         localStorage.setItem("token", response.data.data.token)
//         localStorage.setItem("role", response.data.data.user.role)
//         setUserLogin(response.data.data.token)

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
//                               className={`w-full pl-9 pr-3 py-2 rounded-md border ${errors.email && touched.email ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
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
//                               className={`w-full pl-9 pr-10 py-2 rounded-md border ${errors.password && touched.password ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
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
//                       className={`w-full py-2 px-4 bg-purple-700/90 text-white rounded-md text-sm font-medium transition-colors mb-4 flex items-center justify-center backdrop-blur-sm ${isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:bg-purple-800"}`}
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
import { ClipLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faCheck, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { UserContext } from "../../context/UserContext"

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

  return (
    <div className="min-h-screen relative font-sans">
      {/* Full-screen fixed background image */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
          alt="Events background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/70"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/70 rounded-lg shadow-xl backdrop-blur-md border border-white/20">
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-600 mb-4">Sign in to your account to continue</p>
          </div>

          {loginSuccess ? (
            <div className="px-6 py-8 text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-100/80 text-green-600 rounded-full mb-4 backdrop-blur-sm">
                <FontAwesomeIcon icon={faCheck} className="text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Successful!</h2>
              <p className="text-gray-700 mb-6">You are being redirected to the home page...</p>
              <div className="flex justify-center">
                <ClipLoader size={24} color="#6d28d9" />
              </div>
            </div>
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
                  {apiError && (
                    <div className="mx-6 mb-4 p-3 bg-red-100/80 border border-red-200 text-red-700 text-sm rounded-md backdrop-blur-sm">
                      {apiError}
                    </div>
                  )}

                  <div className="px-6 pb-2 text-start font-semibold ">
                    <div className="mb-5">
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800">
                        Email
                      </label>
                      <div className="relative">
                        <Field name="email">
                          {({ field }) => (
                            <input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              className={`w-full pl-9 pr-3 py-2 rounded-md border ${errors.email && touched.email ? "border-red-500" : "border-white/30"
                                } text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                              {...field}
                            />
                          )}
                        </Field>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                          <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                        </div>
                      </div>
                      <ErrorMessage name="email">
                        {(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}
                      </ErrorMessage>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                          Password
                        </label>
                        <a href="/forgot-password" className="text-xs text-purple-700 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Field name="password">
                          {({ field }) => (
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className={`w-full pl-9 pr-10 py-2 rounded-md border ${errors.password && touched.password ? "border-red-500" : "border-white/30"
                                } text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                              {...field}
                            />
                          )}
                        </Field>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                          <FontAwesomeIcon icon={faLock} className="text-sm" />
                        </div>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </button>
                      </div>
                      <ErrorMessage name="password">
                        {(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      type="submit"
                      className={`w-full py-2 px-4 bg-purple-700/90 text-white rounded-md text-sm font-medium transition-colors mb-4 flex items-center justify-center backdrop-blur-sm ${isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:bg-purple-800"
                        }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <ClipLoader size={16} color="#ffffff" className="mr-2" />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                    <p className="text-sm text-center text-gray-700">
                      Don't have an account?{" "}
                      <a href="/register" className="text-purple-700 hover:underline">
                        Register now
                      </a>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login


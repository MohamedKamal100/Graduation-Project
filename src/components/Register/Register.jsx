"use client"

import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { ClipLoader } from "react-spinners"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDays, faEye, faEyeSlash, faCheck, faClock, faPhone, faLock } from "@fortawesome/free-solid-svg-icons"


const RegisterSchema = Yup.object().shape({
  fname: Yup.string().min(2, "First name is too short").max(50, "First name is too long").required("First name is required"),
  lname: Yup.string().min(2, "Last name is too short").max(50, "Last name is too long").required("Last name is required"),
  username: Yup.string().min(4, "Username is too short").max(50, "Username is too long").required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  phone: Yup.string().matches(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number").required("Phone number is required"),
  gender: Yup.string().oneOf(["M", "F"], "Please select a valid gender").required("Gender is required"),
});
const Register = () => {
  const [showPassword, setShowPassword] = useState(false)

  const [apiError, setApiError] = useState(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)



  // API endpoint for registration - Using the provided API
  const API_URL = "http://127.0.0.1:8000/api/register";
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setApiError(null);
      console.log("📤 Sending data:", values);

      const response = await axios.post(API_URL, values, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("✅ Response:", response.data);

      if (response.data?.status === 201 && response.data?.message === "success") {
        setRegistrationSuccess(true);
        resetForm();
      } else {
        setApiError("Registration failed, please try again.");
      }
    } catch (error) {
      console.error("❌ Server Error:", error.response?.data || error.message);

      // استخراج الأخطاء من API
      if (error.response?.status === 422) {
        const errorData = error.response?.data?.data || {};
        let errorMessages = [];

        Object.keys(errorData).forEach((field) => {
          errorMessages.push(`${field}: ${errorData[field].join(" ")}`);
        });

        setApiError(errorMessages.join("\n"));
      } else {
        setApiError(error.response?.data?.message || "An error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };




  return (
    <div className="min-h-screen py-10 relative font-sans">
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
        <div className="w-full max-w-md bg-white/70 rounded-lg shadow-xl backdrop-blur-md border border-white/20  py-10">

          {registrationSuccess ? (
            <div className="px-6 py-8 text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-100/80 text-green-600 rounded-full mb-4 backdrop-blur-sm">
                <FontAwesomeIcon icon={faCheck} className="text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-700 mb-6">Your account has been created successfully.</p>
              <a
                href="/login"
                className="block w-full py-2 px-4 bg-purple-700/90 text-white rounded-md text-sm font-medium transition-colors hover:bg-purple-800"
              >
                Proceed to Login
              </a>
            </div>
          ) : (
            <Formik
              initialValues={{
                fname: "",
                lname: "",
                username: "",
                phone: "",
                email: "",
                password: "",
                gender: "M",
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (

                <Form>
                  {apiError && (
                    <div className="mx-6 mb-4 p-3 bg-red-100/80 border border-red-200 text-red-700 text-sm rounded-md backdrop-blur-sm">
                      {apiError}
                    </div>
                  )}

                  <div className="px-6 text-start font-medium pb-2">
                    {/* First Name */}
                    <div className="mb-5">
                      <label htmlFor="fname" className="block text-sm font-medium mb-2 text-gray-800">
                        First Name
                      </label>
                      <Field name="fname">
                        {({ field }) => (
                          <input
                            id="fname"
                            type="text"
                            placeholder="Enter your first name"
                            className={`w-full px-3 py-2 rounded-md border ${errors.fname && touched.fname ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                            {...field}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="fname">{(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}</ErrorMessage>
                    </div>

                    {/* Last Name */}
                    <div className="mb-5">
                      <label htmlFor="lname" className="block text-sm font-medium mb-2 text-gray-800">
                        Last Name
                      </label>
                      <Field name="lname">
                        {({ field }) => (
                          <input
                            id="lname"
                            type="text"
                            placeholder="Enter your last name"
                            className={`w-full px-3 py-2 rounded-md border ${errors.lname && touched.lname ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                            {...field}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="lname">{(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}</ErrorMessage>
                    </div>

                    {/* Username */}
                    <div className="mb-5">
                      <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-800">
                        Username
                      </label>
                      <Field name="username">
                        {({ field }) => (
                          <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            className={`w-full px-3 py-2 rounded-md border ${errors.username && touched.username ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                            {...field}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="username">{(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}</ErrorMessage>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800">
                        Email
                      </label>
                      <Field name="email">
                        {({ field }) => (
                          <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className={`w-full px-3 py-2 rounded-md border ${errors.email && touched.email ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                            {...field}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="email">
                        {(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}
                      </ErrorMessage>
                    </div>

                    {/* New Phone Field */}
                    <div className="mb-5">
                      <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-800">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Field name="phone">
                          {({ field }) => (
                            <input
                              id="phone"
                              type="tel"
                              placeholder="Enter your phone number (e.g., 01xxxxxxxxx)"
                              className={`w-full pl-9 pr-3 py-2 rounded-md border ${errors.phone && touched.phone ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                              {...field}
                            />
                          )}
                        </Field>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                          <FontAwesomeIcon icon={faPhone} className="text-sm" />
                        </div>
                      </div>
                      <ErrorMessage name="phone">
                        {(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}
                      </ErrorMessage>
                    </div>
                    {/* Gender */}
                    <div className="mb-5">
                      <label htmlFor="gender" className="block text-sm font-medium mb-2 text-gray-800">
                        Gender
                      </label>
                      <Field as="select" name="gender">
                        {({ field }) => (
                          <select
                            id="gender"
                            className={`w-full px-3 py-2 rounded-md border ${errors.gender && touched.gender ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                            {...field}
                          >
                            <option value="" label="Select your gender" />
                            <option value="M" label="Male" />
                            <option value="F" label="Female" />
                          </select>
                        )}
                      </Field>
                      <ErrorMessage name="gender">{(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}</ErrorMessage>
                    </div>
                    <div className="mb-5">
                      <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-800">
                        Password
                      </label>
                      <div className="relative">
                        <Field name="password">
                          {({ field }) => (
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className={`w-full pl-9 pr-10 py-2 rounded-md border ${errors.password && touched.password ? "border-red-500" : "border-white/30"} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm`}
                              {...field}
                            />
                          )}
                        </Field>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                          <FontAwesomeIcon icon={faLock} className="text-sm" />
                        </div>
                        {/* <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </button> */}
                      </div>
                      <ErrorMessage name="password">
                        {(msg) => <div className="text-red-600 text-xs mt-1">{msg}</div>}
                      </ErrorMessage>
                    </div>


                  </div>

                  <div className="px-6 pb-6">
                    <button
                      type="submit"
                      className={`w-full py-2 px-4 bg-purple-700/90 text-white rounded-md text-sm font-medium transition-colors mb-4 flex items-center justify-center backdrop-blur-sm ${isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:bg-purple-800"}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <ClipLoader size={16} color="#ffffff" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Register"
                      )}
                    </button>
                    <p className="text-sm text-center text-gray-700">
                      Already have an account?{" "}
                      <a href="/login" className="text-purple-700 hover:underline">
                        Sign in
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

export default Register


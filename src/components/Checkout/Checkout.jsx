"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTicketAlt,
  faUser,
  faEnvelope,
  faPhone,
  faIdCard,
  faCreditCard,
  faSpinner,
  faArrowLeft,
  faCalendarAlt,
  faMapMarkerAlt,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faTag,
  faMinus,
  faPlus,
  faShield,
  faInfoCircle,
  faShoppingCart,
  faLock,
} from "@fortawesome/free-solid-svg-icons"
import { useEvents } from "../../context/EventsContext"
import { useToast } from "../../context/ToastContext"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import styles from "./checkout.module.css"

// Add this after the imports
// Add a style tag for the price highlight animation
const priceHighlightStyle = `
@keyframes priceHighlight {
  0% { background-color: rgba(99, 102, 241, 0); }
  50% { background-color: rgba(99, 102, 241, 0.2); }
  100% { background-color: rgba(99, 102, 241, 0); }
}
.price-update-highlight {
  animation: priceHighlight 0.7s ease-in-out;
  border-radius: 0.375rem;
}
`

// Use the provided Stripe publishable key
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51REozIR8mYpvT1Bnu6uEyznJ6mSxZMWfcYzQAm3dwYlbSncfLmVSDbLqNkiFeSArUjdVQHPdZDebUR2Z28DlH8tb00eEIuFLWU"

// Initialize Stripe with the provided key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

// Payment Form Component
const PaymentForm = ({ eventDetails, quantity, totalPrice, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const toast = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [errors, setErrors] = useState({})
  const [paymentError, setPaymentError] = useState("")
  const [cardComplete, setCardComplete] = useState(false)

  // Add this at the beginning of the PaymentForm component
  if (!stripe) {
    return (
      <div
        className={`p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 ${styles.fadeInUp}`}
      >
        <div className="flex items-start">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={`text-yellow-600 dark:text-yellow-400 mt-1 mr-3 ${styles.warningAccent}`}
          />
          <div>
            <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Stripe Not Configured</h4>
            <p className="text-yellow-700 dark:text-yellow-400 mb-4">
              Stripe is not properly configured. In a production environment, you would need to:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-yellow-700 dark:text-yellow-400">
              <li>Create a Stripe account</li>
              <li>Get your publishable key from the Stripe dashboard</li>
              <li>Add it to your environment variables</li>
            </ol>
            <div className="mt-4">
              <button
                onClick={onCancel}
                className={`${styles.secondaryButton} px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors`}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!cardComplete) newErrors.card = "Please complete card details"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.")
      return
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    setPaymentError("")

    try {
      // 1. Create a token with Stripe
      const cardElement = elements.getElement(CardElement)
      const { token, error } = await stripe.createToken(cardElement)

      if (error) {
        throw new Error(error.message)
      }

      // 2. Send the token to your backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/charge",
        {
          event_id: eventDetails.id,
          nu_of_tickets: quantity,
          payment_method: "stripe",
          payment_status: "pending",
          token: token.id, // Use the token ID from Stripe
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.message === "success") {
        // 3. Create ticket in your system
        await axios.post(
          "http://127.0.0.1:8000/api/tickets",
          {
            user_id: localStorage.getItem("userId"),
            event_id: eventDetails.id,
            quantity: quantity,
            price: eventDetails.price,
            type: "regular",
            status: "booked",
            payment_id: response.data.charge.id,
            customer_details: formData,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        )

        toast.success("Payment successful! Your tickets have been booked.")
        onSuccess(response.data.charge.id)
      } else {
        throw new Error("Payment processing failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentError(error.message || "An error occurred during payment processing")
      toast.error("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className={`space-y-6 ${styles.fadeInUp}`}
    >
      <div className="space-y-4">
        <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center ${styles.gradientText}`}>
          <FontAwesomeIcon icon={faUser} className={`mr-3 ${styles.primaryAccent}`} />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className={styles.inputGroup}>
              <label
                htmlFor="name"
                className={`${styles.inputLabel} ${window.document.documentElement.classList.contains("dark") ? styles.darkInputLabel : ""}`}
              >
                Full Name
              </label>
              <div className="relative group">

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.enhancedFormControl} pl-12  block w-full ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700`}
                  placeholder="  Please enter your full name"
                />
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <div className={styles.inputGroup}>
              <label
                htmlFor="email"
                className={`${styles.inputLabel} ${window.document.documentElement.classList.contains("dark") ? styles.darkInputLabel : ""}`}
              >
                Email Address
              </label>
              <div className="relative group">

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.enhancedFormControl}  pl-12  block w-full ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700`}
                  placeholder="   Please enter your email address"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <div className={styles.inputGroup}>
              <label
                htmlFor="phone"
                className={`${styles.inputLabel} ${window.document.documentElement.classList.contains("dark") ? styles.darkInputLabel : ""}`}
              >
                Phone Number
              </label>
              <div className="relative group">

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`${styles.enhancedFormControl} pl-12  block w-full ${errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700`}
                  placeholder="  Please enter your phone number"
                />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <div className={styles.inputGroup}>
              <label
                htmlFor="address"
                className={`${styles.inputLabel} ${window.document.documentElement.classList.contains("dark") ? styles.darkInputLabel : ""}`}
              >
                Address
              </label>
              <div className="relative group">

                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`${styles.enhancedFormControl} pl-12  block w-full ${errors.address ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700`}
                  placeholder="  Please enter your address"
                />
              </div>
              {errors.address && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.address}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center ${styles.gradientText}`}>
          <FontAwesomeIcon icon={faCreditCard} className={`mr-3 ${styles.primaryAccent}`} />
          Payment Information
        </h3>

        <div className={`${styles.cardBackground} bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-4`}>
          <div className="flex items-start">
            <FontAwesomeIcon
              icon={faLock}
              className={`text-indigo-600 dark:text-indigo-400 mt-1 mr-3 ${styles.primaryAccent}`}
            />
            <div>
              <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-1">Test Card Information</h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-400">
                Use card number: 4242 4242 4242 4242, any future date, any 3 digits for CVC, and any 5 digits for postal
                code.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="card" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Card Details
          </label>
          <div
            className={`${styles.enhancedCardElement} p-4 border ${errors.card ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-md bg-white dark:bg-gray-800 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-50`}
          >
            <CardElement
              id="card"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                    iconColor: "#6366f1",
                  },
                  invalid: {
                    color: "#ef4444",
                    iconColor: "#ef4444",
                  },
                },
              }}
              onChange={(e) => setCardComplete(e.complete)}
            />
          </div>
          {errors.card && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.card}
            </motion.p>
          )}
          {paymentError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-1 text-sm text-red-600"
            >
              {paymentError}
            </motion.p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className={`${styles.secondaryComfortableButton} ${styles.comfortableButton} inline-flex items-center px-5 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!stripe || loading}
          className={`${styles.primaryComfortableButton} ${styles.comfortableButton} inline-flex items-center px-5 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Processing...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
              Pay ${totalPrice.toFixed(2)}
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}

// Main Checkout Component
const Checkout = () => {
  const { state } = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEventById } = useEvents()
  const toast = useToast()
  const [event, setEvent] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [step, setStep] = useState("details") // "details", "payment", "confirmation"
  const [paymentId, setPaymentId] = useState(null)
  const [isChangingQuantity, setIsChangingQuantity] = useState(false)
  const [priceHighlightStyleAdded, setPriceHighlightStyleAdded] = useState(false)

  // Calculate total price with proper type checking
  const calculateTotalPrice = (event, quantity = 1) => {
    if (!event) return 0

    // Handle different price formats (string or number)
    let price = 0
    if (typeof event.price === "number") {
      price = event.price
    } else if (typeof event.price === "string" && !isNaN(Number.parseFloat(event.price))) {
      price = Number.parseFloat(event.price)
    } else if (event.price) {
      // Try to extract a number from the price if it's in a format like "$25.99"
      const priceMatch = event.price.toString().match(/\d+(\.\d+)?/)
      if (priceMatch) {
        price = Number.parseFloat(priceMatch[0])
      }
    }

    // Ensure quantity is a valid number
    const validQuantity = typeof quantity === "number" && quantity > 0 ? quantity : 1

    return price * validQuantity
  }

  const loadEventData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // If we have state from navigation, use it
      if (state && state.event) {
        setEvent(state.event)
        if (state.quantity) setQuantity(state.quantity)
      } else {
        // Otherwise get event from context
        const eventData = getEventById(id)
        if (eventData) {
          setEvent(eventData)
        } else {
          setError("Event not found")
        }
      }
    } catch (err) {
      console.error("Error loading event:", err)
      setError("Failed to load event details")
    } finally {
      setLoading(false)
    }
  }, [id, getEventById, state])

  useEffect(() => {
    loadEventData()
  }, [loadEventData])

  // Add style tag to the DOM
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = priceHighlightStyle
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, []) // Empty dependency array so it only runs once

  const { totalPrice, serviceFee, finalTotal } = useMemo(() => {
    const calculatedPrice = event ? calculateTotalPrice(event, quantity) : 0
    const calculatedFee = calculatedPrice * 0.05 // 5% service fee
    return {
      totalPrice: calculatedPrice,
      serviceFee: calculatedFee,
      finalTotal: calculatedPrice + calculatedFee,
    }
  }, [event, quantity])

  const handleQuantityChange = (newQuantity) => {
    setIsChangingQuantity(true)
    if (newQuantity < 1) newQuantity = 1
    if (event && event.available_tickets && newQuantity > event.available_tickets) {
      newQuantity = event.available_tickets
      toast.warning(`Maximum available tickets: ${event.available_tickets}`)
    }
    setTimeout(() => {
      setQuantity(newQuantity)
      // Add a subtle highlight effect to the price
      const priceElement = document.getElementById("total-price")
      if (priceElement) {
        priceElement.classList.add("price-update-highlight")
        setTimeout(() => {
          priceElement.classList.remove("price-update-highlight")
        }, 700)
      }
      setIsChangingQuantity(false)
    }, 150)
  }

  const handlePaymentSuccess = (paymentIntentId) => {
    setPaymentId(paymentIntentId)
    setStep("confirmation")
  }

  const handleBackToEvent = () => {
    navigate(`/eventDetails/${event.id}`)
  }

  const handleViewTickets = () => {
    navigate("/tickets")
  }

  if (loading) {
    return (
      <div
        className={`${styles.gradientBackground} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 relative ${styles.rotatingLoader}`}>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Loading your checkout experience...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div
        className={`${styles.gradientBackground} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center py-12 ${styles.fadeInUp}`}
          >
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className={`text-yellow-500 text-3xl ${styles.warningAccent}`}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Event Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
              {error ||
                "The event you're looking for could not be found. It may have been removed or the link is incorrect."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/events")}
              className={`${styles.primaryButton} px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center`}
            >
              Browse Events
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${styles.softGradientBackground} ${window.document.documentElement.classList.contains("dark") ? styles.darkSoftGradientBackground : ""} min-h-screen py-12`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mb-8 ${styles.fadeInDown}`}
        >
          <h2
            className={`text-3xl pt-20 font-bold text-gray-900 dark:text-white mb-6 flex items-center ${styles.gradientText}`}
          >
            <div
              className={`w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mr-4 ${styles.floating}`}
            >
              <FontAwesomeIcon
                icon={faTicketAlt}
                className={`text-indigo-600 dark:text-indigo-400 text-xl ${styles.primaryAccent}`}
              />
            </div>
            {step === "confirmation" ? "Booking Confirmation" : "Secure Checkout"}
          </h2>

          {step !== "confirmation" && (
            <div className={`flex items-center justify-center md:justify-start ${styles.stepIndicator}`}>
              <div className={`flex flex-col md:flex-row items-center`}>
                <div
                  className={`${styles.stepCircle} ${step === "details"
                    ? styles.stepActive
                    : step === "payment" || step === "confirmation"
                      ? styles.stepCompleted
                      : styles.stepInactive
                    }`}
                >
                  {step === "payment" || step === "confirmation" ? "✓" : "1"}
                </div>
                <span className="ml-2 font-medium mt-1 md:mt-0">Event Details</span>
              </div>

              <div
                className={`hidden md:block h-1 w-16 mx-3 ${step === "payment" || step === "confirmation" ? styles.stepConnectorCompleted : styles.stepConnector
                  }`}
              ></div>
              <div
                className={`md:hidden h-12 w-1 mx-3 my-1 ${step === "payment" || step === "confirmation" ? styles.stepConnectorCompleted : styles.stepConnector
                  }`}
              ></div>

              <div className={`flex flex-col md:flex-row items-center`}>
                <div
                  className={`${styles.stepCircle} ${step === "payment"
                    ? styles.stepActive
                    : step === "confirmation"
                      ? styles.stepCompleted
                      : styles.stepInactive
                    }`}
                >
                  {step === "confirmation" ? "✓" : "2"}
                </div>
                <span className="ml-2 font-medium mt-1 md:mt-0">Payment</span>
              </div>

              <div
                className={`hidden md:block h-1 w-16 mx-3 ${step === "confirmation" ? styles.stepConnectorCompleted : styles.stepConnector
                  }`}
              ></div>
              <div
                className={`md:hidden h-12 w-1 mx-3 my-1 ${step === "confirmation" ? styles.stepConnectorCompleted : styles.stepConnector
                  }`}
              ></div>

              <div className={`flex flex-col md:flex-row items-center`}>
                <div
                  className={`${styles.stepCircle} ${step === "confirmation" ? styles.stepActive : styles.stepInactive
                    }`}
                >
                  3
                </div>
                <span className="ml-2 font-medium mt-1 md:mt-0">Confirmation</span>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`${window.document.documentElement.classList.contains("dark") ? styles.darkCardBackground : styles.cardBackground} bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden ${styles.card3d}`}
            >
              {step === "details" && (
                <div>
                  <div
                    className={`relative h-48 md:h-64 overflow-hidden ${styles.imageContainer} ${styles.imageShine}`}
                  >
                    <img
                      src={event.image_path || event.image || "/placeholder.svg?height=400&width=800"}
                      alt={event.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent ${styles.imageOverlay}`}
                    ></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      {event.category && (
                        <span className="inline-block bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded mb-2">
                          {event.category}
                        </span>
                      )}
                      <h3 className={`text-2xl font-bold text-white ${styles.gradientText}`}>{event.name}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 ${styles.gradientText}`}>
                      Event Details
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="md:w-2/3">
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{event.description}</p>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 ${styles.staggeredFadeIn}`}>
                          <div
                            className={`flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg ${styles.hoverLift}`}
                          >
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className={`w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                            />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</h4>
                              <p className="text-gray-900 dark:text-white font-medium">{event.date}</p>
                            </div>
                          </div>
                          <div
                            className={`flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg ${styles.hoverLift}`}
                          >
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className={`w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                            />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</h4>
                              <p className="text-gray-900 dark:text-white font-medium">{event.location}</p>
                            </div>
                          </div>
                          <div
                            className={`flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg ${styles.hoverLift}`}
                          >
                            <FontAwesomeIcon
                              icon={faClock}
                              className={`w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                            />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</h4>
                              <p className="text-gray-900 dark:text-white font-medium">3 hours</p>
                            </div>
                          </div>
                          <div
                            className={`flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg ${styles.hoverLift}`}
                          >
                            <FontAwesomeIcon
                              icon={faTag}
                              className={`w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                            />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</h4>
                              <p className="text-gray-900 dark:text-white font-medium">
                                {typeof event.price === "number" ? `$${event.price.toFixed(2)}` : "Free"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3
                        className={`text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center ${styles.gradientText}`}
                      >
                        <FontAwesomeIcon
                          icon={faTicketAlt}
                          className={`mr-3 text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                        />
                        Ticket Information
                      </h3>

                      <div className="mb-6">
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Number of Tickets
                        </label>
                        <div className="flex items-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className={`${styles.secondaryButton} p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-l-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 disabled:opacity-50 transition-colors duration-200`}
                          >
                            <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                          </motion.button>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={quantity}
                              initial={isChangingQuantity ? { opacity: 0, y: -10 } : false}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="w-16 text-center p-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl font-bold"
                            >
                              {quantity}
                            </motion.div>
                          </AnimatePresence>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= event.available_tickets}
                            className={`${styles.secondaryButton} p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-r-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 disabled:opacity-50 transition-colors duration-200`}
                          >
                            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className={`mr-2 text-indigo-500 ${styles.primaryAccent}`}
                          />
                          {event.available_tickets} tickets available
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleBackToEvent}
                          className={`${styles.secondaryButton} inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                        >
                          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                          Back to Event
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep("payment")}
                          className={`${styles.primaryButton} inline-flex items-center justify-center px-5 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                        >
                          Continue to Payment
                          <FontAwesomeIcon icon={faCreditCard} className="ml-2" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="p-6">
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      eventDetails={event}
                      quantity={quantity}
                      totalPrice={finalTotal}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setStep("details")}
                    />
                  </Elements>
                </div>
              )}

              {step === "confirmation" && (
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`text-center py-8 ${styles.fadeInUp}`}
                  >
                    <div
                      className={`w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ${styles.successIcon}`}
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={`text-green-500 text-4xl ${styles.successAccent}`}
                      />
                    </div>
                    <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 ${styles.gradientText}`}>
                      Booking Confirmed!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                      Thank you for your purchase. Your tickets have been booked successfully and are ready for use.
                    </p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className={`bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mb-8 text-left max-w-lg mx-auto ${styles.cardBackground}`}
                    >
                      <h4
                        className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center ${styles.gradientText}`}
                      >
                        <FontAwesomeIcon
                          icon={faTicketAlt}
                          className={`mr-3 text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                        />
                        Booking Details
                      </h4>

                      <div className={`space-y-3 ${styles.staggeredFadeIn}`}>
                        <div className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                          <span className="text-gray-600 dark:text-gray-300">Event:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{event.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                          <span className="text-gray-600 dark:text-gray-300">Date:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{event.date}</span>
                        </div>
                        <div className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                          <span className="text-gray-600 dark:text-gray-300">Location:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{event.location}</span>
                        </div>
                        <div className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                          <span className="text-gray-600 dark:text-gray-300">Tickets:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{quantity}</span>
                        </div>
                        <div className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                          <span className="text-gray-600 dark:text-gray-300">Total Paid:</span>
                          <span className="font-medium text-gray-900 dark:text-white">${finalTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Payment ID:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {paymentId ? paymentId.substring(0, 16) + "..." : "N/A"}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleViewTickets}
                        className={`${styles.primaryButton} inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
                      >
                        <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
                        View My Tickets
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/events")}
                        className={`${styles.secondaryButton} inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-md text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
                      >
                        Browse More Events
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`${window.document.documentElement.classList.contains("dark") ? styles.darkOrderSummary : styles.orderSummary} bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sticky top-6 ${styles.fadeInRight}`}
            >
              <h3
                className={`text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center ${styles.gradientText}`}
              >
                <div
                  className={`w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mr-3 ${styles.floating}`}
                >
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className={`text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                  />
                </div>
                Order Summary
              </h3>

              <div className={`space-y-4 mb-6 ${styles.staggeredFadeIn}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`price-${quantity}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`flex justify-between items-center ${styles.summaryRow}`}>
                      <span className="text-gray-600 dark:text-gray-300">Ticket Price:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        $
                        {event && event.price
                          ? typeof event.price === "number"
                            ? event.price.toFixed(2)
                            : Number.parseFloat(event.price).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center mt-2 ${styles.summaryRow}`}>
                      <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{quantity}</span>
                    </div>
                    <div className={`flex justify-between items-center mt-2 ${styles.summaryRow}`}>
                      <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`subtotal-${quantity}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className="font-medium text-gray-900 dark:text-white"
                        >
                          ${typeof totalPrice === "number" ? totalPrice.toFixed(2) : "0.00"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className={`flex justify-between items-center mt-2 ${styles.summaryRow}`}>
                      <span className="text-gray-600 dark:text-gray-300 flex items-center">
                        Service Fee:
                        <span className="group relative ml-1">
                          <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 cursor-help" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            A small fee that helps us maintain the platform and provide customer support.
                          </span>
                        </span>
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`fee-${quantity}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className="font-medium text-gray-900 dark:text-white"
                        >
                          ${typeof serviceFee === "number" ? serviceFee.toFixed(2) : "0.00"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div
                className={`border-t border-gray-200 dark:border-gray-700 pt-4 mb-6 ${styles.summaryTotal} ${window.document.documentElement.classList.contains("dark") ? styles.darkSummaryTotal : ""}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      id="total-price"
                      key={`total-${quantity}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className={`text-xl font-bold text-indigo-600 dark:text-indigo-400 ${styles.totalPrice}`}
                    >
                      ${typeof finalTotal === "number" ? finalTotal.toFixed(2) : "0.00"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className={`${styles.cardBackground} bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6`}>
                <div className="flex items-start">
                  <FontAwesomeIcon
                    icon={faShield}
                    className={`text-indigo-600 dark:text-indigo-400 mt-1 mr-3 ${styles.primaryAccent}`}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-1">Secure Checkout</h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-400">
                      Your payment information is processed securely. We do not store credit card details.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`space-y-4 ${styles.staggeredFadeIn}`}>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Event Information</h4>
                <div
                  className={`flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg ${styles.hoverLift}`}
                >
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className={`w-4 h-4 mr-3 text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                  />
                  <span>{event.date}</span>
                </div>
                <div
                  className={`flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg ${styles.hoverLift}`}
                >
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className={`w-4 h-4 mr-3 text-indigo-600 dark:text-indigo-400 ${styles.primaryAccent}`}
                  />
                  <span>{event.location}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

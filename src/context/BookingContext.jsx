"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useToast } from "./ToastContext"
import { useEvents } from "./EventsContext"

export const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [buttonLoadingStates, setButtonLoadingStates] = useState({})
  const [ticketQuantities, setTicketQuantities] = useState({})
  const toast = useToast()
  const { getEventById } = useEvents()

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }

  // Process payment and create ticket
  const processPayment = async (eventId, quantity, paymentDetails, customerInfo) => {
    setButtonLoadingStates((prev) => ({
      ...prev,
      [`payment-${eventId}`]: true,
    }))

    try {
      setLoading(true)
      // Get user ID from localStorage
      const userId = localStorage.getItem("userId")

      // Get event from context
      const event = getEventById(eventId)

      if (!event) {
        toast.error("Event information not found. Please try again.")
        return { success: false }
      }

      if (event.price === undefined || event.price === null) {
        toast.error("Event price information is missing. Please try again.")
        return { success: false }
      }

      // Simulate payment processing
      // In a real app, you would call your payment API here
      const paymentResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            paymentId: `pay_${Date.now()}`,
            amount: event.price * quantity,
          })
        }, 1500)
      })

      if (!paymentResponse.success) {
        throw new Error("Payment processing failed")
      }

      // Create ticket after successful payment
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tickets",
        {
          event_id: eventId,
          quantity,
          user_id: userId,
          price: event.price,
          type: "regular",
          status: "booked",
          payment_id: paymentResponse.paymentId,
          customer_info: customerInfo,
        },
        { headers },
      )

      // Refresh tickets
      getUserTickets()

      return {
        success: true,
        ticketId: response.data.id,
        paymentId: paymentResponse.paymentId,
      }
    } catch (err) {
      console.error("Error processing payment:", err)
      const errorMessage = err.response?.data?.message || "Payment failed. Please try again."
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
      setButtonLoadingStates((prev) => ({
        ...prev,
        [`payment-${eventId}`]: false,
      }))
    }
  }

  // Get user's tickets
  const getUserTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching user tickets...")

      // Updated to use the correct endpoint
      const response = await axios.get("http://127.0.0.1:8000/mytickets", { headers })
      console.log("Tickets fetched successfully:", response.data)

      // Process tickets to include event data
      const processedTickets = response.data.map((ticket) => {
        const event = getEventById ? getEventById(ticket.event_id) : null
        return {
          ...ticket,
          event: event || {
            id: ticket.event_id,
            name: `Event ${ticket.event_id}`,
            image: null,
            date: "Unknown date",
            location: "Unknown location",
            price: ticket.price || 0,
          },
        }
      })

      setTickets(processedTickets)
      return processedTickets
    } catch (err) {
      console.error("Error fetching tickets:", err)
      setError(err.response?.data?.message || "Failed to fetch tickets. Please try again.")
      return []
    } finally {
      setLoading(false)
    }
  }

  // Update event ticket quantity selection (before booking)
  const updateEventTicketQuantity = (eventId, quantity) => {
    if (quantity < 1) quantity = 1
    setTicketQuantities((prev) => ({
      ...prev,
      [eventId]: quantity,
    }))
  }

  // Get current ticket quantity for an event
  const getEventTicketQuantity = (eventId) => {
    return ticketQuantities[eventId] || 1
  }

  // Calculate total price with proper type checking
  const calculateTotalPrice = (event, quantity = 1) => {
    if (!event) return 0

    // Handle different price formats (string or number)
    let price = 0
    if (typeof event.price === "number") {
      price = event.price
    } else if (typeof event.price === "string" && !isNaN(Number.parseFloat(event.price))) {
      price = Number.parseFloat(event.price)
    }

    // Ensure quantity is a valid number
    const validQuantity = typeof quantity === "number" && quantity > 0 ? quantity : 1

    return price * validQuantity
  }

  // Check if user ID is available
  const checkUserIdAvailable = () => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      console.warn("User ID not found in localStorage")
      return false
    }
    return true
  }

  // Load tickets when component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      getUserTickets()
    }
  }, [])

  // Context value
  const value = {
    tickets,
    loading,
    error,
    buttonLoadingStates,
    processPayment,
    getUserTickets,
    updateEventTicketQuantity,
    getEventTicketQuantity,
    calculateTotalPrice,
    checkUserIdAvailable,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export default BookingProvider

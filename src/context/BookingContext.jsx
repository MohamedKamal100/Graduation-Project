// "use client"

// import axios from "axios"
// import { createContext, useContext, useEffect, useState } from "react"
// import { useToast } from "./ToastContext"

// export const BookingContext = createContext()

// export const useBooking = () => {
//   const context = useContext(BookingContext)
//   if (!context) {
//     throw new Error("useBooking must be used within a BookingProvider")
//   }
//   return context
// }

// export default function BookingProvider({ children }) {
//   const [tickets, setTickets] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [buttonLoadingStates, setButtonLoadingStates] = useState({})
//   const [ticketQuantities, setTicketQuantities] = useState({})
//   const toast = useToast()

//   const headers = {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   }

//   // Book a ticket (add to tickets)
//   async function bookTicket(eventId, quantity = 1) {
//     setButtonLoadingStates((prev) => ({
//       ...prev,
//       [`book-${eventId}`]: true,
//     }))

//     try {
//       setLoading(true)
//       // Get user ID from localStorage if available
//       const userId = localStorage.getItem("userId")

//       // Get event details to include price
//       const event = await axios
//         .get(`http://127.0.0.1:8000/api/events/${eventId}`, { headers })
//         .then((res) => res.data)
//         .catch((err) => {
//           console.error("Failed to fetch event details:", err)
//           return null
//         })

//       if (!event) {
//         throw new Error("Failed to fetch event details")
//       }

//       const { data } = await axios.post(
//         `http://127.0.0.1:8000/api/tickets`,
//         {
//           event_id: eventId,
//           quantity,
//           user_id: userId, // Add the user_id field
//           price: event.price, // Add the price field from the event
//           type: "standard", // Add the type field (you can adjust this as needed)
//         },
//         { headers },
//       )

//       getUserTickets()
//       toast.success(`Successfully booked ${quantity} ticket${quantity > 1 ? "s" : ""}!`)
//       setLoading(false)
//       return true
//     } catch (err) {
//       console.error(err)
//       const errorMessage = err.response?.data?.message || "Failed to book ticket. Please try again."
//       toast.error(errorMessage)
//       setLoading(false)
//       return false
//     } finally {
//       setButtonLoadingStates((prev) => ({
//         ...prev,
//         [`book-${eventId}`]: false,
//       }))
//     }
//   }

//   // Remove a ticket
//   async function removeTicket(ticketId) {
//     setButtonLoadingStates((prev) => ({
//       ...prev,
//       [`remove-${ticketId}`]: true,
//     }))

//     try {
//       const { data } = await axios.delete(`http://127.0.0.1:8000/api/tickets/${ticketId}`, { headers })

//       getUserTickets()
//       toast.success("Ticket removed successfully")
//       return true
//     } catch (err) {
//       console.error(err)
//       toast.error(err.response?.data?.message || "Failed to remove ticket. Please try again.")
//       return false
//     } finally {
//       setButtonLoadingStates((prev) => ({
//         ...prev,
//         [`remove-${ticketId}`]: false,
//       }))
//     }
//   }

//   // Update ticket quantity
//   async function updateTicketQuantity(ticketId, quantity) {
//     if (quantity < 1) quantity = 1

//     setButtonLoadingStates((prev) => ({
//       ...prev,
//       [`update-${ticketId}`]: true,
//     }))

//     try {
//       const { data } = await axios.put(`http://127.0.0.1:8000/api/tickets/${ticketId}`, { quantity }, { headers })

//       getUserTickets()
//       toast.success("Ticket quantity updated")
//       return true
//     } catch (err) {
//       console.error(err)
//       toast.error(err.response?.data?.message || "Failed to update ticket quantity. Please try again.")
//       return false
//     } finally {
//       setButtonLoadingStates((prev) => ({
//         ...prev,
//         [`update-${ticketId}`]: false,
//       }))
//     }
//   }

//   // Get user's tickets
//   async function getUserTickets() {
//     try {
//       const { data } = await axios.get(`http://127.0.0.1:8000/api/mytickets`, { headers })

//       setTickets(data)
//       return data
//     } catch (err) {
//       console.error(err)
//       return []
//     }
//   }

//   // Update event ticket quantity selection (before booking)
//   const updateEventTicketQuantity = (eventId, quantity) => {
//     if (quantity < 1) quantity = 1
//     setTicketQuantities((prev) => ({
//       ...prev,
//       [eventId]: quantity,
//     }))
//   }

//   // Get current ticket quantity for an event
//   const getEventTicketQuantity = (eventId) => {
//     return ticketQuantities[eventId] || 1
//   }

//   // Calculate total price
//   const calculateTotalPrice = (event, quantity = 1) => {
//     if (!event || !event.price) return 0
//     return event.price * quantity
//   }

//   // Load tickets when component mounts
//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       getUserTickets()
//     }
//   }, [])

//   // Check if user ID is available
//   const checkUserIdAvailable = () => {
//     const userId = localStorage.getItem("userId")
//     if (!userId) {
//       console.warn("User ID not found in localStorage")
//       return false
//     }
//     return true
//   }

//   // value object
//   const value = {
//     tickets,
//     loading,
//     buttonLoadingStates,
//     bookTicket,
//     removeTicket,
//     updateTicketQuantity,
//     getUserTickets,
//     updateEventTicketQuantity,
//     getEventTicketQuantity,
//     calculateTotalPrice,
//     checkUserIdAvailable,
//   }

//   return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
// }


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

const BookingProvider = ({ children }) => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [buttonLoadingStates, setButtonLoadingStates] = useState({})
  const [ticketQuantities, setTicketQuantities] = useState({})
  const toast = useToast()
  const { getEventById } = useEvents()

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }

  // Book a ticket
  const bookTicket = async (eventId, quantity = 1) => {
    setButtonLoadingStates((prev) => ({
      ...prev,
      [`book-${eventId}`]: true,
    }))

    try {
      setLoading(true)
      // Get user ID from localStorage
      const userId = localStorage.getItem("userId")

      // Get event from context
      const event = getEventById(eventId)

      if (!event) {
        toast.error("Event information not found. Please try again.")
        return false
      }

      if (event.price === undefined || event.price === null) {
        toast.error("Event price information is missing. Please try again.")
        return false
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/tickets",
        {
          event_id: eventId,
          quantity,
          user_id: userId,
          price: event.price,
          type: "regular", // Changed from "standard" to "regular"
          status: "booked",
        },
        { headers },
      )

      // Refresh tickets
      getUserTickets()

      toast.success(`Successfully booked ${quantity} ticket${quantity > 1 ? "s" : ""}!`)
      return true
    } catch (err) {
      console.error(err)
      const errorMessage = err.response?.data?.message || "Failed to book ticket. Please try again."
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
      setButtonLoadingStates((prev) => ({
        ...prev,
        [`book-${eventId}`]: false,
      }))
    }
  }

  // Remove a ticket
  const removeTicket = async (ticketId) => {
    setButtonLoadingStates((prev) => ({
      ...prev,
      [`remove-${ticketId}`]: true,
    }))

    try {
      await axios.delete(`http://127.0.0.1:8000/api/tickets/${ticketId}`, { headers })

      // Refresh tickets
      getUserTickets()

      toast.success("Ticket removed successfully")
      return true
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to remove ticket. Please try again.")
      return false
    } finally {
      setButtonLoadingStates((prev) => ({
        ...prev,
        [`remove-${ticketId}`]: false,
      }))
    }
  }

  // Update ticket quantity
  const updateTicketQuantity = async (ticketId, quantity) => {
    if (quantity < 1) quantity = 1

    setButtonLoadingStates((prev) => ({
      ...prev,
      [`update-${ticketId}`]: true,
    }))

    try {
      const ticket = tickets.find((t) => t.id === ticketId)
      if (!ticket) {
        toast.error("Ticket not found")
        return false
      }

      await axios.put(
        `http://127.0.0.1:8000/api/tickets/${ticketId}`,
        {
          user_id: ticket.user_id || localStorage.getItem("userId"),
          event_id: ticket.event_id,
          type: "regular", // Changed from ticket.type to "regular"
          status: ticket.status || "booked",
          price: ticket.price,
          quantity: quantity,
        },
        { headers },
      )

      // Refresh tickets
      getUserTickets()

      toast.success("Ticket quantity updated")
      return true
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update ticket quantity. Please try again.")
      return false
    } finally {
      setButtonLoadingStates((prev) => ({
        ...prev,
        [`update-${ticketId}`]: false,
      }))
    }
  }

  // Get user's tickets
  const getUserTickets = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://127.0.0.1:8000/api/mytickets", { headers })

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
      console.error(err)
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

  // Calculate total price
  const calculateTotalPrice = (event, quantity = 1) => {
    if (!event || event.price === undefined || event.price === null) return 0
    return event.price * quantity
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
    if (localStorage.getItem("token")) {
      getUserTickets()
    }
  }, [])

  // Context value
  const value = {
    tickets,
    loading,
    buttonLoadingStates,
    bookTicket,
    removeTicket,
    updateTicketQuantity,
    getUserTickets,
    updateEventTicketQuantity,
    getEventTicketQuantity,
    calculateTotalPrice,
    checkUserIdAvailable,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export default BookingProvider


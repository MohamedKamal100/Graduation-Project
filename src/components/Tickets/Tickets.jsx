// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faTicketAlt,
//   faChevronRight,
//   faSpinner,
//   faCalendarAlt,
//   faMapMarkerAlt,
//   faQrcode,
//   faDownload,
//   faEye,
// } from "@fortawesome/free-solid-svg-icons"

// const Tickets = () => {
//   const [tickets, setTickets] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchTickets = async () => {
//       setLoading(true)
//       setError(null)

//       try {
//         // Fetch user tickets
//         const ticketsResponse = await axios.get("http://127.0.0.1:8000/api/tickets", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         // If there are no tickets, set empty array and return
//         if (!ticketsResponse.data || ticketsResponse.data.length === 0) {
//           setTickets([])
//           setLoading(false)
//           return
//         }

//         // Fetch all events to get event details
//         const eventsResponse = await axios.get("http://127.0.0.1:8000/api/events", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         // Create a map of event IDs to event data
//         const eventsMap = {}
//         eventsResponse.data.forEach((event) => {
//           eventsMap[event.id] = event
//         })

//         // Map tickets to their corresponding events
//         const ticketsWithEventDetails = ticketsResponse.data
//           .map((ticket) => ({
//             ...ticket,
//             event: eventsMap[ticket.event_id],
//           }))
//           .filter((ticket) => ticket.event) // Filter out tickets with no event data

//         setTickets(ticketsWithEventDetails)
//       } catch (error) {
//         console.error("❌ Error fetching tickets:", error.response?.data || error.message)
//         setError("Failed to load your tickets. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchTickets()
//   }, [])

//   const handleViewEvent = (eventId) => {
//     navigate(`/eventDetails/${eventId}`)
//   }

//   const handleViewTicket = (ticketId) => {
//     // Navigate to ticket details page or open a modal with ticket details
//     console.log("View ticket:", ticketId)
//   }

//   const handleDownloadTicket = (ticketId) => {
//     // Download ticket as PDF or image
//     console.log("Download ticket:", ticketId)
//   }

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
//             <FontAwesomeIcon icon={faTicketAlt} className="text-blue-600 dark:text-blue-400 mr-3" />
//             My Tickets
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">All your purchased event tickets in one place</p>
//         </div>

//         {/* Loading state */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
//             <p className="text-gray-600 dark:text-gray-400">Loading your tickets...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg text-center">
//             {error}
//           </div>
//         ) : tickets.length === 0 ? (
//           <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center">
//             <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
//             <p>You haven't purchased any tickets yet.</p>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//               onClick={() => navigate("/")}
//             >
//               Browse Events
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Tickets count */}
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
//             </p>

//             {/* Tickets list */}
//             <div className="space-y-4">
//               {tickets.map((ticket) => (
//                 <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
//                   <div className="md:flex">
//                     {/* Event image */}
//                     <div className="md:w-1/4 h-48 md:h-auto relative">
//                       <img
//                         src={ticket.event.image || "/placeholder.svg"}
//                         alt={ticket.event.name}
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 md:hidden"></div>
//                       <div className="absolute bottom-0 left-0 p-4 md:hidden">
//                         <h3 className="text-xl font-bold text-white">{ticket.event.name}</h3>
//                       </div>
//                     </div>

//                     {/* Ticket details */}
//                     <div className="p-6 md:w-2/4">
//                       <h3 className="text-xl font-bold text-gray-900 dark:text-white hidden md:block mb-2">
//                         {ticket.event.name}
//                       </h3>

//                       <div className="space-y-3">
//                         <div className="flex items-center text-gray-600 dark:text-gray-300">
//                           <FontAwesomeIcon
//                             icon={faCalendarAlt}
//                             className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
//                           />
//                           <span>{ticket.event.date}</span>
//                         </div>
//                         <div className="flex items-center text-gray-600 dark:text-gray-300">
//                           <FontAwesomeIcon
//                             icon={faMapMarkerAlt}
//                             className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
//                           />
//                           <span>{ticket.event.location}</span>
//                         </div>
//                         <div className="flex items-center text-gray-600 dark:text-gray-300">
//                           <FontAwesomeIcon
//                             icon={faTicketAlt}
//                             className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
//                           />
//                           <span>Ticket #{ticket.id}</span>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() => handleViewEvent(ticket.event.id)}
//                         className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
//                       >
//                         <span>View Event</span>
//                         <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5 ml-1" />
//                       </button>
//                     </div>

//                     {/* Actions */}
//                     <div className="p-6 bg-gray-50 dark:bg-gray-700 md:w-1/4 flex flex-col justify-center">
//                       <div className="flex justify-center mb-4">
//                         <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
//                           <FontAwesomeIcon icon={faQrcode} className="w-16 h-16 text-gray-800 dark:text-gray-200" />
//                         </div>
//                       </div>

//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleViewTicket(ticket.id)}
//                           className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
//                         >
//                           <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-1" />
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleDownloadTicket(ticket.id)}
//                           className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm"
//                         >
//                           <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-1" />
//                           Download
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Tickets
//* -------------------------------------------------------------
// "use client"

// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faTicketAlt,
//   faCalendarAlt,
//   faMapMarkerAlt,
//   faEye,
//   faTrash,
//   faDownload,
//   faSpinner,
//   faExclamationTriangle,
//   faInfoCircle,
// } from "@fortawesome/free-solid-svg-icons"
// import { useBooking } from "../../context/BookingContext"
// import { useToast } from "../../context/ToastContext"

// const Tickets = () => {
//   const { tickets, loading, error, buttonLoadingStates, removeTicket, getUserTickets } = useBooking()
//   const navigate = useNavigate()
//   const toast = useToast()

//   // Fetch tickets when component mounts
//   useEffect(() => {
//     getUserTickets()
//   }, [])

//   const handleViewEvent = (eventId) => {
//     navigate(`/eventDetails/${eventId}`)
//   }

//   const handleViewTicket = (ticketId) => {
//     toast.info("Viewing ticket details")
//   }

//   const handleDownloadTicket = (ticketId) => {
//     toast.info("Downloading ticket")
//   }

//   const handleRemoveTicket = async (ticketId, eventName) => {
//     if (window.confirm(`Are you sure you want to cancel this ticket for "${eventName}"?`)) {
//       try {
//         await removeTicket(ticketId)
//       } catch (error) {
//         console.error("Error removing ticket:", error)
//         toast.error("Failed to cancel ticket. Please try again.")
//       }
//     }
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
//             <FontAwesomeIcon icon={faTicketAlt} className="text-blue-500 mr-3" />
//             My Tickets
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your event tickets</p>
//         </div>

//         {/* Loading state */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
//             <p className="text-gray-600 dark:text-gray-400">Loading your tickets...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-8 rounded-lg text-center">
//             <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Error Loading Tickets</h3>
//             <p>{error}</p>
//             <button
//               className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
//               onClick={getUserTickets}
//             >
//               Try Again
//             </button>
//           </div>
//         ) : !tickets || tickets.length === 0 ? (
//           <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center">
//             <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
//             <p>You haven't booked any tickets yet.</p>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//               onClick={() => navigate("/events")}
//             >
//               Browse Events
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Tickets count */}
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
//             </p>

//             {/* Tickets list */}
//             <div className="space-y-6">
//               {tickets.map((ticket) => {
//                 const event = ticket.event || {}
//                 return (
//                   <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
//                     <div className="md:flex">
//                       {/* Event image */}
//                       <div className="md:w-1/4 h-48 md:h-auto relative">
//                         <img
//                           src={event.image || "/placeholder.svg"}
//                           alt={event.name || "Event"}
//                           className="w-full h-full object-cover"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 md:hidden"></div>
//                         <div className="absolute bottom-0 left-0 p-4 md:hidden">
//                           <h3 className="text-xl font-bold text-white">{event.name || "Event"}</h3>
//                         </div>

//                         {/* Ticket type badge */}
//                         <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
//                           {ticket.type || "Regular"}
//                         </span>

//                         {/* Ticket status badge */}
//                         <span
//                           className={`absolute top-3 right-3 text-white text-xs font-semibold px-2.5 py-1 rounded ${ticket.status === "booked"
//                               ? "bg-green-600"
//                               : ticket.status === "cancelled"
//                                 ? "bg-red-600"
//                                 : "bg-yellow-600"
//                             }`}
//                         >
//                           {ticket.status || "Booked"}
//                         </span>
//                       </div>

//                       {/* Ticket details */}
//                       <div className="p-6 md:w-2/4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">
//                             {event.name || "Event"}
//                           </h3>
//                           {ticket.price !== undefined && (
//                             <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded">
//                               ${Number.parseFloat(ticket.price).toFixed(2)}
//                             </span>
//                           )}
//                         </div>

//                         <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
//                           {event.description || "No description available"}
//                         </p>

//                         <div className="space-y-2 mb-4">
//                           <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                             <FontAwesomeIcon
//                               icon={faCalendarAlt}
//                               className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
//                             />
//                             <span>{formatDate(event.date) || "Date not available"}</span>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                             <FontAwesomeIcon
//                               icon={faMapMarkerAlt}
//                               className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
//                             />
//                             <span>{event.location || "Location not available"}</span>
//                           </div>

//                           {/* Ticket ID */}
//                           <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                             <FontAwesomeIcon
//                               icon={faTicketAlt}
//                               className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
//                             />
//                             <span>Ticket ID: {ticket.id}</span>
//                           </div>

//                           {/* Booking date */}
//                           <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                             <FontAwesomeIcon
//                               icon={faInfoCircle}
//                               className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
//                             />
//                             <span>Booked on: {formatDate(ticket.created_at)}</span>
//                           </div>
//                         </div>

//                         <button
//                           onClick={() => handleViewEvent(event.id || ticket.event_id)}
//                           className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
//                         >
//                           <span>View Event Details</span>
//                         </button>
//                       </div>

//                       {/* Actions */}
//                       <div className="p-6 bg-gray-50 dark:bg-gray-700 md:w-1/4 flex flex-col justify-center">
//                         <div className="flex flex-col space-y-3">
//                           <button
//                             onClick={() => handleViewTicket(ticket.id)}
//                             className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//                           >
//                             <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-2" />
//                             View Ticket
//                           </button>

//                           <button
//                             onClick={() => handleDownloadTicket(ticket.id)}
//                             className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
//                           >
//                             <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-2" />
//                             Download
//                           </button>

//                           <button
//                             onClick={() => handleRemoveTicket(ticket.id, event.name || "Event")}
//                             disabled={buttonLoadingStates[`remove-${ticket.id}`]}
//                             className="w-full flex items-center justify-center px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors"
//                           >
//                             {buttonLoadingStates[`remove-${ticket.id}`] ? (
//                               <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4 mr-2" />
//                             ) : (
//                               <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-2" />
//                             )}
//                             Cancel Ticket
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Tickets


"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTicketAlt,
  faCalendarAlt,
  faMapMarkerAlt,
  faEye,
  faTrash,
  faDownload,
  faSpinner,
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import { useBooking } from "../../context/BookingContext"
import { useToast } from "../../context/ToastContext"

const Tickets = () => {
  const { tickets, loading, error, buttonLoadingStates, removeTicket, getUserTickets } = useBooking()
  const navigate = useNavigate()
  const toast = useToast()

  // Fetch tickets when component mounts
  useEffect(() => {
    getUserTickets()
  }, [])

  const handleViewEvent = (eventId) => {
    navigate(`/eventDetails/${eventId}`)
  }

  const handleViewTicket = (ticketId) => {
    toast.info("Viewing ticket details")
  }

  const handleDownloadTicket = (ticketId) => {
    toast.info("Downloading ticket")
  }

  const handleRemoveTicket = async (ticketId, eventName) => {
    if (window.confirm(`Are you sure you want to cancel this ticket for "${eventName}"?`)) {
      try {
        const success = await removeTicket(ticketId)
        if (success) {
          console.log("Ticket successfully removed:", ticketId)
        }
      } catch (error) {
        console.error("Error removing ticket:", error)
        toast.error("Failed to cancel ticket. Please try again.")
      }
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faTicketAlt} className="text-blue-500 mr-3" />
            My Tickets
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your event tickets</p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your tickets...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-8 rounded-lg text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Tickets</h3>
            <p>{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              onClick={getUserTickets}
            >
              Try Again
            </button>
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
            <p>You haven't booked any tickets yet.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </button>
          </div>
        ) : (
          <>
            {/* Tickets count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
            </p>

            {/* Tickets list */}
            <div className="space-y-6">
              {tickets.map((ticket) => {
                const event = ticket.event || {}
                return (
                  <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                      {/* Event image */}
                      <div className="md:w-1/4 h-48 md:h-auto relative">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.name || "Event"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 md:hidden"></div>
                        <div className="absolute bottom-0 left-0 p-4 md:hidden">
                          <h3 className="text-xl font-bold text-white">{event.name || "Event"}</h3>
                        </div>

                        {/* Ticket type badge */}
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                          {ticket.type || "Regular"}
                        </span>

                        {/* Ticket status badge */}
                        <span
                          className={`absolute top-3 right-3 text-white text-xs font-semibold px-2.5 py-1 rounded ${ticket.status === "booked"
                            ? "bg-green-600"
                            : ticket.status === "cancelled"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                            }`}
                        >
                          {ticket.status || "Booked"}
                        </span>
                      </div>

                      {/* Ticket details */}
                      <div className="p-6 md:w-2/4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">
                            {event.name || "Event"}
                          </h3>
                          {ticket.price !== undefined && (
                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded">
                              ${Number.parseFloat(ticket.price).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {event.description || "No description available"}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            />
                            <span>{formatDate(event.date) || "Date not available"}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            />
                            <span>{event.location || "Location not available"}</span>
                          </div>

                          {/* Ticket ID */}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <FontAwesomeIcon
                              icon={faTicketAlt}
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            />
                            <span>Ticket ID: {ticket.id}</span>
                          </div>

                          {/* Booking date */}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            />
                            <span>Booked on: {formatDate(ticket.created_at)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleViewEvent(event.id || ticket.event_id)}
                          className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          <span>View Event Details</span>
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 md:w-1/4 flex flex-col justify-center">
                        <div className="flex flex-col space-y-3">
                          <button
                            onClick={() => handleViewTicket(ticket.id)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-2" />
                            View Ticket
                          </button>

                          <button
                            onClick={() => handleDownloadTicket(ticket.id)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-2" />
                            Download
                          </button>

                          <button
                            onClick={() => handleRemoveTicket(ticket.id, event.name || "Event")}
                            disabled={buttonLoadingStates[`remove-${ticket.id}`]}
                            className="w-full flex items-center justify-center px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                          >
                            {buttonLoadingStates[`remove-${ticket.id}`] ? (
                              <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4 mr-2" />
                            ) : (
                              <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-2" />
                            )}
                            Cancel Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Tickets


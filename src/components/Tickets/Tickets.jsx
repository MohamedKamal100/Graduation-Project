"use client"

import { useEffect, useState } from "react"
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
  faSync,
  faSearch,
  faSortAmountDown,
  faSortAmountUp,
  faQrcode,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { useToast } from "../../context/ToastContext"
import { generateTicketPDF } from "../../utils/pdfGenerator"

const Tickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [buttonLoadingStates, setButtonLoadingStates] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filteredTickets, setFilteredTickets] = useState([])
  const [activeTicket, setActiveTicket] = useState(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  // Fetch tickets when component mounts
  useEffect(() => {
    getUserTickets()
  }, [])

  // Get user's tickets from API
  const getUserTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching user tickets...")

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required. Please log in.")
      }

      const response = await axios.get("http://127.0.0.1:8000/api/mytickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Tickets fetched successfully:", response.data)

      // Ensure we have complete ticket data with event details
      const ticketsWithDetails = await Promise.all(
        response.data.map(async (ticket) => {
          // If ticket already has complete event details, return it as is
          if (ticket.event && ticket.event.name && ticket.event.location && ticket.event.date) {
            return ticket
          }

          // Otherwise, fetch event details
          try {
            if (ticket.event_id) {
              const eventResponse = await axios.get(`http://127.0.0.1:8000/api/events/${ticket.event_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

              return {
                ...ticket,
                event: eventResponse.data,
              }
            }
            return ticket
          } catch (err) {
            console.error(`Error fetching details for event ${ticket.event_id}:`, err)
            return ticket
          }
        }),
      )

      setTickets(ticketsWithDetails)
      return ticketsWithDetails
    } catch (err) {
      console.error("Error fetching tickets:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch tickets. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort tickets when dependencies change
  useEffect(() => {
    if (!tickets || tickets.length === 0) return

    console.log("Filtering and sorting tickets...")
    let filtered = [...tickets]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          (ticket.event?.name && ticket.event.name.toLowerCase().includes(term)) ||
          (ticket.event?.location && ticket.event.location.toLowerCase().includes(term)) ||
          (ticket.id && ticket.id.toString().includes(term)),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      if (sortBy === "date") {
        const dateA = a.event?.date ? new Date(a.event.date) : new Date(0)
        const dateB = b.event?.date ? new Date(b.event.date) : new Date(0)
        comparison = dateA - dateB
      } else if (sortBy === "name") {
        const nameA = a.event?.name || ""
        const nameB = b.event?.name || ""
        comparison = nameA.localeCompare(nameB)
      } else if (sortBy === "price") {
        const priceA = a.price || 0
        const priceB = b.price || 0
        comparison = priceA - priceB
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    setFilteredTickets(filtered)
    console.log("Filtered tickets:", filtered.length)
  }, [tickets, searchTerm, sortBy, sortDirection])

  const handleViewEvent = (eventId) => {
    console.log(`Navigating to event details for event ${eventId}...`)
    navigate(`/eventDetails/${eventId}`)
  }

  const handleViewTicket = (ticket) => {
    console.log(`Viewing ticket details for ticket ${ticket.id}...`)
    setActiveTicket(ticket)
    setShowTicketModal(true)
  }

  const handleDownloadTicket = async (ticketId) => {
    console.log(`Downloading ticket ${ticketId}...`)
    toast.info("Generating ticket PDF for download...")

    setButtonLoadingStates((prev) => ({
      ...prev,
      [`download-${ticketId}`]: true,
    }))

    try {
      // Find the ticket data
      const ticket = tickets.find((t) => t.id === ticketId)
      if (!ticket) throw new Error("Ticket not found")

      // Generate and download the PDF
      await generateTicketPDF(ticket)

      toast.success("Ticket downloaded successfully")
    } catch (error) {
      console.error("Error downloading ticket:", error)
      toast.error("Failed to download ticket. Please try again.")
    } finally {
      setButtonLoadingStates((prev) => ({
        ...prev,
        [`download-${ticketId}`]: false,
      }))
    }
  }

  const handleRemoveTicket = async (ticketId, eventName) => {
    console.log(`Confirming ticket removal for ticket ${ticketId}...`)
    if (window.confirm(`Are you sure you want to cancel this ticket for "${eventName}"?`)) {
      try {
        setButtonLoadingStates((prev) => ({
          ...prev,
          [`remove-${ticketId}`]: true,
        }))

        console.log(`Removing ticket ${ticketId}...`)
        const token = localStorage.getItem("token")

        await axios.delete(`http://127.0.0.1:8000/api/tickets/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        toast.success(`Ticket for "${eventName}" has been cancelled`)

        // Refresh tickets list
        getUserTickets()
      } catch (error) {
        console.error("Error removing ticket:", error)
        toast.error("Failed to cancel ticket. Please try again.")
      } finally {
        setButtonLoadingStates((prev) => ({
          ...prev,
          [`remove-${ticketId}`]: false,
        }))
      }
    }
  }

  const handleRefresh = async () => {
    console.log("Refreshing tickets...")
    setRefreshing(true)
    await getUserTickets()
    setTimeout(() => {
      setRefreshing(false)
    }, 600)
  }

  const toggleSortDirection = () => {
    console.log(`Toggling sort direction from ${sortDirection} to ${sortDirection === "asc" ? "desc" : "asc"}...`)
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Invalid date"
    }
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "used":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
        return faCheckCircle
      case "cancelled":
        return faTimesCircle
      case "used":
        return faCheckCircle
      case "pending":
        return faClock
      default:
        return faTicketAlt
    }
  }

  const handleShowQRCode = async (ticket) => {
    try {
      // Import QRCode dynamically to avoid server-side rendering issues
      const QRCode = await import("qrcode")

      // Generate QR code data
      const qrData = `TICKET:${ticket.id}|EVENT:${ticket.event_id}|USER:${localStorage.getItem("userId") || "user"}|TIME:${Date.now()}`

      // Generate QR code as data URL
      const dataUrl = await QRCode.default.toDataURL(qrData, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 300,
        color: {
          dark: "#4c1d95", // Purple color for dark modules
          light: "#ffffff", // White color for light modules
        },
      })

      // Create a temporary link element
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `ticket-qr-${ticket.id}.png`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("QR code downloaded successfully")
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.error("Failed to generate QR code. Please try again.")
    }
  }

  return (
    <div className="bg-gray-50 pt-22 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 shadow-lg animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <FontAwesomeIcon icon={faTicketAlt} className="mr-3" />
                My Tickets
              </h2>
              <p className="opacity-90">Manage your event tickets and bookings</p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="flex items-center justify-center px-4 py-2 bg-white hover:bg-gray-100 text-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover-lift"
            >
              <FontAwesomeIcon icon={faSync} className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and filters */}
        {!loading && filteredTickets.length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 animate-slideUp">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                </select>

                <button
                  onClick={toggleSortDirection}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                >
                  <FontAwesomeIcon
                    icon={sortDirection === "asc" ? faSortAmountUp : faSortAmountDown}
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
            <div className="relative w-20 h-20 mb-4">
              <FontAwesomeIcon
                icon={faTicketAlt}
                className="text-purple-600 dark:text-purple-400 text-5xl absolute inset-0 m-auto animate-pulse-glow"
              />
              <div className="w-full h-full rounded-full border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 dark:border-t-purple-400 animate-spin absolute"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your tickets...</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">This may take a moment</p>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Error Loading Tickets</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md hover-lift"
              onClick={getUserTickets}
            >
              Try Again
            </button>
          </div>
        ) : !filteredTickets || filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTicketAlt} className="text-purple-500 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No tickets yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't booked any tickets yet. Browse our events and book your first ticket!
            </p>
            <button
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md hover-lift"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </button>
          </div>
        ) : (
          <>
            {/* Tickets count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 animate-fadeIn">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>

            {/* Tickets list */}
            <div className="space-y-6">
              {filteredTickets.map((ticket, index) => {
                const event = ticket.event || {}
                return (
                  <div
                    key={ticket.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn ticket-hover"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="md:flex">
                      {/* Event image */}
                      <div className="md:w-1/4 h-48 md:h-auto relative overflow-hidden">
                        <img
                          src={event.image_path || "/placeholder.svg?height=300&width=400"}
                          alt={event.name || "Event"}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 rounded-l-xl"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=300&width=400"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>

                        {/* Status badge */}
                        <div
                          className={`absolute top-3 right-3 flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm animate-fadeIn ${getStatusColor(ticket.status)}`}
                          style={{ animationDelay: `${index * 100 + 200}ms` }}
                        >
                          <FontAwesomeIcon icon={getStatusIcon(ticket.status)} className="mr-1" />
                          {ticket.status || "Booked"}
                        </div>

                        {/* Ticket type badge */}
                        <div className="absolute top-3 left-3 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                          {ticket.type || "Regular"}
                        </div>

                        {/* Event date */}
                        <div className="absolute bottom-3 left-3 text-white text-sm">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                          {formatDate(event.date)?.split(",")[0] || "Date not available"}
                        </div>
                      </div>

                      {/* Ticket details */}
                      <div className="p-6 md:w-2/4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.name || "Event"}</h3>
                          {ticket.price !== undefined && (
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold px-3 py-1 rounded-full">
                              $
                              {typeof ticket.price === "number"
                                ? ticket.price.toFixed(2)
                                : Number.parseFloat(ticket.price || 0).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="space-y-3 mb-4">
                          {/* Location */}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-3">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <span>{event.location || "Location not available"}</span>
                          </div>

                          {/* Event date and time */}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-3">
                              <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <span>{formatDate(event.date) || "Date not available"}</span>
                          </div>

                          {/* Ticket ID */}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-3">
                              <FontAwesomeIcon icon={faQrcode} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <span>Ticket ID: {ticket.id}</span>
                          </div>

                          {/* Booking date */}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-3">
                              <FontAwesomeIcon icon={faInfoCircle} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <span>Booked on: {formatDate(ticket.created_at)}</span>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-3">
                              <FontAwesomeIcon icon={faUser} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <span>Quantity: {ticket.quantity || 1}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleViewEvent(event.id || ticket.event_id)}
                          className="mt-4 flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-2" />
                          <span>View Event Details</span>
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 md:w-1/4 flex flex-col justify-center">
                        <div className="flex flex-col space-y-3">
                          <button
                            onClick={() => handleViewTicket(ticket)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors transform hover:scale-105 shadow-md"
                          >
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-2" />
                            View Ticket
                          </button>

                          <button
                            onClick={() => handleDownloadTicket(ticket.id)}
                            disabled={buttonLoadingStates[`download-${ticket.id}`]}
                            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed download-button"
                          >
                            {buttonLoadingStates[`download-${ticket.id}`] ? (
                              <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4 mr-2" />
                            ) : (
                              <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-2" />
                            )}
                            Download PDF
                          </button>

                          <button
                            onClick={() => handleShowQRCode(ticket)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg transition-colors transform hover:scale-105 shadow-md"
                          >
                            <FontAwesomeIcon icon={faQrcode} className="w-4 h-4 mr-2" />
                            Download QR Code
                          </button>

                          {ticket.status !== "cancelled" && (
                            <button
                              onClick={() => handleRemoveTicket(ticket.id, event.name || "Event")}
                              disabled={buttonLoadingStates[`remove-${ticket.id}`]}
                              className="w-full flex items-center justify-center px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {buttonLoadingStates[`remove-${ticket.id}`] ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4 mr-2" />
                              ) : (
                                <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-2" />
                              )}
                              Cancel Ticket
                            </button>
                          )}
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

      {/* Ticket Modal */}
      {showTicketModal && activeTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FontAwesomeIcon icon={faTicketAlt} className="text-purple-600 mr-2" />
                Ticket Details
              </h3>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Event Image */}
              <div className="flex justify-center mb-6">
                {activeTicket.event?.image_path ? (
                  <img
                    src={activeTicket.event.image_path || "/placeholder.svg"}
                    alt={activeTicket.event?.name || "Event"}
                    className="h-48 rounded-lg object-cover shadow-md transition-all duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faTicketAlt} className="text-6xl text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Event</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{activeTicket.event?.name || "Event"}</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatDate(activeTicket.event?.date)}</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {activeTicket.event?.location || "Location not available"}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ticket ID</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{activeTicket.id}</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{activeTicket.quantity || 1}</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    $
                    {typeof activeTicket.price === "number"
                      ? activeTicket.price.toFixed(2)
                      : Number.parseFloat(activeTicket.price || 0).toFixed(2)}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                  <p className={`font-semibold ${getStatusColor(activeTicket.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(activeTicket.status)} className="mr-1" />
                    {activeTicket.status || "Booked"}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatDate(activeTicket.created_at)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleDownloadTicket(activeTicket.id)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md hover-lift flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download Ticket
                </button>

                <button
                  onClick={() => handleShowQRCode(activeTicket)}
                  className="px-6 py-3 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors shadow-md hover-lift flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faQrcode} className="mr-2" />
                  Download QR Code
                </button>

                {activeTicket.status !== "cancelled" && (
                  <button
                    onClick={() => {
                      handleRemoveTicket(activeTicket.id, activeTicket.event?.name || "Event")
                      setShowTicketModal(false)
                    }}
                    className="px-6 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors shadow-md hover-lift flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Cancel Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tickets

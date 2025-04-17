"use client"

import { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTicketAlt,
  faCalendarAlt,
  faMapMarkerAlt,
  faCheckCircle,
  faExclamationTriangle,
  faDownload,
  faEnvelope,
  faArrowLeft,
  faQrcode,
  faPrint,
} from "@fortawesome/free-solid-svg-icons"
import { useEvents } from "../../context/EventsContext"
import { useBooking } from "../../context/BookingContext"
import { motion } from "framer-motion"

const CheckoutConfirmation = () => {
  const { id: ticketId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { getEventById } = useEvents()
  const { getUserTickets } = useBooking()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ticketData, setTicketData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // If we have state from navigation, use it
        if (state && state.event && state.ticketId) {
          setTicketData({
            event: state.event,
            quantity: state.quantity,
            totalPrice: state.totalPrice,
            paymentId: state.paymentId,
            ticketId: state.ticketId,
          })
        } else {
          // Otherwise fetch ticket data
          const tickets = await getUserTickets()
          const ticket = tickets.find((t) => t.id === Number(ticketId))

          if (ticket) {
            const event = getEventById(ticket.event_id)
            if (event) {
              setTicketData({
                event,
                quantity: ticket.quantity,
                totalPrice: ticket.price * ticket.quantity,
                paymentId: ticket.payment_id,
                ticketId: ticket.id,
              })
            } else {
              setError("Event not found")
            }
          } else {
            setError("Ticket not found")
          }
        }
      } catch (err) {
        console.error("Error loading confirmation:", err)
        setError("Failed to load confirmation details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ticketId, state, getEventById, getUserTickets])

  const handleViewTickets = () => {
    navigate("/tickets")
  }

  const handleDownloadTicket = () => {
    // This would be implemented with a real PDF generation service
    alert("Ticket download functionality would be implemented here")
  }

  const handleEmailTicket = () => {
    // This would be implemented with a real email service
    alert("Email ticket functionality would be implemented here")
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Loading your confirmation...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !ticketData) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Confirmation Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
              {error || "The confirmation you're looking for could not be found."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/tickets")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center"
            >
              View My Tickets
              <FontAwesomeIcon icon={faTicketAlt} className="ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  const { event, quantity, totalPrice, paymentId } = ticketData

  return (
    <div className="bg-gradient-to-br pt-24 from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-600 dark:text-indigo-400" />
          </button>
          <h2 className="text-3xl pt-14 font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            Booking Confirmation
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    Thank you for your purchase. Your tickets have been booked successfully and are ready for use.
                  </p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mb-8 text-left max-w-lg mx-auto"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FontAwesomeIcon icon={faTicketAlt} className="mr-3 text-indigo-600 dark:text-indigo-400" />
                      Booking Details
                    </h4>

                    <div className="space-y-3">
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
                        <span className="font-medium text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
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
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
                      View My Tickets
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/events")}
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-md text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Browse More Events
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faTicketAlt} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                Ticket Actions
              </h3>

              <div className="space-y-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadTicket}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download Ticket PDF
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailTicket}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Email Ticket to Me
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faPrint} className="mr-2" />
                  Print Tickets
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => alert("QR code would be displayed here")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faQrcode} className="mr-2" />
                  Show QR Code
                </motion.button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Event Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="w-4 h-4 mr-3 text-indigo-600 dark:text-indigo-400"
                    />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="w-4 h-4 mr-3 text-indigo-600 dark:text-indigo-400"
                    />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutConfirmation

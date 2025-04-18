
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeart as faHeartSolid,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faStar as faStarSolid,
  faSpinner,
  faClock,
  faTag,
  faArrowLeft,
  faShare,
  faInfoCircle,
  faMinus,
  faPlus,
  faExclamationTriangle,
  faShoppingCart,
  faTimes
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import { useEvents } from "../../context/EventsContext"
import { useToast } from "../../context/ToastContext"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReviewStars from "../ReviewStars/ReviewStars"
import RelatedEvents from "../RelatedEvents/RelatedEvents"
import "./eventDetails.css"

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const {
    getEventById,
    getAllEvents,
    bookmarks,
    toggleBookmark,
    buttonLoadingStates: eventButtonLoadingStates,
  } = useEvents()
  const contentRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    try {
      // Get event directly from context
      const eventData = getEventById(id)

      if (eventData) {
        setEvent(eventData)

        // Get related events (same category or location)
        const allEvents = getAllEvents()
        const filtered = allEvents
          .filter((e) => e.id !== eventData.id) // Exclude current event
          .filter(
            (e) =>
              (e.category && eventData.category && e.category.toLowerCase() === eventData.category.toLowerCase()) ||
              (e.location && eventData.location && e.location.toLowerCase() === eventData.location.toLowerCase()),
          )
          .slice(0, 4) // Limit to 4 related events

        setRelatedEvents(filtered)
      } else {
        setError("Event not found")
      }
    } catch (err) {
      console.error("Error loading event:", err)
      setError("Failed to load event details")
    } finally {
      setIsLoading(false)
    }
  }, [id, getEventById, getAllEvents])

  const isLoved = bookmarks[id] || false
  const isBookmarkLoading = eventButtonLoadingStates[`bookmark-${id}`] || false
  const totalPrice = event ? event.price * quantity : 0

  const handleLoveClick = async () => {
    if (!event) return
    await toggleBookmark(event.id)
  }

  const handleProceedToCheckout = () => {
    if (!event) return
    if (event.available_tickets < quantity) {
      toast.error(`Only ${event.available_tickets} tickets available`)
      return
    }
    navigate(`/checkout/${event.id}`, { state: { event, quantity } })
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) newQuantity = 1
    if (event && newQuantity > event.available_tickets) {
      newQuantity = event.available_tickets
      toast.warning(`Maximum available tickets: ${event.available_tickets}`)
    }
    setQuantity(newQuantity)
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith("http")) return imagePath
    return `http://127.0.0.1:8000${imagePath}`
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
  }

  const handleImageClick = () => {
    setIsImageModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsImageModalOpen(false)
  }

  const renderRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStarSolid} className="text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={`half-star`} className="relative">
            <FontAwesomeIcon icon={faStarRegular} className="text-gray-300 dark:text-gray-600" />
            <span className="absolute top-0 left-0 overflow-hidden w-1/2">
              <FontAwesomeIcon icon={faStarSolid} className="text-yellow-400" />
            </span>
          </span>,
        )
      } else {
        stars.push(
          <FontAwesomeIcon key={`empty-${i}`} icon={faStarRegular} className="text-gray-300 dark:text-gray-600" />,
        )
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <FontAwesomeIcon icon={faSpinner} spin className="text-purple-600 dark:text-purple-400 text-4xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Event Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The event you're looking for could not be found."}
            </p>
            <button
              onClick={() => navigate("/events")}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors shadow-md"
            >
              Browse Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  const ticketPercentage = (event.available_tickets / event.capacity) * 100

  return (
    <motion.div
      className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-20 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      ref={contentRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Updated Image Section */}
            <div
              className="relative group cursor-pointer"
              style={{ height: "300px" }}
              onClick={handleImageClick}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={getImageUrl(event.image_path || event.image)}
                  alt={event.name || event.title}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />

                {/* Light Outline Effect */}
                <div className={`absolute inset-0 border-4 transition-all duration-300 ${isImageHovered ? "border-white/30" : "border-transparent"}`}></div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60 transition-opacity duration-300 ${isImageHovered ? "opacity-90" : "opacity-80"}`}></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-opacity duration-300 transform ${isImageHovered ? "opacity-100 translate-x-full" : "opacity-0 -translate-x-full"}`}></div>
                </div>
              </div>

              {/* Overlay buttons */}
              <motion.div
                className="absolute top-4 right-4 flex space-x-3 z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(window.location.href)
                    toast.info("Link copied to clipboard!")
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className={`bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${isLoved ? "text-red-500" : "text-gray-800 dark:text-gray-200"} ${isBookmarkLoading ? "opacity-80 cursor-wait" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLoveClick()
                  }}
                  disabled={isBookmarkLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isBookmarkLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                  ) : (
                    <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5" />
                  )}
                </motion.button>
              </motion.div>

              {/* Category badge */}
              <motion.div
                className="absolute top-4 left-4 z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {event.category && (
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    {event.category}
                  </span>
                )}
              </motion.div>

              {/* Event date overlay */}
              <motion.div
                className="absolute bottom-4 left-4 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {event.date || event.event_date || "Date TBA"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="p-6">
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2"
                variants={itemVariants}
              >
                {event.name || event.title}
              </motion.h1>

              <motion.div className="flex items-center mb-4" variants={itemVariants}>
                {renderRating(event.rating || 4.5)}
                <div className="ml-4">
                  <ReviewStars
                    eventId={event.id}
                    initialRating={event.user_rating || 0}
                    totalReviews={event.reviews_count || 0}
                  />
                </div>
              </motion.div>

              <motion.div className="grid grid-cols-2 gap-3 mb-4" variants={itemVariants}>
                <div className="flex items-start">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Date & Time</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {event.date || event.event_date || "TBA"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full mr-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Location</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{event.location || "TBA"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-2">
                    <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Capacity</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {event.available_tickets || 0} / {event.capacity || 100}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mr-2">
                    <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Price</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {event.price ? `$${event.price}` : "Free"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About This Event</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {event.description || "No description available."}
                </p>
              </motion.div>

              {/* Ticket booking section */}
              <motion.div className="border-t border-gray-200 dark:border-gray-700 pt-4" variants={itemVariants}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Book Tickets</h3>
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {event.price ? `$${event.price}` : "Free"}
                  </span>
                </div>

                {/* Ticket availability */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Available tickets</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {event.available_tickets || 0} / {event.capacity || 100}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${ticketPercentage <= 20
                        ? "bg-red-500"
                        : ticketPercentage <= 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        } transition-all duration-500 ease-in-out`}
                      style={{ width: `${ticketPercentage}%` }}
                    ></div>
                  </div>
                  {ticketPercentage <= 20 && (
                    <p className="text-red-500 text-xs mt-1 animate-pulse">Hurry! Only a few tickets left.</p>
                  )}
                </div>

                {/* Ticket quantity selector */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Tickets
                  </label>
                  <div className="flex items-center">
                    <motion.button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                    </motion.button>
                    <input
                      type="number"
                      min="1"
                      max={event.available_tickets || 100}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                      className="w-12 text-center p-1.5 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                    <motion.button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (event.available_tickets || 100)}
                      className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>

                {/* Total price */}
                {event.price > 0 && (
                  <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-700 dark:text-gray-300">Subtotal</span>
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        ${(event.price * quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col space-y-2">
                  <motion.button
                    onClick={handleProceedToCheckout}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    disabled={event.available_tickets <= 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4 mr-2" />
                    {event.available_tickets > 0 ? `Proceed to Checkout` : "Sold Out"}
                  </motion.button>

                  <motion.button
                    onClick={handleLoveClick}
                    className={`w-full flex items-center justify-center px-4 py-2 border rounded-lg transition-all duration-300 font-medium text-sm ${isLoved
                      ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    disabled={isBookmarkLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isBookmarkLoading ? (
                      <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4 mr-2" />
                    ) : (
                      <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-4 h-4 mr-2" />
                    )}
                    {isLoved ? "Saved to Favorites" : "Save to Favorites"}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* ... (rest of your existing event details code) ... */}
          </div>
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {isImageModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={handleCloseModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <button
                  className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                  onClick={handleCloseModal}
                >
                  <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                </button>
                <img
                  src={getImageUrl(event.image_path || event.image)}
                  alt={event.name || event.title}
                  className="w-full h-full object-contain max-h-[80vh]"
                />
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm opacity-80">
                  Click anywhere to close
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional information section */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="flex items-start"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
                <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">Event Rules</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Please arrive at least 30 minutes before the event starts. No refunds available after purchase. All
                  attendees must follow venue guidelines and event policies.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full mr-3">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">Duration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Approximately 3 hours. Doors open 1 hour before the event starts. Please plan accordingly for parking
                  and transportation.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>


        {/* Related Events Section */}
        {relatedEvents.length > 0 && <RelatedEvents events={relatedEvents} />}

        {/* Back button at the bottom */}
        <div className="flex justify-center mt-8">
          <motion.button
            className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-full transition-colors shadow-md"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
            Back to Events
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default EventDetails
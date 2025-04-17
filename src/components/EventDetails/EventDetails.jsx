"use client"
import { useParams, useNavigate } from "react-router-dom"
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
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import { useEvents } from "../../context/EventsContext"
import { useToast } from "../../context/ToastContext"
import { useState, useEffect } from "react"
import { getImageUrl, handleImageError } from "../../utils/imageUtils"
import "./eventDetails.css" // We'll create this CSS file for animations

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { getEventById, bookmarks, toggleBookmark, buttonLoadingStates: eventButtonLoadingStates } = useEvents()

  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isImageHovered, setIsImageHovered] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    try {
      // Get event directly from context
      const eventData = getEventById(id)

      if (eventData) {
        setEvent(eventData)
      } else {
        setError("Event not found")
      }
    } catch (err) {
      console.error("Error loading event:", err)
      setError("Failed to load event details")
    } finally {
      setIsLoading(false)
    }
  }, [id, getEventById])

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

    // Navigate to checkout with event and quantity information
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

  // Function to render star rating
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

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Event Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The event you're looking for could not be found."}
            </p>
            <button
              onClick={() => navigate("/events")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          className="mb-6 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-full transition-colors shadow-md"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </button>

        {/* Main content with new layout */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left side - Image with animation */}
            <div
              className="relative event-image-container"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <div className={`event-image-wrapper ${isImageHovered ? "hovered" : ""}`}>
                <img
                  src={getImageUrl(event.image_path || event.image) || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-full object-contain md:object-cover"
                  onError={handleImageError}
                />
              </div>

              {/* Overlay buttons */}
              <div className="absolute top-4 right-4 flex space-x-3 z-10">
                <button
                  className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.info("Link copied to clipboard!")
                  }}
                >
                  <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
                </button>

                <button
                  className={`bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 ${isLoved ? "text-red-500" : "text-gray-800 dark:text-gray-200"
                    } ${isBookmarkLoading ? "opacity-80 cursor-wait" : ""}`}
                  onClick={handleLoveClick}
                  disabled={isBookmarkLoading}
                >
                  {isBookmarkLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                  ) : (
                    <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Category badge */}
              {event.category && (
                <span className="absolute top-4 left-4 inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                  {event.category}
                </span>
              )}
            </div>

            {/* Right side - Event details */}
            <div className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">{event.name}</h1>
              <div className="flex items-center mb-6">{renderRating(event.rating || 4.5)}</div>

              <div className="space-y-6">
                {/* Event details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Date & Time</h4>
                      <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
                      <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full mr-3">
                      <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Capacity</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.available_tickets} / {event.capacity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mr-3">
                      <FontAwesomeIcon icon={faTag} className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Price</h4>
                      <p className="text-gray-600 dark:text-gray-300">{event.price ? `$${event.price}` : "Free"}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About This Event</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{event.description}</p>
                </div>

                {/* Ticket booking section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book Tickets</h3>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {event.price ? `$${event.price}` : "Free"}
                    </span>
                  </div>

                  {/* Ticket availability */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Available tickets</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {event.available_tickets} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${ticketPercentage <= 20
                          ? "bg-red-500"
                          : ticketPercentage <= 50
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          } transition-all duration-500 ease-in-out`}
                        style={{ width: `${ticketPercentage}%` }}
                      ></div>
                    </div>
                    {ticketPercentage <= 20 && (
                      <p className="text-red-500 text-sm mt-1 animate-pulse">Hurry! Only a few tickets left.</p>
                    )}
                  </div>

                  {/* Ticket quantity selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Tickets
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={event.available_tickets}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                        className="w-16 text-center p-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= event.available_tickets}
                        className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total price */}
                  {event.price > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${(event.price * quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-medium text-gray-900 dark:text-white">Total</span>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={event.available_tickets <= 0}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 mr-2" />
                      {event.available_tickets > 0 ? `Proceed to Checkout` : "Sold Out"}
                    </button>

                    <button
                      onClick={handleLoveClick}
                      className={`w-full flex items-center justify-center px-6 py-3 border rounded-lg transition-all duration-300 transform hover:scale-105 font-medium ${isLoved
                        ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      disabled={isBookmarkLoading}
                    >
                      {isBookmarkLoading ? (
                        <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5 mr-2" />
                      ) : (
                        <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5 mr-2" />
                      )}
                      {isLoved ? "Saved to Favorites" : "Save to Favorites"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional information section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mt-8 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
                <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Event Rules</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Please arrive at least 30 minutes before the event starts. No refunds available after purchase. All
                  attendees must follow venue guidelines and event policies.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
                <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Duration</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Approximately 3 hours. Doors open 1 hour before the event starts. Please plan accordingly for parking
                  and transportation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails

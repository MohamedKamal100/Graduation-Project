"use client"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeart as faHeartSolid,
  faTicketAlt,
  faChevronRight,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faStar as faStarSolid,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import { useWishlist } from "../../context/WishlistContext"
import { useToast } from "../../context/ToastContext"
import { useState } from "react"

export function EventCard({ event }) {
  const { isInWishlist, getBookmarkIdByEventId, toggleWishlist } = useWishlist()
  const navigate = useNavigate()
  const toast = useToast()
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

  const isLoved = isInWishlist(event.id)
  const bookmarkId = getBookmarkIdByEventId(event.id)

  const handleLoveClick = async (e) => {
    e.stopPropagation()
    console.log("Toggle bookmark for event:", event.id, event.name)

    // Start animation
    setIsHeartAnimating(true)
    setIsBookmarkLoading(true)

    // Toggle wishlist status
    await toggleWishlist(event.id, event.name)

    // Reset animation after a delay
    setTimeout(() => {
      setIsHeartAnimating(false)
      setIsBookmarkLoading(false)
    }, 600)
  }

  const handleShowMore = () => {
    navigate(`/eventDetails/${event.id}`)
  }

  // Update the handleBooking function to navigate to event details
  const handleBooking = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Navigate to event details
    navigate(`/eventDetails/${event.id}`)
  }

  const ticketPercentage = (event.available_tickets / event.capacity) * 100

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
        <span className="text-xs text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
      </div>
    )
  }

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 hover-lift">
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />

        {event.category && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
            {event.category}
          </span>
        )}

        <button
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 transition-colors ${isLoved ? "text-red-500" : "text-gray-700 dark:text-gray-300"} ${isBookmarkLoading ? "opacity-80 cursor-wait" : ""} ${isHeartAnimating ? "heart-animation" : ""}`}
          onClick={handleLoveClick}
          disabled={isBookmarkLoading}
          aria-label={isLoved ? "Remove from favorites" : "Add to favorites"}
        >
          {isBookmarkLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
          ) : (
            <FontAwesomeIcon
              icon={isLoved ? faHeartSolid : faHeartRegular}
              className={`w-5 h-5 ${isHeartAnimating ? (isLoved ? "heart-pop-out" : "heart-pop-in") : ""}`}
            />
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{event.name}</h3>
          {event.price && (
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded">
              {typeof event.price === "number" ? `$${event.price}` : event.price}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="flex-1">
              {event.available_tickets} / {event.capacity} tickets
            </span>
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${ticketPercentage <= 20 ? "bg-red-500" : ticketPercentage <= 50 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${ticketPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Rating display */}
          {event.rating > 0 && <div className="flex items-center text-sm">{renderRating(event.rating)}</div>}
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={handleShowMore}
            className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            <span>Details</span>
            <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5 ml-1" />
          </button>

          <button
            onClick={handleBooking}
            disabled={event.available_tickets <= 0}
            className="flex items-center px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faTicketAlt} className="w-4 h-4 mr-1.5" />
            <span>{event.available_tickets > 0 ? "Book Now" : "Sold Out"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

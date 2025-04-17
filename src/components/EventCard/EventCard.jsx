"use client"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeart as faHeartSolid,
  faTicketAlt,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faStar as faStarSolid,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import { useWishlist } from "../../context/WishlistContext"
import { useToast } from "../../context/ToastContext"
import { useState, useEffect } from "react"

// Import the dedicated CSS file
import "./EventCard.css"

export function EventCard({ event }) {
  const { isInWishlist, getBookmarkIdByEventId, toggleWishlist } = useWishlist()
  const navigate = useNavigate()
  const toast = useToast()
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isLoved = isInWishlist(event.id)
  const bookmarkId = getBookmarkIdByEventId(event.id)

  // Handle image loading
  useEffect(() => {
    const img = new Image()
    img.src = event.image_path || event.image || "/placeholder.svg"
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageError(true)
  }, [event.image_path, event.image])

  // Get image source with fallback
  const getImageSource = () => {
    if (imageError) return "/placeholder.svg"
    return event.image_path || event.image || "/placeholder.svg"
  }

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

  const handleCardClick = () => {
    navigate(`/eventDetails/${event.id}`)
  }

  const handleBooking = (e) => {
    e.preventDefault()
    e.stopPropagation()
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
      <div className="event-rating">
        <div className="event-rating-stars">{stars}</div>
        <span className="event-rating-value">({rating.toFixed(1)})</span>
      </div>
    )
  }

  // Format date for better display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString // Return original if not valid date
      }
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="event-card" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="event-image-container">
        {!imageLoaded && !imageError ? (
          <div className="image-placeholder"></div>
        ) : (
          <img
            src={getImageSource() || "/placeholder.svg"}
            alt={event.name}
            className="event-image"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg"
              setImageError(true)
            }}
          />
        )}

        {/* Overlay with category and wishlist */}
        <div className="event-image-overlay">
          {event.category && <span className="event-category-badge">{event.category}</span>}

          <button
            className={`event-wishlist-button ${isLoved ? "active" : ""} ${isHeartAnimating ? "heart-animation" : ""}`}
            onClick={handleLoveClick}
            disabled={isBookmarkLoading}
            aria-label={isLoved ? "Remove from favorites" : "Add to favorites"}
          >
            {isBookmarkLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" />
            ) : (
              <FontAwesomeIcon
                icon={isLoved ? faHeartSolid : faHeartRegular}
                className={`w-4 h-4 ${isHeartAnimating ? (isLoved ? "heart-pop-out" : "heart-pop-in") : ""}`}
              />
            )}
          </button>
        </div>

        {/* Date badge */}
        <div className="event-date-badge">
          <div className="event-date">
            <FontAwesomeIcon icon={faCalendarAlt} className="event-date-icon" />
            {formatDate(event.date)}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="event-content">
        {/* Price and Rating */}
        <div className="event-price-rating">
          {event.price && (
            <div className="event-price">
              ${typeof event.price === "number" ? event.price.toFixed(2) : Number.parseFloat(event.price).toFixed(2)}
            </div>
          )}

          {event.rating > 0 && renderRating(event.rating)}
        </div>

        {/* Title */}
        <h3 className="event-title">{event.name}</h3>

        {/* Description */}
        <p className="event-description">{event.description}</p>

        {/* Event Details */}
        <div className="event-details">
          <div className="event-location">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="event-detail-icon" />
            <span className="event-location-text">{event.location}</span>
          </div>

          <div className="event-tickets">
            <FontAwesomeIcon icon={faUsers} className="event-detail-icon" />
            <span>
              {event.available_tickets} / {event.capacity} tickets
            </span>
          </div>
        </div>

        {/* Ticket Availability Bar */}
        <div className="ticket-bar-container">
          <div
            className={`ticket-bar-progress ${ticketPercentage <= 20
              ? "ticket-bar-low"
              : ticketPercentage <= 50
                ? "ticket-bar-medium"
                : "ticket-bar-high"
              }`}
            style={{ width: `${ticketPercentage}%` }}
          ></div>
        </div>

        {/* Book Now Button */}
        <button onClick={handleBooking} disabled={event.available_tickets <= 0} className="book-button">
          <FontAwesomeIcon icon={faTicketAlt} className="book-button-icon" />
          <span>{event.available_tickets > 0 ? "Book Now" : "Sold Out"}</span>
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeart as faHeartSolid,
  faTicketAlt,
  faChevronRight,
  faCalendarAlt,
  faMapMarkerAlt,
  faStar as faStarSolid,
  faSpinner,
  faFire,
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useEvents } from "../../context/EventsContext"

const HotEvents = () => {
  const { getHotEvents, bookmarks, toggleBookmark, loading } = useEvents()
  const [bookmarkLoading, setBookmarkLoading] = useState({})
  const navigate = useNavigate()

  // Get hot events from context
  const hotEvents = getHotEvents(6)

  // Toggle bookmark status
  const handleLoveClick = async (e, eventId) => {
    e.stopPropagation()
    setBookmarkLoading((prev) => ({ ...prev, [eventId]: true }))
    try {
      await toggleBookmark(eventId)
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [eventId]: false }))
    }
  }

  // Custom arrows for navigation
  const CustomArrow = ({ onClick, direction }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 text-purple-700 dark:text-purple-400 ${direction === "left" ? "left-4" : "right-4"
        }`}
      onClick={onClick}
    >
      {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
    </motion.div>
  )

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-1 mt-6"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-purple-200 rounded-full hover:bg-purple-400 transition-colors"></div>
    ),
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
        <span className="text-xs text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
      </div>
    )
  }

  const handleEventClick = (eventId) => {
    navigate(`/eventDetails/${eventId}`)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex justify-between items-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <FontAwesomeIcon icon={faFire} className="text-red-500 mr-2" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">Hot Events</span>
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-full shadow-md hover:shadow-lg transition-all"
          onClick={() => navigate("/events?sortBy=rating")}
        >
          View All
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="relative">
            <FontAwesomeIcon icon={faSpinner} spin className="text-purple-600 dark:text-purple-400 text-4xl" />
            <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-30"></div>
          </div>
        </div>
      ) : (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
          <Slider {...settings}>
            {hotEvents.map((event, index) => (
              <motion.div key={event.id} variants={itemVariants} className="px-3 py-3">
                <motion.div
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => handleEventClick(event.id)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.name}
                      className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {event.category && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        {event.category}
                      </span>
                    )}

                    {/* Hot badge */}
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center">
                      <FontAwesomeIcon icon={faFire} className="mr-1" />
                      Hot
                    </span>

                    {/* Love button */}
                    <AnimatePresence mode="wait">
                      <motion.button
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`absolute bottom-3 right-3 p-3 rounded-full bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 shadow-md transition-colors ${bookmarks[event.id] ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                          }`}
                        onClick={(e) => handleLoveClick(e, event.id)}
                        disabled={bookmarkLoading[event.id]}
                      >
                        {bookmarkLoading[event.id] ? (
                          <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                        ) : (
                          <FontAwesomeIcon
                            icon={bookmarks[event.id] ? faHeartSolid : faHeartRegular}
                            className={`w-5 h-5 ${bookmarks[event.id] ? "heart-pop-in" : ""}`}
                          />
                        )}
                      </motion.button>
                    </AnimatePresence>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {event.name}
                      </h3>
                      {event.price !== undefined && (
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-semibold px-3 py-1 rounded-full">
                          {typeof event.price === "number" ? `$${event.price.toFixed(2)}` : event.price}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 group-hover:line-clamp-none transition-all duration-300">
                      {event.description}
                    </p>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400"
                        />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400"
                        />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">{renderRating(event.rating || 0)}</div>
                    </div>

                    <div className="flex justify-between gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full transition-colors flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event.id)
                        }}
                      >
                        <span>Details</span>
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event.id)
                        }}
                      >
                        <FontAwesomeIcon icon={faTicketAlt} className="w-4 h-4 mr-1.5" />
                        <span>Book Now</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </Slider>
        </motion.div>
      )}
    </div>
  )
}

export default HotEvents


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
  faSpinner,
  faFire,
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useEvents } from "../../context/EventsContext"

const HotEvents = () => {
  const { getHotEvents, bookmarks, toggleBookmark, loading } = useEvents()
  const [bookmarkLoading, setBookmarkLoading] = useState({})
  const navigate = useNavigate()

  const hotEvents = getHotEvents(6)

  const handleLoveClick = async (e, eventId) => {
    e.stopPropagation()
    setBookmarkLoading((prev) => ({ ...prev, [eventId]: true }))
    try {
      await toggleBookmark(eventId)
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [eventId]: false }))
    }
  }

  const CustomArrow = ({ onClick, direction }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 text-purple-700 dark:text-purple-400 backdrop-blur-sm ${direction === "left" ? "left-4" : "right-4"
        }`}
      onClick={onClick}
    >
      {direction === "left" ? (
        <FaArrowLeft className="text-lg" />
      ) : (
        <FaArrowRight className="text-lg" />
      )}
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
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } },
    ],
    appendDots: (dots) => (
      <div className="mt-8">
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2.5 h-2.5 bg-purple-200 rounded-full hover:bg-purple-400 transition-all duration-300"></div>
    ),
  }

  const handleEventClick = (eventId) => {
    navigate(`/eventDetails/${eventId}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex justify-between items-center mb-12"
      >
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 rounded-full blur-md opacity-75 animate-pulse"></div>
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center shadow-lg">
              <FontAwesomeIcon
                icon={faFire}
                className="text-white text-xl animate-bounce"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ml-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
              Hot Events
            </span>
            <div className="h-1 w-16 mt-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-full"></div>
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 8px 25px -5px rgba(239, 68, 68, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-full shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex items-center group"
          onClick={() => navigate("/events?sortBy=rating")}
        >
          View All
          <span className="ml-2 group-hover:translate-x-1 transition-transform">
            <FontAwesomeIcon icon={faChevronRight} />
          </span>
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative w-20 h-20"
          >
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-amber-500 border-b-transparent animate-spin-reverse"></div>
            <div className="absolute inset-4 rounded-full border-4 border-red-500 border-l-transparent animate-spin"></div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="relative"
        >
          <Slider {...settings}>
            {hotEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                className="px-3 py-3 group"
              >
                <motion.div
                  whileHover={{
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => handleEventClick(event.id)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-full cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300 relative"
                >
                  {/* Ribbon for Hot Event */}
                  <div className="absolute -right-8 top-4 w-32 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold py-1 px-2 transform rotate-45 z-10 shadow-md">
                    Trending
                  </div>

                  <div className="relative overflow-hidden">
                    <img
                      src={event.image_path || "/placeholder.svg"}
                      alt={event.name}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {event.category && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                        {event.category}
                      </span>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.button
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`absolute bottom-3 right-3 p-3 rounded-full bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 shadow-lg transition-all ${bookmarks[event.id]
                          ? "text-red-500 shadow-red-500/20"
                          : "text-gray-700 dark:text-gray-300"
                          }`}
                        onClick={(e) => handleLoveClick(e, event.id)}
                        disabled={bookmarkLoading[event.id]}
                      >
                        {bookmarkLoading[event.id] ? (
                          <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            className="w-5 h-5"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={
                              bookmarks[event.id] ? faHeartSolid : faHeartRegular
                            }
                            className={`w-5 h-5 ${bookmarks[event.id] ? "heart-pop-in" : ""
                              }`}
                          />
                        )}
                      </motion.button>
                    </AnimatePresence>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {event.name}
                      </h3>
                      {event.price !== undefined && (
                        <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2">
                          {typeof event.price === "number"
                            ? `$${event.price.toFixed(2)}`
                            : event.price}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-5 group-hover:line-clamp-none transition-all duration-300">
                      {event.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 px-4 py-2.5 text-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-all duration-300 flex items-center justify-center border border-gray-200 dark:border-gray-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event.id)
                        }}
                      >
                        <span>Details</span>
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg group"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event.id)
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTicketAlt}
                          className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform"
                        />
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
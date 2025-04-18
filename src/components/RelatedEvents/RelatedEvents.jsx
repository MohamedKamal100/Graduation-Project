import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarAlt, faMapMarkerAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons"

const RelatedEvents = ({ events }) => {
  if (!events || events.length === 0) return null

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
        damping: 10,
      },
    },
  }

  // Function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg"

    if (imagePath.startsWith("http")) {
      return imagePath
    }

    return `http://127.0.0.1:8000${imagePath}`
  }

  // Function to handle image error
  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Related Events
        </h2>
        <Link
          to="/events"
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center"
        >
          View All
          <FontAwesomeIcon icon={faArrowRight} className="ml-1 w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <Link to={`/eventDetails/${event.id}`} className="block">
              <div className="relative h-32 overflow-hidden">
                <img
                  src={getImageUrl(event.image_path || event.image)}
                  alt={event.name || event.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                {event.category && (
                  <div className="absolute top-2 left-2 bg-purple-600/80 text-white text-xs px-2 py-0.5 rounded-full">
                    {event.category}
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                  {event.name || event.title}
                </h3>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-1">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 mr-1" />
                  <span>{event.date || event.event_date || "TBA"}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 mr-1" />
                  <span className="line-clamp-1">{event.location || "TBA"}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default RelatedEvents

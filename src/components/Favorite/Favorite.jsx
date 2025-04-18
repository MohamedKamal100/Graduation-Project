
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeart,
  faSpinner,
  faFilter,
  faSort,
  faSearch,
  faSadTear,
  faArrowLeft,
  faChevronUp,
  faChevronDown,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { EventCard } from "../EventCard/EventCard"
import { useWishlist } from "../../context/WishlistContext"
import { useEvents } from "../../context/EventsContext"
import { useQuery } from "@tanstack/react-query"
import styles from "./Favorite.module.css"
import { motion } from "framer-motion"

const Favorite = () => {
  const navigate = useNavigate()
  const { favorites, refreshWishlist } = useWishlist()
  const { events, getEvents } = useEvents()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filterCategory, setFilterCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageLoadErrors, setImageLoadErrors] = useState({})
  const isDarkMode = document.documentElement.classList.contains("dark")

  // Use React Query to fetch favorites
  const {
    data: favoritesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      return await refreshWishlist()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  })

  // Use React Query to fetch events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      return await getEvents()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  })

  // Extract categories from events
  useEffect(() => {
    if (events && events.length > 0) {
      const uniqueCategories = [...new Set(events.map((event) => event.category).filter(Boolean))]
      setCategories(uniqueCategories)
    }
  }, [events])

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  // Get favorite events with details
  const getFavoriteEventsWithDetails = () => {
    if (!favorites || !events) return []

    return favorites
      .map((favorite) => {
        const eventDetails = events.find((event) => event.id === favorite.event_id)
        if (!eventDetails) return null

        return {
          ...eventDetails,
          bookmarkId: favorite.id,
          // Ensure image_path is used if available
          image: eventDetails.image_path || eventDetails.image || "/placeholder.svg?height=300&width=400",
        }
      })
      .filter(Boolean)
  }

  // Filter and sort favorite events
  const getFilteredAndSortedFavorites = () => {
    let filteredFavorites = getFavoriteEventsWithDetails()

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filteredFavorites = filteredFavorites.filter(
        (event) =>
          event.name.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search),
      )
    }

    // Apply category filter
    if (filterCategory) {
      filteredFavorites = filteredFavorites.filter((event) => event.category === filterCategory)
    }

    // Apply sorting
    filteredFavorites.sort((a, b) => {
      let comparison = 0

      switch (sortOption) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "date":
          comparison = new Date(a.date) - new Date(b.date)
          break
        case "price":
          const priceA = typeof a.price === "string" ? Number.parseFloat(a.price) : a.price || 0
          const priceB = typeof b.price === "string" ? Number.parseFloat(b.price) : b.price || 0
          comparison = priceA - priceB
          break
        default:
          comparison = new Date(a.date) - new Date(b.date)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return filteredFavorites
  }

  // Handle booking ticket
  const handleBookingClick = (eventId) => {
    navigate(`/eventDetails/${eventId}`)
  }

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  // Handle image error
  const handleImageError = (eventId) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [eventId]: true,
    }))
  }

  const filteredFavorites = getFilteredAndSortedFavorites()

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

  // Render skeleton loaders
  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      ))
  }

  return (
    <div className={`${styles.pageContainer} ${isDarkMode ? styles.darkPageContainer : ""}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`${styles.heartIcon} mr-3 ${isRefreshing ? styles.heartbeatAnimation : ""}`}
                />
                My Favorites
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Events you've saved for later</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/events")}
                className="flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Browse Events
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon
                  icon={faSpinner}
                  className={`mr-2 ${isRefreshing || isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters and search */}
        {!isLoading && favorites && favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${styles.filterContainer} ${isDarkMode ? styles.darkFilterContainer : ""}`}
          >
            <div className={styles.filterRow}>
              <div className={`${styles.searchInput} ${isDarkMode ? styles.darkSearchInput : ""}`}>
                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className={`${styles.filterSelect} ${isDarkMode ? styles.darkFilterSelect : ""}`}>
                <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.filterSelect} ${isDarkMode ? styles.darkFilterSelect : ""}`}>
                <FontAwesomeIcon icon={faSort} className={styles.filterIcon} />
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>

              <button
                onClick={toggleSortDirection}
                className={`${styles.sortButton} ${isDarkMode ? styles.darkSortButton : ""}`}
              >
                <FontAwesomeIcon icon={sortDirection === "asc" ? faChevronUp : faChevronDown} />
                {sortDirection === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{renderSkeletons()}</div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-xl text-center shadow-md"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Favorites</h3>
            <p className="mb-4">{error.message || "An error occurred while loading your favorites."}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refetch}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`${styles.emptyState} ${isDarkMode ? styles.darkEmptyState : ""}`}
          >
            <FontAwesomeIcon icon={faSadTear} className={styles.emptyIcon} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No favorites yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't saved any events to your favorites yet.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </motion.button>
          </motion.div>
        ) : filteredFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-8 rounded-lg text-center"
          >
            <h3 className="text-xl font-semibold mb-2">No matching favorites</h3>
            <p className="mb-6">No favorites match your current search or filter criteria.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("")
              }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Favorites count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm text-gray-500 dark:text-gray-400 mb-4"
            >
              {filteredFavorites.length} favorite{filteredFavorites.length !== 1 ? "s" : ""}
              {filterCategory && ` in ${filterCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </motion.p>

            {/* Favorites grid */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className={styles.cardGrid}>
              {filteredFavorites.map((event, index) => {
                // Handle image errors
                const eventWithHandledImage = {
                  ...event,
                  image: imageLoadErrors[event.id] ? "/placeholder.svg?height=300&width=400" : event.image,
                }

                return (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    className={`${styles.cardItem} ${styles.staggerItem}`}
                  >
                    <EventCard
                      event={eventWithHandledImage}
                      onBookingClick={handleBookingClick}
                      onImageError={() => handleImageError(event.id)}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorite

"use client"

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
} from "@fortawesome/free-solid-svg-icons"
import { EventCard } from "../EventCard/EventCard"
import { useWishlist } from "../../context/WishlistContext"
import { useEvents } from "../../context/EventsContext"

const Favorite = () => {
  const { favorites, loading, error, refreshWishlist } = useWishlist()
  const { events, loading: eventsLoading } = useEvents()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filterCategory, setFilterCategory] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [categories, setCategories] = useState([])

  // Refresh wishlist on component mount
  useEffect(() => {
    refreshWishlist()
  }, [])

  // Extract categories from events
  useEffect(() => {
    if (events && events.length > 0) {
      const uniqueCategories = [...new Set(events.map((event) => event.category).filter(Boolean))]
      setCategories(uniqueCategories)
    }
  }, [events])

  // Handle refresh
  const handleRefresh = async () => {
    console.log("Refreshing favorites...")
    setIsRefreshing(true)
    await refreshWishlist()
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
        return eventDetails ? { ...eventDetails, bookmarkId: favorite.id } : null
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
          comparison = a.price - b.price
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
    console.log(`Navigating to booking page for event ${eventId}...`)
    navigate(`/booking/${eventId}`)
  }

  // Toggle sort direction
  const toggleSortDirection = () => {
    console.log(`Changing sort direction from ${sortDirection} to ${sortDirection === "asc" ? "desc" : "asc"}`)
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const filteredFavorites = getFilteredAndSortedFavorites()

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 animate-fadeIn">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <FontAwesomeIcon
                icon={faHeart}
                className={`text-red-500 mr-3 ${isRefreshing ? "animate-heartbeat" : ""}`}
              />
              My Favorites
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Events you've saved for later</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/events")}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Browse Events
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className={`flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors ${loading || isRefreshing ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <FontAwesomeIcon icon={faSpinner} className={`mr-2 ${isRefreshing || loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters and search */}
        {!loading && favorites.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 animate-slideInBottom">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon
                    icon={faFilter}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                  </select>
                  <FontAwesomeIcon
                    icon={faSort}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>

                <button
                  onClick={toggleSortDirection}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {sortDirection === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fadeIn">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg text-center animate-fadeIn">
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center animate-fadeIn">
            <FontAwesomeIcon icon={faSadTear} className="text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p>You haven't saved any events to your favorites yet.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </button>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-8 rounded-lg text-center animate-fadeIn">
            <h3 className="text-xl font-semibold mb-2">No matching favorites</h3>
            <p>No favorites match your current search or filter criteria.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("")
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Favorites count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 animate-fadeIn">
              {filteredFavorites.length} favorite{filteredFavorites.length !== 1 ? "s" : ""}
              {filterCategory && ` in ${filterCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>

            {/* Favorites grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((event, index) => (
                <div
                  key={event.id}
                  className={`stagger-item animate-scaleIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <EventCard event={event} onBookingClick={handleBookingClick} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorite

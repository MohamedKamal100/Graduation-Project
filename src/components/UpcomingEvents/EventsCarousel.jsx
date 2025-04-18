"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faTicketAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { fetchEvents } from "../../api/eventsApi"

export default function EventsCarousel() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [visibleEvents, setVisibleEvents] = useState([])

  // Color schemes for cards
  const colorSchemes = [
    { bg: "from-pink-500 to-purple-600", text: "text-pink-100", hover: "hover:from-pink-600 hover:to-purple-700" },
    { bg: "from-blue-500 to-indigo-600", text: "text-blue-100", hover: "hover:from-blue-600 hover:to-indigo-700" },
    { bg: "from-green-500 to-teal-600", text: "text-green-100", hover: "hover:from-green-600 hover:to-teal-700" },
    {
      bg: "from-yellow-500 to-orange-600",
      text: "text-yellow-100",
      hover: "hover:from-yellow-600 hover:to-orange-700",
    },
    {
      bg: "from-purple-500 to-indigo-600",
      text: "text-purple-100",
      hover: "hover:from-purple-600 hover:to-indigo-700",
    },
    { bg: "from-red-500 to-pink-600", text: "text-red-100", hover: "hover:from-red-600 hover:to-pink-700" },
  ]

  // Fetch events from API
  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true)
        const data = await fetchEvents()

        // Filter events with images and sort by date
        const eventsWithImages = data
          .filter((event) => event.image_path || event.cover_image || event.thumbnail)
          .sort((a, b) => {
            const dateA = new Date(a.date || a.event_date || "2099-01-01")
            const dateB = new Date(b.date || b.event_date || "2099-01-01")
            return dateA - dateB
          })
          .slice(0, 6) // Limit to 6 events

        if (eventsWithImages.length > 0) {
          setEvents(eventsWithImages)
        } else {
          setEvents(getFallbackEvents())
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events")
        setEvents(getFallbackEvents())
        setLoading(false)
      }
    }

    getEvents()
  }, [])

  // Create infinite loop effect by duplicating events for display
  useEffect(() => {
    if (events.length > 0) {
      // Create a circular array for infinite scrolling effect
      const duplicatedEvents = [...events, ...events, ...events] // Triplicate the events
      setVisibleEvents(duplicatedEvents)
      // Start from the middle set to allow backward and forward scrolling
      setActiveIndex(events.length)
    }
  }, [events])

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || events.length <= 1) return

    const interval = setInterval(() => {
      handleNext()
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused, events.length, activeIndex])

  // Helper function to get image URL
  const getImageUrl = (event) => {
    if (event.image_path) {
      return event.image_path.startsWith("http") ? event.image_path : `http://127.0.0.1:8000${event.image_path}`
    }

    if (event.cover_image) return event.cover_image
    if (event.thumbnail) return event.thumbnail

    return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "TBA"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  // Fallback events
  const getFallbackEvents = () => [
    {
      id: 1,
      title: "Summer Music Festival",
      description: "Experience the ultimate music festival with top artists",
      date: "2025-07-15",
      location: "Central Park, New York",
      category: "Music",
      price: "$89",
      image_path: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Tech Conference 2025",
      description: "Join industry leaders and innovators",
      date: "2025-08-10",
      location: "Convention Center, San Francisco",
      category: "Technology",
      price: "$199",
      image_path: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Food & Wine Festival",
      description: "Taste exquisite cuisine and fine wines",
      date: "2025-09-05",
      location: "Riverfront Plaza, Chicago",
      category: "Food",
      price: "$75",
      image_path: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Art Exhibition",
      description: "Discover breathtaking artworks from talented artists",
      date: "2025-10-20",
      location: "Metropolitan Museum, London",
      category: "Art",
      price: "$45",
      image_path: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Comedy Night Special",
      description: "Laugh out loud with top comedians",
      date: "2025-11-15",
      location: "Laugh Factory, Los Angeles",
      category: "Comedy",
      price: "$60",
      image_path: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "Winter Dance Festival",
      description: "Celebrate the season with amazing performances",
      date: "2025-12-10",
      location: "Grand Theater, Boston",
      category: "Dance",
      price: "$85",
      image_path: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop",
    },
  ]

  const handleNext = () => {
    setActiveIndex((prev) => {
      const newIndex = prev + 1
      // If we reach the end of the triplicated array, jump back to the middle set
      if (newIndex >= events.length * 3 - 3) {
        return events.length
      }
      return newIndex
    })
  }

  const handlePrev = () => {
    setActiveIndex((prev) => {
      const newIndex = prev - 1
      // If we reach the beginning of the triplicated array, jump to the end of the middle set
      if (newIndex < 3) {
        return events.length * 2 - 4
      }
      return newIndex
    })
  }

  // Get the actual index in the original events array
  const getOriginalIndex = (index) => {
    return index % events.length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-900 rounded-xl">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="mb-2">Failed to load events</p>
          <button onClick={() => window.location.reload()} className="text-purple-500 hover:text-purple-700 underline">
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md flex items-center justify-center text-white transition-all duration-300"
              aria-label="Previous events"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md flex items-center justify-center text-white transition-all duration-300"
              aria-label="Next events"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex -mx-3 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${(activeIndex * 100) / 4}%)` }}
          >
            {visibleEvents.map((event, index) => {
              const originalIndex = getOriginalIndex(index)
              const colorScheme = colorSchemes[originalIndex % colorSchemes.length]

              return (
                <div key={`${event.id}-${index}`} className="w-full md:w-1/4 px-3 flex-shrink-0">
                  <Link
                    to={`/eventDetails/${event.id}`}
                    className="block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: originalIndex * 0.1 }}
                      whileHover={{
                        y: -10,
                        transition: { duration: 0.2 },
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      className="rounded-2xl overflow-hidden h-64 relative"
                    >
                      {/* Colorful background gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bg} ${colorScheme.hover} transition-all duration-300`}
                      ></div>

                      {/* Content container */}
                      <div className="relative h-full flex flex-col">
                        {/* Image section */}
                        <div className="h-40 overflow-hidden">
                          <motion.div
                            className="w-full h-full relative"
                            animate={{
                              scale: hoveredIndex === index ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            <img
                              src={getImageUrl(event) || "/placeholder.svg"}
                              alt={event.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src =
                                  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
                              }}
                            />

                            {/* Enhanced image overlay */}
                            <AnimatePresence>
                              {hoveredIndex === index && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"
                                />
                              )}
                            </AnimatePresence>
                          </motion.div>

                          {/* Date badge */}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold text-gray-800 shadow-md">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            {formatDate(event.date || event.event_date)}
                          </div>

                          {/* Category badge */}
                          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold text-white shadow-md">
                            {event.category || "Event"}
                          </div>
                        </div>

                        {/* Details section */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">{event.title}</h3>
                            <div className="flex items-center text-xs mb-2 text-white/80">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                              <span className="line-clamp-1">{event.location || "Location TBA"}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-white">
                              <FontAwesomeIcon icon={faTicketAlt} className="mr-1" />
                              {event.price || "Free"}
                            </div>

                            <AnimatePresence>
                              {hoveredIndex === index && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  className="text-white text-sm font-medium flex items-center"
                                >
                                  View Details
                                  <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                                  >
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index + events.length)} // Set to the middle set
                className={`h-2 rounded-full transition-all duration-300 ${getOriginalIndex(activeIndex) === index
                    ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                    : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

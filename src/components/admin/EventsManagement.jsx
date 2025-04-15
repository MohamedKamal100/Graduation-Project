"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlus,
  faSearch,
  faSpinner,
  faExclamationTriangle,
  faEye,
  faEdit,
  faTrash,
  faChevronDown,
  faChevronUp,
  faCalendarAlt,
  faMapMarkerAlt,
  faTicketAlt,
  faDollarSign,
  faInfoCircle,
  faSort,
  faSortUp,
  faSortDown,
  faFilter,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { fetchAllEvents, deleteEvent } from "../../api/adminApi"
import { useToast } from "../../context/ToastContext"

const EventsManagement = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [expandedEventId, setExpandedEventId] = useState(null)
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage] = useState(10)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterAndSortEvents()
  }, [events, searchTerm, categoryFilter, sortField, sortDirection])

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllEvents()
      setEvents(data)
      setFilteredEvents(data)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError("Failed to load events. Please try again.")
      toast.error("Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortEvents = () => {
    let filtered = [...events]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((event) => event.category === categoryFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle dates
      if (sortField === "date") {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }

      // Handle nulls
      if (aValue === null) return sortDirection === "asc" ? -1 : 1
      if (bValue === null) return sortDirection === "asc" ? 1 : -1

      // Compare values
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setFilteredEvents(filtered)
  }

  const handleDeleteEvent = async (eventId, eventName) => {
    if (window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      try {
        await deleteEvent(eventId)
        toast.success(`Event "${eventName}" deleted successfully`)
        // Update the events list
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId))
      } catch (error) {
        console.error("Error deleting event:", error)
        toast.error("Failed to delete event. Please try again.")
      }
    }
  }

  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
    return sortDirection === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="ml-1 text-blue-500" />
    ) : (
      <FontAwesomeIcon icon={faSortDown} className="ml-1 text-blue-500" />
    )
  }

  // Get unique categories for filter dropdown
  const categories = [...new Set(events.map((event) => event.category))].filter(Boolean)

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 animate-fadeIn">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Events Management</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage all your events from here</p>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Filters
          </button>

          <button
            onClick={() => navigate("/admin/events/create")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Expanded filters */}
      <div
        className={`p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${isFilterExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden p-0"
          }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value)
                setSortDirection("asc")
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="price">Price</option>
              <option value="available_tickets">Available Tickets</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Direction</label>
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("")
              setSortField("date")
              setSortDirection("desc")
            }}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-2xl animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl mb-4 animate-bounce" />
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">Event {getSortIcon("name")}</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">Date {getSortIcon("date")}</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 hidden md:table-cell"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center">Price {getSortIcon("price")}</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No events found
                  </td>
                </tr>
              ) : (
                currentEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <tr
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {event.image ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
                                src={event.image || "/placeholder.svg"}
                                alt={event.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium transition-transform duration-200 group-hover:scale-110">
                                {event.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{event.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{event.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex flex-col">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${event.available_tickets > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              } transition-all duration-200 group-hover:shadow-md mb-1`}
                          >
                            {event.available_tickets > 0 ? "Available" : "Sold Out"}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {event.available_tickets} / {event.capacity} tickets
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
                            <div
                              className="h-1.5 rounded-full bg-blue-600 dark:bg-blue-500"
                              style={{ width: `${(event.available_tickets / event.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${Number.parseFloat(event.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => navigate(`/eventDetails/${event.id}`)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 transform hover:scale-110"
                            title="View Event"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 transform hover:scale-110"
                            title="Edit Event"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => toggleEventDetails(event.id)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200 transform hover:scale-110"
                            title={expandedEventId === event.id ? "Hide Details" : "Show Details"}
                          >
                            <FontAwesomeIcon icon={expandedEventId === event.id ? faChevronUp : faChevronDown} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id, event.name)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 transform hover:scale-110"
                            title="Delete Event"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedEventId === event.id && (
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan="6" className="px-6 py-4 animate-fadeIn">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Date & Time:
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                                {new Date(event.date).toLocaleDateString()} at{" "}
                                {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location:</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6 break-words">
                                {event.location}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faTicketAlt} className="text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tickets:</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                                {event.available_tickets} available out of {event.capacity} total
                              </p>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 ml-6">
                                <div
                                  className="h-1.5 rounded-full bg-blue-600 dark:bg-blue-500"
                                  style={{ width: `${(event.available_tickets / event.capacity) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faDollarSign} className="text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Price:</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                                ${Number.parseFloat(event.price).toFixed(2)}
                              </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Description:
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6 break-words">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredEvents.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Showing <span className="font-medium">{indexOfFirstEvent + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastEvent, filteredEvents.length)}</span> of{" "}
            <span className="font-medium">{filteredEvents.length}</span> events
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 border ${currentPage === pageNum
                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    } rounded-md transition-colors duration-200`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsManagement

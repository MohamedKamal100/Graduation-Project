"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarAlt,
  faUsers,
  faTicketAlt,
  faChartLine,
  faPlus,
  faSearch,
  faFilter,
  faSpinner,
  faCog,
  faBell,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { UserContext } from "../../context/UserContext"
import { useToast } from "../../context/ToastContext"
import api from "../../api/eventsApi"
import { fetchDashboardStats } from "../../api/adminApi"

const Dashboard = () => {
  const { handleLogout } = useContext(UserContext)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalTickets: 0,
    revenue: 0,
  })
  const navigate = useNavigate()
  const toast = useToast()

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Filter events based on search term
  useEffect(() => {
    if (events.length > 0) {
      setFilteredEvents(
        events.filter(
          (event) =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }

    if (users.length > 0) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [events, users, searchTerm])

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Try to fetch dashboard stats from the API
      let statsData = {}
      try {
        statsData = await fetchDashboardStats()
      } catch (err) {
        console.warn("Could not fetch dashboard stats, using fallback data")
      }

      // Fetch events
      const eventsResponse = await api.get("/events")
      setEvents(eventsResponse.data)
      setFilteredEvents(eventsResponse.data)

      // Fetch users
      const usersResponse = await api.get("/users")
      setUsers(usersResponse.data)
      setFilteredUsers(usersResponse.data)

      // Set statistics
      setStats({
        totalEvents: statsData.totalEvents || eventsResponse.data.length,
        totalUsers: statsData.totalUsers || usersResponse.data.length,
        totalTickets: statsData.totalTickets || 0,
        revenue: statsData.revenue || 0,
      })
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again.")
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  // Handle create new event
  const handleCreateEvent = () => {
    navigate("/admin/events/create")
  }

  // Handle edit event
  const handleEditEvent = (eventId) => {
    navigate(`/admin/events/edit/${eventId}`)
  }

  // Handle delete event
  const handleDeleteEvent = async (eventId, eventName) => {
    if (window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      try {
        await api.delete(`/events/${eventId}`)
        toast.success(`Event "${eventName}" deleted successfully`)
        // Refresh events list
        const updatedEvents = events.filter((event) => event.id !== eventId)
        setEvents(updatedEvents)
        setFilteredEvents(updatedEvents)
      } catch (error) {
        console.error("Error deleting event:", error)
        toast.error("Failed to delete event. Please try again.")
      }
    }
  }

  // Handle view event details
  const handleViewEvent = (eventId) => {
    navigate(`/eventDetails/${eventId}`)
  }

  // Handle user actions
  const handleEditUser = (userId) => {
    navigate(`/admin/users/edit/${userId}`)
  }

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await api.delete(`/users/${userId}`)
        toast.success(`User "${userName}" deleted successfully`)
        // Refresh users list
        const updatedUsers = users.filter((user) => user.id !== userId)
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers)
      } catch (error) {
        console.error("Error deleting user:", error)
        toast.error("Failed to delete user. Please try again.")
      }
    }
  }

  // Render statistics cards
  const renderStatCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Events</h3>
            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
            <p className="ml-2 text-sm text-green-500">+12% from last month</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
            <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
              <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            <p className="ml-2 text-sm text-green-500">+8% from last month</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tickets Sold</h3>
            <span className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
              <FontAwesomeIcon icon={faTicketAlt} className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTickets}</p>
            <p className="ml-2 text-sm text-green-500">+15% from last month</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</h3>
            <span className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
              <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.revenue}</p>
            <p className="ml-2 text-sm text-green-500">+10% from last month</p>
          </div>
        </div>
      </div>
    )
  }

  // Render events table
  const renderEventsTable = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors flex items-center">
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filter
            </button>
            <button
              onClick={handleCreateEvent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create Event
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-2xl" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Tickets
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Price
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
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No events found
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={event.image || "/placeholder.svg"}
                              alt={event.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{event.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{event.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{event.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{event.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {event.available_tickets} / {event.capacity}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className="h-1.5 rounded-full bg-blue-600"
                            style={{ width: `${(event.available_tickets / event.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${Number.parseFloat(event.price).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewEvent(event.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditEvent(event.id)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id, event.name)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{filteredEvents.length}</span> of{" "}
            <span className="font-medium">{events?.length || 0}</span> events
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, Admin</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 relative">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
            <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="space-y-6">
        {renderStatCards()}
        {renderEventsTable()}
      </div>
    </div>
  )
}

export default Dashboard


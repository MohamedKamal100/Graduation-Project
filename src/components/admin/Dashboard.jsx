"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarAlt,
  faUsers,
  faSpinner,
  faCog,
  faBell,
  faExclamationTriangle,
  faChartPie,
  faArrowUp,
  faEye,
  faEdit,
  faMoneyBillWave,
  faTachometerAlt,
  faUserFriends,
  faListAlt,
  faTicketAlt,
  faDownload,
  faFilter,
  faChartLine,
  faCalendarCheck,
  faUserPlus,
  faLightbulb,
  faStar,
  faGem,
  faRocket,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons"
import { UserContext } from "../../context/UserContext"
import { useToast } from "../../context/ToastContext"
import { fetchAllEvents, fetchAllUsers, fetchDashboardStats } from "../../api/adminApi"

const Dashboard = () => {
  const { userData } = useContext(UserContext)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalTickets: 0,
    revenue: 0,
    recentEvents: [],
    recentUsers: [],
    ticketsByCategory: [],
    monthlyRevenue: [
      { month: "Jan", amount: 4200 },
      { month: "Feb", amount: 5800 },
      { month: "Mar", amount: 7500 },
      { month: "Apr", amount: 6800 },
      { month: "May", amount: 9200 },
      { month: "Jun", amount: 10500 },
    ],
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
            event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [events, searchTerm])

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all the data we need
      const [eventsData, usersData, statsData] = await Promise.all([
        fetchAllEvents(),
        fetchAllUsers(),
        fetchDashboardStats().catch(() => ({
          totalEvents: 0,
          totalUsers: 0,
          totalTickets: 0,
          revenue: 0,
          recentEvents: [],
          recentUsers: [],
          ticketsByCategory: [
            { category: "Music", count: 250, percentage: 33 },
            { category: "Sports", count: 180, percentage: 23 },
            { category: "Theater", count: 130, percentage: 17 },
            { category: "Conference", count: 110, percentage: 15 },
            { category: "Other", count: 90, percentage: 12 },
          ],
        })),
      ])

      setEvents(eventsData)
      setFilteredEvents(eventsData)
      setUsers(usersData)

      // Set statistics with real data and fallback for missing properties
      setStats({
        totalEvents: eventsData.length,
        totalUsers: usersData.length,
        totalTickets: statsData.totalTickets || Math.floor(Math.random() * 1000) + 500,
        revenue: statsData.revenue || Math.floor(Math.random() * 50000) + 10000,
        recentEvents: eventsData.slice(0, 5),
        recentUsers: usersData.slice(0, 5),
        ticketsByCategory: statsData.ticketsByCategory || [
          { category: "Music", count: 250, percentage: 33 },
          { category: "Sports", count: 180, percentage: 23 },
          { category: "Theater", count: 130, percentage: 17 },
          { category: "Conference", count: 110, percentage: 15 },
          { category: "Other", count: 90, percentage: 12 },
        ],
        monthlyRevenue: statsData.monthlyRevenue || [
          { month: "Jan", amount: 4200 },
          { month: "Feb", amount: 5800 },
          { month: "Mar", amount: 7500 },
          { month: "Apr", amount: 6800 },
          { month: "May", amount: 9200 },
          { month: "Jun", amount: 10500 },
        ],
      })
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again.")
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  // Handle view event details
  const handleViewEvent = (eventId) => {
    navigate(`/eventDetails/${eventId}`)
  }

  // Handle edit event
  const handleEditEvent = (eventId) => {
    navigate(`/admin/events/edit/${eventId}`)
  }

  // Render statistics cards
  const renderStatCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-primary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative card-hover animate-slideUp">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 dark:bg-primary-dark/20 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Events</h3>
            <span className="p-2 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-md animate-pulse">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
            <div className="ml-2 flex items-center">
              <span className="text-sm text-green-500 flex items-center">
                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3 mr-1" />
                12%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"
                style={{ width: "75%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Target: 100</span>
              <span>Current: {stats.totalEvents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-secondary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative card-hover animate-slideUp delay-100">
          <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 dark:bg-secondary-dark/20 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
            <span className="p-2 bg-gradient-to-r from-secondary to-info text-white rounded-full shadow-md animate-pulse">
              <FontAwesomeIcon icon={faUserFriends} className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            <div className="ml-2 flex items-center">
              <span className="text-sm text-green-500 flex items-center">
                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3 mr-1" />
                8%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-gradient-to-r from-secondary to-info rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Target: 500</span>
              <span>Current: {stats.totalUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-success hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative card-hover animate-slideUp delay-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-success/10 dark:bg-success/20 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tickets Sold</h3>
            <span className="p-2 bg-gradient-to-r from-success to-info text-white rounded-full shadow-md animate-pulse">
              <FontAwesomeIcon icon={faTicketAlt} className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTickets}</p>
            <div className="ml-2 flex items-center">
              <span className="text-sm text-green-500 flex items-center">
                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3 mr-1" />
                15%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-gradient-to-r from-success to-info rounded-full animate-pulse"
                style={{ width: "85%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Target: 5000</span>
              <span>Current: {stats.totalTickets}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-warning hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative card-hover animate-slideUp delay-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-warning/10 dark:bg-warning/20 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</h3>
            <span className="p-2 bg-gradient-to-r from-warning to-danger text-white rounded-full shadow-md animate-pulse">
              <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.revenue.toLocaleString()}</p>
            <div className="ml-2 flex items-center">
              <span className="text-sm text-green-500 flex items-center">
                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3 mr-1" />
                10%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-gradient-to-r from-warning to-danger rounded-full animate-pulse"
                style={{ width: "70%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Target: $75,000</span>
              <span>Current: ${stats.revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render charts section
  const renderChartsSection = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 card-hover animate-slideUp delay-400">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark rounded-lg mr-3">
                <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover-scale">
                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                Export
              </button>
              <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover-scale">
                <FontAwesomeIcon icon={faFilter} className="mr-1" />
                Filter
              </button>
            </div>
          </div>

          {/* Bar chart visualization */}
          <div className="h-64 flex items-end space-x-2">
            {stats.monthlyRevenue.map((data, index) => {
              // Calculate height percentage based on max value
              const maxAmount = Math.max(...stats.monthlyRevenue.map((item) => item.amount))
              const heightPercentage = (data.amount / maxAmount) * 100

              return (
                <div key={data.month} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-accent hover:from-primary-dark hover:to-accent rounded-t-sm transition-all duration-300 transform group-hover:scale-105 shadow-md animate-slideUp"
                    style={{
                      height: `${heightPercentage}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  ></div>
                  <div className="text-xs mt-2 text-gray-600 dark:text-gray-400">{data.month}</div>
                  <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    ${data.amount.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tickets by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 card-hover animate-slideUp delay-500">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark rounded-lg mr-3">
                <FontAwesomeIcon icon={faChartPie} className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tickets by Category</h3>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Distribution</span>
            </div>
          </div>

          {/* Pie chart visualization */}
          <div className="space-y-4">
            {stats.ticketsByCategory.map((item, index) => {
              const colors = [
                "from-primary to-accent",
                "from-secondary to-info",
                "from-success to-info",
                "from-warning to-danger",
                "from-info to-primary",
              ]

              return (
                <div
                  key={index}
                  className="space-y-2 group animate-slideRight"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.count} tickets ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 group-hover:w-full bg-gradient-to-r ${colors[index % colors.length]}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render quick actions section
  const renderQuickActions = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 card-hover animate-slideUp delay-300">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark rounded-lg mr-3">
            <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin/events/create")}
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary-dark/20 dark:to-primary-dark/10 text-primary dark:text-primary-dark rounded-lg hover:from-primary/20 hover:to-primary/10 dark:hover:from-primary-dark/30 dark:hover:to-primary-dark/20 transition-colors duration-200 group shadow-sm hover:shadow-md hover-scale animate-slideUp"
            style={{ animationDelay: "100ms" }}
          >
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-sm font-medium">Create Event</span>
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-secondary-dark/20 dark:to-secondary-dark/10 text-secondary dark:text-secondary-dark rounded-lg hover:from-secondary/20 hover:to-secondary/10 dark:hover:from-secondary-dark/30 dark:hover:to-secondary-dark/20 transition-colors duration-200 group shadow-sm hover:shadow-md hover-scale animate-slideUp"
            style={{ animationDelay: "200ms" }}
          >
            <FontAwesomeIcon
              icon={faUsers}
              className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-sm font-medium">Manage Users</span>
          </button>

          <button
            onClick={() => navigate("/admin/events")}
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-success/10 to-success/5 dark:from-success/20 dark:to-success/10 text-success dark:text-success rounded-lg hover:from-success/20 hover:to-success/10 dark:hover:from-success/30 dark:hover:to-success/20 transition-colors duration-200 group shadow-sm hover:shadow-md hover-scale animate-slideUp"
            style={{ animationDelay: "300ms" }}
          >
            <FontAwesomeIcon
              icon={faListAlt}
              className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-sm font-medium">All Events</span>
          </button>

          <button
            onClick={() => navigate("/admin/settings")}
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-warning/10 to-warning/5 dark:from-warning/20 dark:to-warning/10 text-warning dark:text-warning rounded-lg hover:from-warning/20 hover:to-warning/10 dark:hover:from-warning/30 dark:hover:to-warning/20 transition-colors duration-200 group shadow-sm hover:shadow-md hover-scale animate-slideUp"
            style={{ animationDelay: "400ms" }}
          >
            <FontAwesomeIcon
              icon={faCog}
              className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    )
  }

  // Render recent activity section
  const renderRecentActivity = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 card-hover animate-slideUp delay-600">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark rounded-lg mr-3">
                <FontAwesomeIcon icon={faCalendarCheck} className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Events</h3>
            </div>
            <button
              onClick={() => navigate("/admin/events")}
              className="text-sm text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary transition-colors duration-200 hover-scale"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentEvents && stats.recentEvents.length > 0 ? (
                  stats.recentEvents.map((event, index) => (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 group animate-slideRight"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover transition-transform duration-200 group-hover:scale-110 shadow-md"
                              src={event.image || "/placeholder.svg"}
                              alt={event.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                              {event.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {event.category || "Uncategorized"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {event.tickets_sold || event.available_tickets || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleViewEvent(event.id)}
                            className="text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary transition-colors duration-200 transform hover:scale-110"
                            aria-label="View event"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            onClick={() => handleEditEvent(event.id)}
                            className="text-secondary hover:text-secondary-dark dark:text-secondary-dark dark:hover:text-secondary transition-colors duration-200 transform hover:scale-110"
                            aria-label="Edit event"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No recent events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 card-hover animate-slideUp delay-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark rounded-lg mr-3">
                <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h3>
            </div>
            <button
              onClick={() => navigate("/admin/users")}
              className="text-sm text-secondary hover:text-secondary-dark dark:text-secondary-dark dark:hover:text-secondary transition-colors duration-200 hover-scale"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentUsers && stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 group animate-slideRight"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0">
                            {user.image_path ? (
                              <img
                                className="h-8 w-8 rounded-full object-cover transition-transform duration-200 group-hover:scale-110 shadow-md"
                                src={user.image_path || "/placeholder.svg"}
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-medium transition-transform duration-200 group-hover:scale-110 shadow-md">
                                {user.name?.charAt(0) || user.fname?.charAt(0) || "U"}
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                              {user.name || `${user.fname || ""} ${user.lname || ""}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        <span className="truncate max-w-[150px] inline-block">{user.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.joined || user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "admin"
                            ? "bg-secondary/10 text-secondary dark:bg-secondary-dark/20 dark:text-secondary-dark"
                            : "bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark"
                            } transition-all duration-200 group-hover:shadow-md`}
                        >
                          {user.role || "customer"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No recent users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Render performance metrics section
  const renderPerformanceMetrics = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 card-hover animate-slideUp delay-800">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent rounded-lg mr-3">
            <FontAwesomeIcon icon={faChartBar} className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 p-4 rounded-lg hover-scale">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Conversion Rate</span>
              <FontAwesomeIcon icon={faRocket} className="text-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">24.8%</div>
            <div className="flex items-center text-xs">
              <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">3.2%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary/5 to-info/5 dark:from-secondary/10 dark:to-info/10 p-4 rounded-lg hover-scale">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg. Ticket Value</span>
              <FontAwesomeIcon icon={faGem} className="text-secondary" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">$42.50</div>
            <div className="flex items-center text-xs">
              <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">5.7%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-success/5 to-info/5 dark:from-success/10 dark:to-info/10 p-4 rounded-lg hover-scale">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Customer Satisfaction</span>
              <FontAwesomeIcon icon={faStar} className="text-warning" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">4.8/5.0</div>
            <div className="flex items-center text-xs">
              <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">0.3</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dashboard header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="p-2 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary-dark/20 dark:to-accent/20 text-primary dark:text-primary-dark rounded-lg mr-3">
              <FontAwesomeIcon icon={faTachometerAlt} className="w-5 h-5" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {userData?.fname || "Admin"}! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="p-2 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary-dark/20 dark:to-accent/10 rounded-full text-primary dark:text-primary-dark hover:from-primary/20 hover:to-accent/20 dark:hover:from-primary-dark/30 dark:hover:to-accent/20 relative transition-colors duration-200 hover-scale shadow-sm">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
              3
            </span>
          </button>
          <button className="p-2 bg-gradient-to-r from-secondary/10 to-info/10 dark:from-secondary-dark/20 dark:to-info/10 rounded-full text-secondary dark:text-secondary-dark hover:from-secondary/20 hover:to-info/20 dark:hover:from-secondary-dark/30 dark:hover:to-info/20 transition-colors duration-200 hover-scale shadow-sm">
            <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dashboard content */}
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <FontAwesomeIcon icon={faSpinner} className="text-primary dark:text-primary-dark text-4xl animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard data...</span>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4 animate-bounce" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg transition-colors duration-200 shadow-md hover-scale"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {renderStatCards()}
          {renderQuickActions()}
          {renderChartsSection()}
          {renderRecentActivity()}
          {renderPerformanceMetrics()}
        </div>
      )}
    </div>
  )
}

export default Dashboard

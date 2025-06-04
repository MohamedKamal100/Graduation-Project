"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTicketAlt,
  faSpinner,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faPlus,
  faExclamationTriangle,
  faSort,
  faSortUp,
  faSortDown,
  faCalendarAlt,
  faUser,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons"
import { useToast } from "../../context/ToastContext"
import { fetchAllTickets, deleteTicket } from "../../api/adminApi"

const TicketsManagement = () => {
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" })
  const [filterStatus, setFilterStatus] = useState("all")
  const navigate = useNavigate()
  const toast = useToast()

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTicketsData()
  }, [])

  // Filter and sort tickets when dependencies change
  useEffect(() => {
    let result = [...tickets]

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((ticket) => ticket.status === filterStatus)
    }

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (ticket) =>
          ticket.id?.toString().includes(lowerCaseSearchTerm) ||
          ticket.event_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          ticket.user_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          ticket.ticket_type?.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredTickets(result)
  }, [tickets, searchTerm, sortConfig, filterStatus])

  // Fetch tickets data
  const fetchTicketsData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllTickets()

      // Process the data to ensure it has all required fields
      const processedData = data.map((ticket) => ({
        ...ticket,
        event_name: ticket.event_name || ticket.event?.name || "Unknown Event",
        user_name:
          ticket.user_name ||
          ticket.user?.name ||
          `${ticket.user?.fname || ""} ${ticket.user?.lname || ""}` ||
          "Unknown User",
        status: ticket.status || "active",
        created_at: ticket.created_at || new Date().toISOString(),
        price: ticket.price || ticket.amount || 0,
        ticket_type: ticket.ticket_type || "Standard",
      }))

      setTickets(processedData)
      setFilteredTickets(processedData)
    } catch (err) {
      console.error("Error fetching tickets:", err)
      setError("Failed to load tickets. Please try again.")
      toast.error("Failed to load tickets")
    } finally {
      setLoading(false)
    }
  }

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Get sort icon based on current sort state
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400 w-3 h-3" />
    return sortConfig.direction === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="ml-1 text-blue-500 w-3 h-3" />
    ) : (
      <FontAwesomeIcon icon={faSortDown} className="ml-1 text-blue-500 w-3 h-3" />
    )
  }

  // Handle ticket deletion
  const handleDeleteTicket = async (ticketId, eventName) => {
    if (window.confirm(`Are you sure you want to delete ticket #${ticketId} for "${eventName}"?`)) {
      try {
        await deleteTicket(ticketId)
        toast.success(`Ticket #${ticketId} deleted successfully`)
        // Refresh tickets list
        fetchTicketsData()
      } catch (error) {
        console.error("Error deleting ticket:", error)
        toast.error("Failed to delete ticket. Please try again.")
      }
    }
  }

  // Handle view ticket details
  const handleViewTicket = (ticketId) => {
    // Navigate to ticket details page (if implemented)
    toast.info(`View ticket #${ticketId} details`)
  }

  // Handle edit ticket
  const handleEditTicket = (ticketId) => {
    // Navigate to edit ticket page (if implemented)
    toast.info(`Edit ticket #${ticketId}`)
  }

  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "used":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "expired":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FontAwesomeIcon icon={faTicketAlt} className="mr-2 text-blue-500" />
            Tickets Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all tickets for events in your system</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => toast.info("Create ticket functionality")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets by ID, event, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white pr-8"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="used">Used</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FontAwesomeIcon
                icon={faFilter}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
            </div>
            <button
              onClick={fetchTicketsData}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tickets table */}
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading tickets data...</span>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4 animate-bounce" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={fetchTicketsData}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("id")}
                  >
                    <div className="flex items-center">Ticket ID {getSortIcon("id")}</div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("event_name")}
                  >
                    <div className="flex items-center">Event {getSortIcon("event_name")}</div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("user_name")}
                  >
                    <div className="flex items-center">User {getSortIcon("user_name")}</div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    onClick={() => requestSort("ticket_type")}
                  >
                    <div className="flex items-center">Type {getSortIcon("ticket_type")}</div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    onClick={() => requestSort("price")}
                  >
                    <div className="flex items-center">Price {getSortIcon("price")}</div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">Status {getSortIcon("status")}</div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                    onClick={() => requestSort("created_at")}
                  >
                    <div className="flex items-center">Created {getSortIcon("created_at")}</div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 mr-2" />
                          <span className="truncate max-w-[150px]">{ticket.event_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUser} className="text-purple-500 mr-2" />
                          <span className="truncate max-w-[150px]">{ticket.user_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                        {ticket.ticket_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 mr-2" />$
                          {Number.parseFloat(ticket.price).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            ticket.status,
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleViewTicket(ticket.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 transform hover:scale-110"
                            title="View ticket"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            onClick={() => handleEditTicket(ticket.id)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 transform hover:scale-110"
                            title="Edit ticket"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(ticket.id, ticket.event_name)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 transform hover:scale-110"
                            title="Delete ticket"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No tickets found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketsManagement

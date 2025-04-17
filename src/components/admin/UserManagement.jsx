"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSearch,
  faSpinner,
  faExclamationTriangle,
  faTrash,
  faUserShield,
  faUser,
  faEdit,
  faPlus,
  faEye,
  faFilter,
  faSort,
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { fetchAllUsers, updateUser, deleteUser, createUser } from "../../api/adminApi"
import { useToast } from "../../context/ToastContext"
import UserForm from "./UserForm"

const UsersManagement = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roleFilter, setRoleFilter] = useState("")
  const [showUserForm, setShowUserForm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterAndSortUsers()
  }, [users, searchTerm, roleFilter, sortField, sortDirection])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users. Please try again.")
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortUsers = () => {
    let filtered = [...users]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm),
      )
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle nested fields like fname + lname
      if (sortField === "name") {
        aValue = `${a.fname || ""} ${a.lname || ""}`.trim()
        bValue = `${b.fname || ""} ${b.lname || ""}`.trim()
      }

      // Handle dates
      if (sortField === "created_at") {
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

    setFilteredUsers(filtered)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await deleteUser(userId)
        toast.success(`User "${userName}" deleted successfully`)
        // Update the users list
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
      } catch (error) {
        console.error("Error deleting user:", error)
        toast.error("Failed to delete user. Please try again.")
      }
    }
  }

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin"
    try {
      await updateUser(user.id, { ...user, role: newRole })
      toast.success(`User role updated to ${newRole}`)
      // Update the users list
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)))
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role. Please try again.")
    }
  }

  const handleAddUser = () => {
    setCurrentUser(null)
    setIsEditing(false)
    setShowUserForm(true)
  }

  const handleEditUser = (user) => {
    setCurrentUser(user)
    setIsEditing(true)
    setShowUserForm(true)
  }

  const handleViewUser = (user) => {
    setCurrentUser(user)
    setIsEditing(false)
    setShowUserForm(true)
  }

  const handleUserFormClose = () => {
    setShowUserForm(false)
    setCurrentUser(null)
  }

  const handleUserFormSubmit = async (userData, isEdit) => {
    try {
      if (isEdit) {
        await updateUser(userData.id, userData)
        toast.success(`User "${userData.fname} ${userData.lname}" updated successfully`)
        // Update the users list
        setUsers((prevUsers) => prevUsers.map((u) => (u.id === userData.id ? userData : u)))
      } else {
        const newUser = await createUser(userData)
        toast.success(`User "${userData.fname} ${userData.lname}" created successfully`)
        // Add the new user to the list
        setUsers((prevUsers) => [...prevUsers, newUser])
      }
      setShowUserForm(false)
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error(`Failed to ${isEdit ? "update" : "create"} user. Please try again.`)
    }
  }

  // Get unique roles for filter dropdown
  const roles = [...new Set(users.map((user) => user.role))].filter(Boolean)

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 animate-fadeIn">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users Management</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage all your users from here</p>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
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
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add User
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
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
              <option value="email">Email</option>
              <option value="created_at">Join Date</option>
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
              setRoleFilter("")
              setSortField("created_at")
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
                  <div className="flex items-center">User {getSortIcon("name")}</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">Email {getSortIcon("email")}</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Role
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
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">Joined {getSortIcon("created_at")}</div>
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
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.image_path ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
                              src={user.image_path || "/placeholder.svg"}
                              alt={`${user.fname} ${user.lname}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium transition-transform duration-200 group-hover:scale-110">
                              {user.fname?.charAt(0)}
                              {user.lname?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.fname} {user.lname}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          } transition-all duration-200 group-hover:shadow-md`}
                      >
                        {user.role || "customer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 transition-all duration-200 group-hover:shadow-md">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 transform hover:scale-110"
                          title="View User"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 transform hover:scale-110"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleToggleRole(user)}
                          className={`${user.role === "admin"
                            ? "text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            : "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            } transition-colors duration-200 transform hover:scale-110`}
                          title={user.role === "admin" ? "Make Customer" : "Make Admin"}
                        >
                          <FontAwesomeIcon icon={user.role === "admin" ? faUser : faUserShield} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, `${user.fname} ${user.lname}`)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 transform hover:scale-110"
                          title="Delete User"
                        >
                          <FontAwesomeIcon icon={faTrash} />
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

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{" "}
            <span className="font-medium">{filteredUsers.length}</span> users
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

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={currentUser}
          isEditing={isEditing}
          onClose={handleUserFormClose}
          onSubmit={handleUserFormSubmit}
        />
      )}
    </div>
  )
}

export default UsersManagement

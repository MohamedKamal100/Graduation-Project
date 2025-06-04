import api from "./eventsApi"

// Admin API functions for CRUD operations

// Events CRUD
export const fetchAllEvents = async () => {
  try {
    const response = await api.get("/events")
    return response.data
  } catch (error) {
    console.error("Error fetching all events:", error)
    throw error
  }
}

export const fetchEventById = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error)
    throw error
  }
}

// First, let's fix the createEvent function to properly handle the authentication token
export const createEvent = async (eventData) => {
  try {
    // Check if eventData is FormData (for image uploads)
    if (eventData instanceof FormData) {
      // Use the fetch API directly for FormData
      const token = localStorage.getItem("token")

      // Check if token exists
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const baseUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api"

      console.log("Creating event with FormData to:", baseUrl)
      console.log("Using token:", token ? "Token exists" : "Token missing")

      // Log FormData contents for debugging
      for (const pair of eventData.entries()) {
        console.log(pair[0] + ": " + (pair[0] === "image_path" ? "File object" : pair[1]))
      }

      const response = await fetch(`${baseUrl}/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // Don't set Content-Type when sending FormData
        },
        body: eventData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error response:", errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log("API success response:", responseData)

      // Handle the API response format which includes event in a nested property
      return responseData.event || responseData
    } else {
      // Regular JSON data
      const formattedData = {
        ...eventData,
        category_id: getCategoryId(eventData.category),
      }

      const response = await api.post("/events", formattedData)

      // Handle the API response format which includes event in a nested property
      return response.data.event || response.data
    }
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

// Similarly, let's fix the updateEvent function
export const updateEvent = async (eventId, eventData) => {
  try {
    // Check if eventData is FormData (for image uploads)
    if (eventData instanceof FormData) {
      // Use the fetch API directly for FormData
      const token = localStorage.getItem("token")

      // Check if token exists
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const baseUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api"

      console.log(`Updating event ${eventId} with FormData`)
      console.log("Using token:", token ? "Token exists" : "Token missing")

      // Log FormData contents for debugging
      for (const pair of eventData.entries()) {
        console.log(pair[0] + ": " + (pair[0] === "image_path" ? "File object" : pair[1]))
      }

      const response = await fetch(`${baseUrl}/events/${eventId}`, {
        method: "POST", // Use POST with _method=PUT for Laravel
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // Don't set Content-Type when sending FormData
        },
        body: eventData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error response:", errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log("API success response:", responseData)

      // Handle the API response format which includes event in a nested property
      return responseData.event || responseData
    } else {
      // Regular JSON data
      const formattedData = {
        ...eventData,
        category_id: getCategoryId(eventData.category),
      }

      const response = await api.put(`/events/${eventId}`, formattedData)

      // Handle the API response format which includes event in a nested property
      return response.data.event || response.data
    }
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error)
    throw error
  }
}

export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error)
    throw error
  }
}

// Helper function to get category_id from category name
function getCategoryId(categoryName) {
  if (!categoryName) return 1

  const categoryMap = {
    concert: 1,
    theater: 2,
    sports: 3,
    conference: 4,
    music: 1,
    arts: 5,
    technology: 6,
    food: 7,
    business: 8,
    education: 9,
  }
  return categoryMap[categoryName.toLowerCase()] || 1
}

// Users CRUD
export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/users")
    return response.data
  } catch (error) {
    console.error("Error fetching all users:", error)
    throw error
  }
}

export const fetchUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error)
    throw error
  }
}

export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData)
    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    throw error
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    throw error
  }
}

// Tickets CRUD
export const fetchAllTickets = async () => {
  try {
    const response = await api.get("/tickets")
    return response.data
  } catch (error) {
    console.error("Error fetching all tickets:", error)
    throw error
  }
}

export const fetchTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error)
    throw error
  }
}

export const createTicket = async (ticketData) => {
  try {
    const response = await api.post("/tickets", ticketData)
    return response.data
  } catch (error) {
    console.error("Error creating ticket:", error)
    throw error
  }
}

export const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await api.put(`/tickets/${ticketId}`, ticketData)
    return response.data
  } catch (error) {
    console.error(`Error updating ticket ${ticketId}:`, error)
    throw error
  }
}

export const deleteTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/tickets/${ticketId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting ticket ${ticketId}:`, error)
    throw error
  }
}

// Dashboard statistics
export const fetchDashboardStats = async () => {
  try {
    // Fetch all the data we need for the dashboard
    const [events, users, tickets] = await Promise.all([
      fetchAllEvents(),
      fetchAllUsers(),
      fetchAllTickets().catch(() => []), // If tickets endpoint doesn't exist yet
    ])

    // Calculate statistics
    const totalEvents = events.length
    const totalUsers = users.length
    const totalTickets = tickets.length || 0

    // Calculate revenue (sum of all ticket prices)
    const revenue = tickets.reduce((sum, ticket) => sum + (Number.parseFloat(ticket.price) || 0), 0)

    // Get recent events (last 5)
    const recentEvents = [...events]
      .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
      .slice(0, 5)

    // Get recent users (last 5)
    const recentUsers = [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

    // Calculate tickets by category
    const ticketsByCategory = {}
    events.forEach((event) => {
      if (event.category) {
        if (!ticketsByCategory[event.category]) {
          ticketsByCategory[event.category] = 0
        }
        ticketsByCategory[event.category] += event.available_tickets || 0
      }
    })

    // Format tickets by category for display
    const formattedTicketsByCategory = Object.entries(ticketsByCategory).map(([category, count]) => ({
      category,
      count,
    }))

    // Calculate total tickets
    const totalCategoryTickets = formattedTicketsByCategory.reduce((sum, item) => sum + item.count, 0)

    // Add percentage to each category
    formattedTicketsByCategory.forEach((item) => {
      item.percentage = totalCategoryTickets > 0 ? Math.round((item.count / totalCategoryTickets) * 100) : 0
    })

    return {
      totalEvents,
      totalUsers,
      totalTickets,
      revenue,
      recentEvents,
      recentUsers,
      ticketsByCategory: formattedTicketsByCategory,
    }
  } catch (error) {
    console.error("Error calculating dashboard statistics:", error)
    throw error
  }
}

// Categories
export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories")
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Fallback categories if API fails
    return [
      { id: 1, name: "music" },
      { id: 2, name: "theater" },
      { id: 3, name: "sports" },
      { id: 4, name: "conference" },
      { id: 5, name: "arts" },
      { id: 6, name: "technology" },
      { id: 7, name: "food" },
      { id: 8, name: "business" },
      { id: 9, name: "education" },
    ]
  }
}

// Helper function to handle image uploads
export const uploadEventImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append("image", imageFile)

    const token = localStorage.getItem("token")
    const baseUrl = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, "")
      : "http://127.0.0.1:8000"

    const response = await fetch(`${baseUrl}/api/upload-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.path || data.url || data.image_path
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export default {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchAllUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  fetchAllTickets,
  fetchTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  fetchDashboardStats,
  fetchCategories,
  uploadEventImage,
}

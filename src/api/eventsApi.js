import axios from "axios"

// Create axios instance with base settings
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
})

// Add interceptor to attach token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API functions
export const fetchEvents = async () => {
  console.log("Fetching all events...")
  try {
    const response = await api.get("/events")
    console.log("Events fetched successfully:", response.data.length, "events")
    return response.data
  } catch (error) {
    console.error("Error fetching events:", error)
    throw error
  }
}

export const fetchEventById = async (eventId) => {
  console.log(`Fetching event with ID: ${eventId}...`)
  try {
    const response = await api.get(`/events/${eventId}`)
    console.log(`Event ${eventId} fetched successfully:`, response.data)
    return response.data
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error)
    throw error
  }
}

// Bookmark functions
export const fetchBookmarks = async () => {
  console.log("Fetching user bookmarks...")
  try {
    const response = await api.get("/mybookmarks")
    console.log("Bookmarks fetched successfully:", response.data.length, "bookmarks")
    return response.data
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    throw error
  }
}

export const addBookmark = async (eventId) => {
  console.log(`Adding event ${eventId} to bookmarks...`)
  try {
    const userId = localStorage.getItem("userId") || 1
    const response = await api.post("/bookmarks", {
      user_id: userId,
      event_id: eventId,
    })
    console.log(`Event ${eventId} added to bookmarks successfully:`, response.data)
    return response.data
  } catch (error) {
    console.error(`Error adding event ${eventId} to bookmarks:`, error)
    throw error
  }
}

export const removeBookmark = async (bookmarkId) => {
  console.log(`Removing bookmark with ID: ${bookmarkId}...`)
  try {
    const response = await api.delete(`/bookmarks/${bookmarkId}`)
    console.log(`Bookmark ${bookmarkId} removed successfully`)
    return response.data
  } catch (error) {
    console.error(`Error removing bookmark ${bookmarkId}:`, error)
    throw error
  }
}

// Helper functions
export const checkIsBookmarked = async (eventId) => {
  console.log(`Checking if event ${eventId} is bookmarked...`)
  try {
    const bookmarks = await fetchBookmarks()
    const isBookmarked = bookmarks.some((bookmark) => bookmark.event_id === eventId)
    console.log(`Event ${eventId} is${isBookmarked ? "" : " not"} bookmarked`)
    return isBookmarked
  } catch (error) {
    console.error(`Error checking bookmark status for event ${eventId}:`, error)
    return false
  }
}

export const getBookmarkIdByEventId = async (eventId) => {
  console.log(`Getting bookmark ID for event ${eventId}...`)
  try {
    const bookmarks = await fetchBookmarks()
    const bookmark = bookmarks.find((bookmark) => bookmark.event_id === eventId)
    console.log(`Bookmark ID for event ${eventId}:`, bookmark ? bookmark.id : "Not found")
    return bookmark ? bookmark.id : null
  } catch (error) {
    console.error(`Error getting bookmark ID for event ${eventId}:`, error)
    return null
  }
}

// Ticket functions
export const fetchTickets = async () => {
  console.log("Fetching user tickets...")
  try {
    const response = await api.get("/mytickets")
    console.log("Tickets fetched successfully:", response.data.length, "tickets")
    return response.data
  } catch (error) {
    console.error("Error fetching tickets:", error)
    throw error
  }
}

export const bookTicket = async (eventId, quantity = 1) => {
  console.log(`Booking ${quantity} ticket(s) for event ${eventId}...`)
  try {
    const userId = localStorage.getItem("userId") || 1

    // Try to get event price
    let price = 100 // Default price
    try {
      const event = await fetchEventById(eventId)
      if (event && event.price) {
        price = event.price
      }
    } catch (err) {
      console.warn("Could not fetch event price, using default")
    }

    console.log("Booking ticket with data:", {
      user_id: userId,
      event_id: eventId,
      quantity,
      price,
      type: "regular",
      status: "booked",
    })

    const response = await api.post("/tickets", {
      user_id: userId,
      event_id: eventId,
      quantity,
      price,
      type: "regular",
      status: "booked",
    })

    console.log("Ticket booked successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("Error booking ticket:", error)
    if (error.response) {
      console.error("Response error data:", error.response.data)
      console.error("Response status:", error.response.status)
    }
    throw error
  }
}

export const removeTicket = async (ticketId) => {
  console.log(`Removing ticket with ID: ${ticketId}...`)
  try {
    const response = await api.delete(`/tickets/${ticketId}`)
    console.log(`Ticket ${ticketId} removed successfully`)
    return response.data
  } catch (error) {
    console.error(`Error removing ticket ${ticketId}:`, error)
    throw error
  }
}

export const updateTicket = async (ticketId, ticketData) => {
  console.log(`Updating ticket with ID: ${ticketId}...`, ticketData)
  try {
    const response = await api.put(`/tickets/${ticketId}`, ticketData)
    console.log(`Ticket ${ticketId} updated successfully:`, response.data)
    return response.data
  } catch (error) {
    console.error(`Error updating ticket ${ticketId}:`, error)
    throw error
  }
}

export default api

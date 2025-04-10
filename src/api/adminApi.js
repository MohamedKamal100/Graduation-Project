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

export const createEvent = async (eventData) => {
  try {
    const response = await api.post("/events", eventData)
    return response.data
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData)
    return response.data
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
    const response = await api.get("/admin/stats")
    return response.data
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error)
    // Return mock data if API endpoint doesn't exist yet
    return {
      totalEvents: 0,
      totalUsers: 0,
      totalTickets: 0,
      revenue: 0,
    }
  }
}

// Reviews CRUD
export const fetchAllReviews = async () => {
  try {
    const response = await api.get("/reviews")
    return response.data
  } catch (error) {
    console.error("Error fetching all reviews:", error)
    throw error
  }
}

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, reviewData)
    return response.data
  } catch (error) {
    console.error(`Error updating review ${reviewId}:`, error)
    throw error
  }
}

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error)
    throw error
  }
}

// Payments CRUD
export const fetchAllPayments = async () => {
  try {
    const response = await api.get("/payments")
    return response.data
  } catch (error) {
    console.error("Error fetching all payments:", error)
    throw error
  }
}

export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await api.put(`/payments/${paymentId}`, paymentData)
    return response.data
  } catch (error) {
    console.error(`Error updating payment ${paymentId}:`, error)
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
  createUser,
  updateUser,
  deleteUser,
  fetchAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  fetchDashboardStats,
  fetchAllReviews,
  updateReview,
  deleteReview,
  fetchAllPayments,
  updatePayment,
  fetchCategories,
}


// import axios from "axios"

// // إنشاء نسخة من axios مع الإعدادات الأساسية
// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// })

// // إضافة interceptor لإرفاق التوكن مع كل طلب
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// // دوال للتعامل مع API
// export const fetchEvents = async () => {
//   const response = await api.get("/events")
//   return response.data
// }

// export const fetchBookmarks = async () => {
//   const response = await api.get("/bookmarks")
//   return response.data
// }

// export const fetchTickets = async () => {
//   const response = await api.get("/mytickets") // Updated endpoint
//   return response.data
// }

// export const addBookmark = async (eventId) => {
//   const response = await api.post("/bookmarks", { event_id: eventId })
//   return response.data
// }

// export const removeBookmark = async (eventId) => {
//   const response = await api.delete(`/bookmarks/${eventId}`)
//   return response.data
// }

// export const bookTicket = async (eventId, quantity = 1) => {
//   const response = await api.post("/tickets", {
//     event_id: eventId,
//     quantity,
//   })
//   return response.data
// }

// export default api



// import axios from "axios"

// // إنشاء نسخة من axios مع الإعدادات الأساسية
// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// })

// // إضافة interceptor لإرفاق التوكن مع كل طلب
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// // دوال للتعامل مع API
// export const fetchEvents = async () => {
//   const response = await api.get("/events")
//   return response.data
// }

// export const fetchBookmarks = async () => {
//   const response = await api.get("/bookmarks")
//   return response.data
// }

// export const fetchTickets = async () => {
//   const response = await api.get("/mytickets") // Correct endpoint
//   return response.data
// }

// export const addBookmark = async (eventId) => {
//   const response = await api.post("/bookmarks", { event_id: eventId })
//   return response.data
// }

// export const removeBookmark = async (eventId) => {
//   const response = await api.delete(`/bookmarks/${eventId}`)
//   return response.data
// }

// export const bookTicket = async (eventId, quantity = 1) => {
//   const response = await api.post("/tickets", {
//     // Correct endpoint
//     event_id: eventId,
//     quantity,
//   })
//   return response.data
// }

// export default api


// *---------------------------------------------------------
// import axios from "axios"

// // إنشاء نسخة من axios مع الإعدادات الأساسية
// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// })

// // إضافة interceptor لإرفاق التوكن مع كل طلب
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// // دوال للتعامل مع API
// export const fetchEvents = async () => {
//   const response = await api.get("/events")
//   return response.data
// }

// // Add a specific function to fetch a single event by ID

// // Add this function after the fetchEvents function:
// export const fetchEventById = async (eventId) => {
//   try {
//     const response = await api.get(`/events/${eventId}`)
//     return response.data
//   } catch (error) {
//     console.error(`Error fetching event ${eventId}:`, error)
//     throw error
//   }
// }

// export const fetchBookmarks = async () => {
//   const response = await api.get("/bookmarks")
//   return response.data
// }

// export const fetchTickets = async () => {
//   const response = await api.get("/mytickets") // Correct endpoint
//   return response.data
// }

// export const addBookmark = async (eventId) => {
//   const response = await api.post("/bookmarks", { event_id: eventId })
//   return response.data
// }

// export const removeBookmark = async (eventId) => {
//   const response = await api.delete(`/bookmarks/${eventId}`)
//   return response.data
// }

// export const bookTicket = async (eventId, quantity = 1) => {
//   const response = await api.post("/tickets", {
//     // Correct endpoint
//     event_id: eventId,
//     quantity,
//   })
//   return response.data
// }

// export default api


import axios from "axios"

// إنشاء نسخة من axios مع الإعدادات الأساسية
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
})

// إضافة interceptor لإرفاق التوكن مع كل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// دوال للتعامل مع API
export const fetchEvents = async () => {
  try {
    const response = await api.get("/events")
    return response.data
  } catch (error) {
    console.error("Error fetching events:", error)
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

// دالة لجلب المفضلة للمستخدم الحالي
export const fetchBookmarks = async () => {
  try {
    const response = await api.get("/mybookmarks")
    console.log("Fetched bookmarks:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    throw error
  }
}

// دالة لإضافة حدث إلى المفضلة
export const addBookmark = async (eventId) => {
  try {
    const userId = localStorage.getItem("userId") || 1
    const response = await api.post("/bookmarks", {
      user_id: userId,
      event_id: eventId,
    })
    console.log("Added bookmark:", response.data)
    return response.data
  } catch (error) {
    console.error("Error adding bookmark:", error)
    throw error
  }
}

// دالة لحذف حدث من المفضلة
export const removeBookmark = async (bookmarkId) => {
  try {
    const response = await api.delete(`/bookmarks/${bookmarkId}`)
    console.log("Removed bookmark:", bookmarkId)
    return response.data
  } catch (error) {
    console.error("Error removing bookmark:", error)
    throw error
  }
}

// دالة للتحقق مما إذا كان الحدث في المفضلة
export const checkIsBookmarked = async (eventId) => {
  try {
    const bookmarks = await fetchBookmarks()
    return bookmarks.some((bookmark) => bookmark.event_id === eventId)
  } catch (error) {
    console.error("Error checking bookmark status:", error)
    return false
  }
}

// دالة للحصول على معرف المفضلة من معرف الحدث
export const getBookmarkIdByEventId = async (eventId) => {
  try {
    const bookmarks = await fetchBookmarks()
    const bookmark = bookmarks.find((bookmark) => bookmark.event_id === eventId)
    return bookmark ? bookmark.id : null
  } catch (error) {
    console.error("Error getting bookmark ID:", error)
    return null
  }
}

// دالة لجلب تذاكر المستخدم الحالي
export const fetchTickets = async () => {
  try {
    const response = await api.get("/mytickets")
    console.log("Fetched tickets:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching tickets:", error)
    throw error
  }
}

// دالة لحجز تذكرة
export const bookTicket = async (eventId, quantity = 1) => {
  try {
    const userId = localStorage.getItem("userId") || 1

    // محاولة الحصول على سعر الحدث
    let price = 100 // سعر افتراضي
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
    // محاولة الحصول على رسالة الخطأ من الاستجابة
    if (error.response) {
      console.error("Response error data:", error.response.data)
      console.error("Response status:", error.response.status)
    }
    throw error
  }
}

// دالة لإلغاء تذكرة
export const removeTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/tickets/${ticketId}`)
    console.log("Ticket removed successfully:", ticketId)
    return response.data
  } catch (error) {
    console.error("Error removing ticket:", error)
    throw error
  }
}

// دالة لتحديث تذكرة
export const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await api.put(`/tickets/${ticketId}`, ticketData)
    console.log("Ticket updated successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("Error updating ticket:", error)
    throw error
  }
}

export default api


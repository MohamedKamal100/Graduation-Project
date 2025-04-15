"use client"

import { createContext, useContext, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchEvents, fetchBookmarks, fetchTickets, addBookmark, removeBookmark } from "../api/eventsApi"
import { useToast } from "./ToastContext"

// استيراد صور الفئات
import sportsImage from "../assets/sports.jpeg"
import concertImage from "../assets/concert.webp"
import theaterImage from "../assets/theatre.jpeg"
import conferenceImage from "../assets/conference.jpeg"
import defaultImage from "../assets/logo.jpeg"

// إنشاء السياق
export const EventsContext = createContext()

// Hook مخصص لاستخدام السياق
export const useEvents = () => {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error("useEvents يجب استخدامه داخل EventsProvider")
  }
  return context
}

export const EventsProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const [buttonLoadingStates, setButtonLoadingStates] = useState({})
  const [ticketQuantities, setTicketQuantities] = useState({})
  const toast = useToast()

  // دالة للحصول على صورة الفئة
  const getCategoryImage = (category) => {
    if (!category) return defaultImage

    switch (category?.toLowerCase()) {
      case "sports":
        return sportsImage
      case "concert":
        return concertImage
      case "theater":
        return theaterImage
      case "conference":
        return conferenceImage
      default:
        return defaultImage
    }
  }

  // استخدام useQuery لجلب البيانات
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  })

  const bookmarksQuery = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  })

  const ticketsQuery = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  })

  // تحويل البيانات إلى الشكل المطلوب
  const events = eventsQuery.data
    ? eventsQuery.data.map((event) => ({
      ...event,
      image: getCategoryImage(event.category),
    }))
    : []

  // تحويل المفضلة إلى كائن للوصول السريع
  const bookmarks = {}
  if (bookmarksQuery.data) {
    bookmarksQuery.data.forEach((bookmark) => {
      bookmarks[bookmark.event_id] = true
    })
  }

  // إضافة تفاصيل الفعاليات إلى التذاكر
  const tickets = ticketsQuery.data
    ? ticketsQuery.data
      .map((ticket) => {
        const event = events.find((e) => e.id === ticket.event_id)
        return {
          ...ticket,
          event: event || null,
        }
      })
      .filter((ticket) => ticket.event) // Filter out tickets with no event data
    : []

  // استخدام useMutation لإضافة مفضلة
  const addBookmarkMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      // تحديث البيانات المخزنة مؤقتًا
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
  })

  // استخدام useMutation لإزالة مفضلة
  const removeBookmarkMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      // تحديث البيانات المخزنة مؤقتًا
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
  })

  // دالة لتبديل حالة المفضلة
  const toggleBookmark = async (eventId) => {
    const event = getEventById(eventId)
    if (!event) return

    setButtonLoadingStates((prev) => ({
      ...prev,
      [`bookmark-${eventId}`]: true,
    }))

    try {
      if (bookmarks[eventId]) {
        await removeBookmarkMutation.mutateAsync(eventId)
        toast.success(`Removed "${event.name}" from favorites`)
      } else {
        await addBookmarkMutation.mutateAsync(eventId)
        toast.success(`Added "${event.name}" to favorites`)
      }
    } catch (error) {
      toast.error("Failed to update favorites. Please try again.")
    } finally {
      setButtonLoadingStates((prev) => ({
        ...prev,
        [`bookmark-${eventId}`]: false,
      }))
    }
  }

  // Function to update ticket quantity
  const updateTicketQuantity = (eventId, quantity) => {
    if (quantity < 1) quantity = 1
    setTicketQuantities((prev) => ({
      ...prev,
      [eventId]: quantity,
    }))
  }

  // Function to get current ticket quantity for an event
  const getTicketQuantity = (eventId) => {
    return ticketQuantities[eventId] || 1
  }

  // Function to calculate total price
  const calculateTotalPrice = (event, quantity = 1) => {
    if (!event || typeof event.price !== "number") return 0
    return event.price * quantity
  }

  // Function to navigate to event details
  const handleViewDetails = (eventId, navigate) => {
    if (navigate) {
      navigate(`/eventDetails/${eventId}`)
    }
  }

  // دالة للحصول على فعالية بواسطة المعرف
  const getEventById = (id) => {
    return events.find((event) => event.id === Number.parseInt(id) || event.id === id) || null
  }

  // Function to get hot events (top rated)
  const getHotEvents = (limit = 6) => {
    return [...events].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit)
  }

  // Function to get favorite events
  const getFavoriteEvents = () => {
    return events.filter((event) => bookmarks[event.id])
  }

  // دالة لتصفية الفعاليات حسب المعايير
  const filterEvents = (criteria = {}) => {
    const { searchTerm, category, location, dateFilter, sortBy } = criteria

    let filtered = [...events]

    // تطبيق فلتر البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) => event.name?.toLowerCase().includes(term) || event.description?.toLowerCase().includes(term),
      )
    }

    // تطبيق فلتر الفئة
    if (category) {
      filtered = filtered.filter((event) => event.category?.toLowerCase() === category.toLowerCase())
    }

    // تطبيق فلتر الموقع
    if (location) {
      filtered = filtered.filter((event) => event.location === location)
    }

    // تطبيق فلتر التاريخ
    if (dateFilter) {
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)
      const nextMonth = new Date()
      nextMonth.setMonth(today.getMonth() + 1)

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date)

        switch (dateFilter) {
          case "today":
            return eventDate.toDateString() === today.toDateString()
          case "thisWeek":
            return eventDate >= today && eventDate <= nextWeek
          case "thisMonth":
            return eventDate >= today && eventDate <= nextMonth
          default:
            return true
        }
      })
    }

    // تطبيق الترتيب
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name)
          case "date":
            return new Date(a.date) - new Date(b.date)
          case "rating":
            return (b.rating || 0) - (a.rating || 0)
          case "price":
            return (a.price || 0) - (b.price || 0)
          default:
            return 0
        }
      })
    }

    return filtered
  }

  // الحصول على جميع المواقع الفريدة
  const getLocations = () => {
    return [...new Set(events.map((event) => event.location))]
  }

  // تحديد حالة التحميل والخطأ
  const loading = eventsQuery.isLoading || bookmarksQuery.isLoading || ticketsQuery.isLoading

  const error = eventsQuery.error?.message || bookmarksQuery.error?.message || ticketsQuery.error?.message || null

  // قيمة السياق
  const value = {
    events,
    bookmarks,
    tickets,
    loading,
    error,
    buttonLoadingStates,
    ticketQuantities,
    toggleBookmark,
    handleViewDetails,
    getEventById,
    getHotEvents,
    getFavoriteEvents,
    filterEvents,
    getLocations,
    getCategoryImage,
    updateTicketQuantity,
    getTicketQuantity,
    calculateTotalPrice,
  }

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export default EventsProvider

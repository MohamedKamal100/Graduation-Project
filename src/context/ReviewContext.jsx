"use client"
import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useUser } from "./UserContext"
import { useToast } from "./ToastContext"

const ReviewContext = createContext()

export const useReview = () => useContext(ReviewContext)

export default function ReviewProvider({ children }) {
  const [userReviews, setUserReviews] = useState({})
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const toast = useToast()

  // Fetch user reviews when user logs in
  useEffect(() => {
    if (user) {
      fetchUserReviews()
    }
  }, [user])

  // Fetch all reviews for the current user
  const fetchUserReviews = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Convert array to object with event_id as key
      const reviewsObj = {}
      response.data.forEach((review) => {
        reviewsObj[review.event_id] = Number.parseInt(review.rating)
      })

      setUserReviews(reviewsObj)
    } catch (error) {
      console.error("Error fetching user reviews:", error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // Add or update a review
  const addReview = async (eventId, rating) => {
    if (!user) {
      toast.error("Please login to rate this event")
      return false
    }

    setLoading(true)
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/reviews",
        {
          event_id: eventId,
          rating: rating.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      // Update local state
      setUserReviews((prev) => ({
        ...prev,
        [eventId]: rating,
      }))

      toast.success(rating === 1 ? "Added to your favorites!" : "Removed from your favorites")
      return true
    } catch (error) {
      console.error("Error adding review:", error.response?.data || error.message)
      toast.error("Failed to update rating. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Check if user has reviewed an event
  const hasReviewed = (eventId) => {
    return userReviews[eventId] === 1
  }

  // Get user's rating for an event
  const getUserRating = (eventId) => {
    return userReviews[eventId] || 0
  }

  const value = {
    userReviews,
    loading,
    addReview,
    hasReviewed,
    getUserRating,
    fetchUserReviews,
  }

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
}

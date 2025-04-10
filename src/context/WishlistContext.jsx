// "use client"

// import { createContext, useContext, useState, useEffect } from "react"
// import { fetchBookmarks, addBookmark, removeBookmark } from "../api/eventsApi"
// import { useToast } from "./ToastContext"

// export const WishlistContext = createContext()

// export const useWishlist = () => {
//   const context = useContext(WishlistContext)
//   if (!context) {
//     throw new Error("useWishlist must be used within a WishlistProvider")
//   }
//   return context
// }

// const WishlistProvider = ({ children }) => {
//   const [favorites, setFavorites] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [buttonLoadingStates, setButtonLoadingStates] = useState({})
//   const toast = useToast()

//   // Fetch user's bookmarks on component mount
//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       getUserWishlist()
//     }
//   }, [])

//   // Get user's wishlist
//   const getUserWishlist = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const data = await fetchBookmarks()
//       setFavorites(data)
//     } catch (error) {
//       console.error("Error fetching wishlist:", error)
//       setError("Failed to load favorites. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Add to wishlist
//   const addToWishlist = async (eventId, eventName) => {
//     setButtonLoadingStates((prev) => ({
//       ...prev,
//       [`add-${eventId}`]: true,
//     }))
//     try {
//       await addBookmark(eventId)
//       await getUserWishlist() // Refresh the list
//       toast.success(`Added "${eventName}" to favorites`)
//       return true
//     } catch (error) {
//       console.error("Error adding to wishlist:", error)
//       toast.error("Failed to add to favorites. Please try again.")
//       return false
//     } finally {
//       setButtonLoadingStates((prev) => ({
//         ...prev,
//         [`add-${eventId}`]: false,
//       }))
//     }
//   }

//   // Remove from wishlist
//   const removeFromWishlist = async (bookmarkId, eventName) => {
//     setButtonLoadingStates((prev) => ({
//       ...prev,
//       [`remove-${bookmarkId}`]: true,
//     }))
//     try {
//       await removeBookmark(bookmarkId)
//       // Update state optimistically
//       setFavorites((prev) => prev.filter((favorite) => favorite.id !== bookmarkId))
//       toast.success(eventName ? `Removed "${eventName}" from favorites` : "Removed from favorites")
//       return true
//     } catch (error) {
//       console.error("Error removing from wishlist:", error)
//       toast.error("Failed to remove from favorites. Please try again.")
//       return false
//     } finally {
//       setButtonLoadingStates((prev) => ({
//         ...prev,
//         [`remove-${bookmarkId}`]: false,
//       }))
//     }
//   }

//   // Check if an event is in the wishlist
//   const isInWishlist = (eventId) => {
//     return favorites.some((favorite) => favorite.event_id === eventId)
//   }

//   // Get bookmark ID by event ID
//   const getBookmarkIdByEventId = (eventId) => {
//     const bookmark = favorites.find((favorite) => favorite.event_id === eventId)
//     return bookmark ? bookmark.id : null
//   }

//   // Toggle wishlist status
//   const toggleWishlist = async (eventId, eventName) => {
//     const bookmarkId = getBookmarkIdByEventId(eventId)

//     if (bookmarkId) {
//       return await removeFromWishlist(bookmarkId, eventName)
//     } else {
//       return await addToWishlist(eventId, eventName)
//     }
//   }

//   const value = {
//     favorites,
//     loading,
//     error,
//     buttonLoadingStates,
//     addToWishlist,
//     removeFromWishlist,
//     isInWishlist,
//     getBookmarkIdByEventId,
//     toggleWishlist,
//     refreshWishlist: getUserWishlist,
//   }

//   return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
// }

// export default WishlistProvider


"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "./ToastContext"

export const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

const WishlistProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [buttonLoadingStates, setButtonLoadingStates] = useState({})
  const toast = useToast()

  // Fetch user's bookmarks on component mount
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserWishlist()
    }
  }, [])

  // Get user's wishlist
  const getUserWishlist = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://127.0.0.1:8000/api/mybookmarks")
      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.status}`)
      }
      const data = await response.json()
      console.log("Fetched bookmarks:", data)
      setFavorites(data)
      return data
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      setError("Failed to load favorites. Please try again.")
      return []
    } finally {
      setLoading(false)
    }
  }

  // Add to wishlist
  const addToWishlist = async (eventId, eventName) => {
    setButtonLoadingStates((prev) => ({
      ...prev,
      [`add-${eventId}`]: true,
    }))
    try {
      const response = await fetch("http://127.0.0.1:8000/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("userId") || 1,
          event_id: eventId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to add bookmark: ${response.status}`)
      }

      const data = await response.json()
      console.log("Add bookmark response:", data)

      await getUserWishlist() // Refresh the list
      toast.success(`Added "${eventName}" to favorites`)
      return true
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast.error("Failed to add to favorites. Please try again.")
      return false
    } finally {
      setButtonLoadingStates((prev) => ({
        ...prev,
        [`add-${eventId}`]: false,
      }))
    }
  }

  // Remove from wishlist
  const removeFromWishlist = async (bookmarkId, eventName) => {
    setButtonLoadingStates((prev) => ({
      ...prev,
      [`remove-${bookmarkId}`]: true,
    }))
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to remove bookmark: ${response.status}`)
      }

      console.log("Removed bookmark with ID:", bookmarkId)

      // Update state optimistically
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== bookmarkId))
      toast.success(eventName ? `Removed "${eventName}" from favorites` : "Removed from favorites")
      return true
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove from favorites. Please try again.")
      return false
    } finally {
      setButtonLoadingStates((prev) => ({
        ...prev,
        [`remove-${bookmarkId}`]: false,
      }))
    }
  }

  // Check if an event is in the wishlist
  const isInWishlist = (eventId) => {
    return favorites.some((favorite) => favorite.event_id === eventId)
  }

  // Get bookmark ID by event ID
  const getBookmarkIdByEventId = (eventId) => {
    const bookmark = favorites.find((favorite) => favorite.event_id === eventId)
    return bookmark ? bookmark.id : null
  }

  // Toggle wishlist status
  const toggleWishlist = async (eventId, eventName) => {
    const bookmarkId = getBookmarkIdByEventId(eventId)

    if (bookmarkId) {
      return await removeFromWishlist(bookmarkId, eventName)
    } else {
      return await addToWishlist(eventId, eventName)
    }
  }

  const value = {
    favorites,
    loading,
    error,
    buttonLoadingStates,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getBookmarkIdByEventId,
    toggleWishlist,
    refreshWishlist: getUserWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export default WishlistProvider


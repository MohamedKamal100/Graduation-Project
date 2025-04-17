// "use client"
// import { useState, useEffect } from "react"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faStar as faStarSolid, faSpinner } from "@fortawesome/free-solid-svg-icons"
// import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
// import { useToast } from "../../context/ToastContext"
// import { useUser } from "../../context/UserContext"
// import axios from "axios"
// import "./ReviewStars.css"

// const ReviewStars = ({ eventId, initialRating = 0, totalReviews = 0, onRatingChange, readOnly = false }) => {
//   const [rating, setRating] = useState(initialRating === 1)
//   const [isLoading, setIsLoading] = useState(false)
//   const [animateIndex, setAnimateIndex] = useState(null)
//   const [reviewCount, setReviewCount] = useState(totalReviews)
//   const toast = useToast()
//   const { userData } = useUser()

//   useEffect(() => {
//     // Update rating when initialRating prop changes
//     setRating(initialRating === 1)
//   }, [initialRating])

//   const handleRatingClick = async () => {
//     if (readOnly || !userData) {
//       toast.error("Please login to rate this event")
//       return
//     }

//     setIsLoading(true)
//     const newRating = rating ? 0 : 1 // Toggle between 0 and 1

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/review",
//         {
//           event_id: eventId,
//           rating: newRating.toString(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       )

//       if (response.data) {
//         // Update local state
//         setRating(newRating === 1)
//         setAnimateIndex(0)

//         // Update review count
//         if (newRating === 1) {
//           setReviewCount((prev) => prev + 1)
//         } else {
//           setReviewCount((prev) => Math.max(0, prev - 1))
//         }

//         // Notify parent component
//         if (onRatingChange) {
//           onRatingChange(newRating)
//         }

//         toast.success(newRating === 1 ? "Added to your favorites!" : "Removed from your favorites")
//       }
//     } catch (error) {
//       console.error("Error updating review:", error.response?.data || error.message)
//       toast.error("Failed to update rating. Please try again.")
//     } finally {
//       setIsLoading(false)

//       // Reset animation after a delay
//       setTimeout(() => {
//         setAnimateIndex(null)
//       }, 500)
//     }
//   }

//   return (
//     <div className="review-stars-container">
//       <div
//         className={`review-star ${rating ? "active" : "inactive"} ${isLoading ? "review-star-loading" : ""} ${animateIndex === 0 ? "star-pop" : ""
//           }`}
//         onClick={handleRatingClick}
//       >
//         <FontAwesomeIcon icon={rating ? faStarSolid : faStarRegular} className="w-5 h-5" />
//         {isLoading && <FontAwesomeIcon icon={faSpinner} spin className="review-star-spinner w-3 h-3" />}
//         <div className="review-tooltip">{rating ? "Remove from favorites" : "Add to favorites"}</div>
//       </div>
//       <span className="review-count">({reviewCount})</span>
//     </div>
//   )
// }

// export default ReviewStars

"use client"
import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar as faStarSolid, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import { useToast } from "../../context/ToastContext"
import { useUser } from "../../context/UserContext"
import axios from "axios"
import "./ReviewStars.css"

const ReviewStars = ({ eventId, initialRating = 0, totalReviews = 0, onRatingChange, readOnly = false }) => {
  // Use useRef to track if this is the first render
  const isFirstRender = useRef(true)
  const [rating, setRating] = useState(initialRating === 1)
  const [isLoading, setIsLoading] = useState(false)
  const [animateIndex, setAnimateIndex] = useState(null)
  const [reviewCount, setReviewCount] = useState(totalReviews)
  const toast = useToast()
  const { userData } = useUser()

  // Only update rating from props on first render or when initialRating changes
  useEffect(() => {
    // Skip the effect on first render since we already set the initial state
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Only update if initialRating has actually changed
    const newRatingState = initialRating === 1
    if (rating !== newRatingState) {
      setRating(newRatingState)
    }
  }, [initialRating])

  const handleRatingClick = async () => {
    if (readOnly || !userData) {
      toast.error("Please login to rate this event")
      return
    }

    setIsLoading(true)
    const newRating = rating ? 0 : 1 // Toggle between 0 and 1

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/reviews",
        {
          event_id: eventId,
          rating: newRating.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.data) {
        // Update local state
        setRating(newRating === 1)
        setAnimateIndex(0)

        // Update review count
        if (newRating === 1) {
          setReviewCount((prev) => prev + 1)
        } else {
          setReviewCount((prev) => Math.max(0, prev - 1))
        }

        // Notify parent component
        if (onRatingChange) {
          onRatingChange(newRating)
        }

        toast.success(newRating === 1 ? "Added to your favorites!" : "Removed from your favorites")
      }
    } catch (error) {
      console.error("Error updating review:", error.response?.data || error.message)
      toast.error("Failed to update rating. Please try again.")
    } finally {
      setIsLoading(false)

      // Reset animation after a delay
      setTimeout(() => {
        setAnimateIndex(null)
      }, 500)
    }
  }

  return (
    <div className="review-stars-container">
      <div
        className={`review-star ${rating ? "active" : "inactive"} ${isLoading ? "review-star-loading" : ""} ${animateIndex === 0 ? "star-pop" : ""
          }`}
        onClick={handleRatingClick}
      >
        <FontAwesomeIcon
          icon={rating ? faStarSolid : faStarRegular}
          className="w-5 h-5"
          style={{ color: rating ? "#facc15" : undefined }} // Explicitly set yellow color when active
        />
        {isLoading && <FontAwesomeIcon icon={faSpinner} spin className="review-star-spinner w-3 h-3" />}
        <div className="review-tooltip">{rating ? "Remove from favorites" : "Add to favorites"}</div>
      </div>
      <span className="review-count">({reviewCount})</span>
    </div>
  )
}

export default ReviewStars

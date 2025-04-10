// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faHeart as faHeartSolid, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
// import { EventCard } from "../EventCard/EventCard"

// const Favorite = () => {
//   const [favorites, setFavorites] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       setLoading(true)
//       setError(null)

//       try {
//         // Fetch bookmarks
//         const bookmarksResponse = await axios.get("http://127.0.0.1:8000/api/bookmarks", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         // If there are no bookmarks, set empty array and return
//         if (!bookmarksResponse.data || bookmarksResponse.data.length === 0) {
//           setFavorites([])
//           setLoading(false)
//           return
//         }

//         // Fetch all events
//         const eventsResponse = await axios.get("http://127.0.0.1:8000/api/events", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         // Create a map of event IDs to event data
//         const eventsMap = {}
//         eventsResponse.data.forEach((event) => {
//           eventsMap[event.id] = event
//         })

//         // Map bookmarks to their corresponding events
//         const favoriteEvents = bookmarksResponse.data.map((bookmark) => eventsMap[bookmark.event_id]).filter(Boolean) // Filter out any undefined events

//         setFavorites(favoriteEvents)
//       } catch (error) {
//         console.error("❌ Error fetching favorites:", error.response?.data || error.message)
//         setError("Failed to load your favorite events. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchFavorites()
//   }, [])

//   const handleRemoveFavorite = async (eventId) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/bookmarks/${eventId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })

//       // Remove the event from the favorites list
//       setFavorites(favorites.filter((event) => event.id !== eventId))
//     } catch (error) {
//       console.error("Error removing favorite:", error)
//     }
//   }

//   const handleBookingClick = (eventId) => {
//     navigate(`/booking/${eventId}`)
//   }

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
//             <FontAwesomeIcon icon={faHeartSolid} className="text-red-500 mr-3" />
//             My Favorites
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">Events you've saved to your favorites list</p>
//         </div>

//         {/* Loading state */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
//             <p className="text-gray-600 dark:text-gray-400">Loading your favorites...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg text-center">
//             {error}
//           </div>
//         ) : favorites.length === 0 ? (
//           <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center">
//             <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
//             <p>You haven't added any events to your favorites list.</p>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//               onClick={() => navigate("/")}
//             >
//               Browse Events
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Favorites count */}
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               {favorites.length} favorite event{favorites.length !== 1 ? "s" : ""}
//             </p>

//             {/* Favorites grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {favorites.map((event) => (
//                 <div key={event.id} className="relative group">
//                   <EventCard event={event} onBookingClick={handleBookingClick} />
//                   <button
//                     className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                     onClick={() => handleRemoveFavorite(event.id)}
//                     title="Remove from favorites"
//                   >
//                     <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Favorite
//! --------------------------------------------------------------------
"use client"

import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { EventCard } from "../EventCard/EventCard"
import { useEvents } from "../../context/EventsContext"

const Favorite = () => {
  const { getFavoriteEvents, loading, error } = useEvents()
  const navigate = useNavigate()

  // Get favorite events
  const favoriteEvents = getFavoriteEvents()

  // Handle booking ticket
  const handleBookingClick = (eventId) => {
    navigate(`/booking/${eventId}`)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-3" />
            My Favorites
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Events you've saved for later</p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : favoriteEvents.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p>You haven't saved any events to your favorites yet.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </button>
          </div>
        ) : (
          <>
            {/* Favorites count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {favoriteEvents.length} favorite{favoriteEvents.length !== 1 ? "s" : ""}
            </p>

            {/* Favorites grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteEvents.map((event) => (
                <EventCard key={event.id} event={event} onBookingClick={handleBookingClick} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorite

//! -------------------------------------------------------




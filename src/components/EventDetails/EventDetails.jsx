// "use client"
// import { useParams, useNavigate } from "react-router-dom"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faHeart as faHeartSolid,
//   faCalendarAlt,
//   faMapMarkerAlt,
//   faUsers,
//   faStar as faStarSolid,
//   faSpinner,
//   faClock,
//   faTag,
//   faArrowLeft,
//   faShare,
//   faInfoCircle,
//   faMinus,
//   faPlus,
//   faExclamationTriangle,
//   faShoppingCart,
// } from "@fortawesome/free-solid-svg-icons"
// import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
// import { useEvents } from "../../context/EventsContext"
// import { useToast } from "../../context/ToastContext"
// import { useWishlist } from "../../context/WishlistContext"
// import { useState, useEffect } from "react"

// const EventDetails = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const toast = useToast()
//   const { getEventById } = useEvents()
//   const { isInWishlist, getBookmarkIdByEventId, toggleWishlist } = useWishlist()

//   const [isLoading, setIsLoading] = useState(true)
//   const [event, setEvent] = useState(null)
//   const [error, setError] = useState(null)
//   const [quantity, setQuantity] = useState(1)
//   const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

//   useEffect(() => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       // Get event directly from context
//       const eventData = getEventById(id)

//       if (eventData) {
//         setEvent(eventData)
//       } else {
//         setError("Event not found")
//       }
//     } catch (err) {
//       console.error("Error loading event:", err)
//       setError("Failed to load event details")
//     } finally {
//       setIsLoading(false)
//     }
//   }, [id, getEventById])

//   const isLoved = event ? isInWishlist(event.id) : false
//   const totalPrice = event ? event.price * quantity : 0

//   const handleLoveClick = async () => {
//     if (!event) return
//     setIsBookmarkLoading(true)
//     await toggleWishlist(event.id, event.name)
//     setIsBookmarkLoading(false)
//   }

//   const handleProceedToCheckout = () => {
//     if (!event) return
//     if (event.available_tickets < quantity) {
//       toast.error(`Only ${event.available_tickets} tickets available`)
//       return
//     }

//     // Navigate to checkout with event and quantity information
//     navigate(`/checkout/${event.id}`, { state: { event, quantity } })
//   }

//   const handleQuantityChange = (newQuantity) => {
//     if (newQuantity < 1) newQuantity = 1
//     if (event && newQuantity > event.available_tickets) {
//       newQuantity = event.available_tickets
//       toast.warning(`Maximum available tickets: ${event.available_tickets}`)
//     }
//     setQuantity(newQuantity)
//   }

//   // Function to render star rating
//   const renderRating = (rating) => {
//     const stars = []
//     const fullStars = Math.floor(rating)
//     const hasHalfStar = rating % 1 >= 0.5

//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStarSolid} className="text-yellow-400" />)
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(
//           <span key={`half-star`} className="relative">
//             <FontAwesomeIcon icon={faStarRegular} className="text-gray-300 dark:text-gray-600" />
//             <span className="absolute top-0 left-0 overflow-hidden w-1/2">
//               <FontAwesomeIcon icon={faStarSolid} className="text-yellow-400" />
//             </span>
//           </span>,
//         )
//       } else {
//         stars.push(
//           <FontAwesomeIcon key={`empty-${i}`} icon={faStarRegular} className="text-gray-300 dark:text-gray-600" />,
//         )
//       }
//     }

//     return (
//       <div className="flex items-center">
//         <div className="flex mr-1">{stars}</div>
//         <span className="text-sm text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
//       </div>
//     )
//   }

//   if (isLoading) {
//     return (
//       <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col items-center justify-center py-12">
//             <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
//             <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error || !event) {
//     return (
//       <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col items-center justify-center py-12">
//             <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl mb-4" />
//             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Event Not Found</h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               {error || "The event you're looking for could not be found."}
//             </p>
//             <button
//               onClick={() => navigate("/events")}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//             >
//               Browse Events
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const ticketPercentage = (event.available_tickets / event.capacity) * 100

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
//       {/* Hero section with image */}
//       <div className="relative h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
//         <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

//         {/* Back button */}
//         <button
//           className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full transition-colors"
//           onClick={() => navigate(-1)}
//         >
//           <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
//         </button>

//         {/* Share button */}
//         <button
//           className="absolute top-4 right-16 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full transition-colors"
//           onClick={() => {
//             navigator.clipboard.writeText(window.location.href)
//             toast.info("Link copied to clipboard!")
//           }}
//         >
//           <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
//         </button>

//         {/* Favorite button */}
//         <button
//           className={`absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full transition-colors ${isLoved ? "text-red-500" : "text-gray-800 dark:text-gray-200"} ${isBookmarkLoading ? "opacity-80 cursor-wait" : ""}`}
//           onClick={handleLoveClick}
//           disabled={isBookmarkLoading}
//         >
//           {isBookmarkLoading ? (
//             <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
//           ) : (
//             <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5" />
//           )}
//         </button>

//         {/* Event title and category */}
//         <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
//           <div className="container mx-auto">
//             {event.category && (
//               <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded mb-3">
//                 {event.category}
//               </span>
//             )}
//             <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{event.name}</h1>
//             <div className="flex items-center text-white mb-4">{renderRating(event.rating || 0)}</div>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left column - Event details */}
//           <div className="lg:col-span-2">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
//               <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">{event.description}</p>

//               <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Details</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-start">
//                     <FontAwesomeIcon
//                       icon={faCalendarAlt}
//                       className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5"
//                     />
//                     <div>
//                       <h4 className="font-medium text-gray-900 dark:text-white">Date & Time</h4>
//                       <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <FontAwesomeIcon
//                       icon={faMapMarkerAlt}
//                       className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5"
//                     />
//                     <div>
//                       <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
//                       <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <FontAwesomeIcon icon={faUsers} className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
//                     <div>
//                       <h4 className="font-medium text-gray-900 dark:text-white">Capacity</h4>
//                       <p className="text-gray-600 dark:text-gray-300">
//                         {event.available_tickets} / {event.capacity} tickets available
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <FontAwesomeIcon icon={faTag} className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
//                     <div>
//                       <h4 className="font-medium text-gray-900 dark:text-white">Price</h4>
//                       <p className="text-gray-600 dark:text-gray-300">{event.price ? `$${event.price}` : "Free"}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Additional information */}
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Additional Information</h2>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <FontAwesomeIcon
//                     icon={faInfoCircle}
//                     className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5"
//                   />
//                   <div>
//                     <h4 className="font-medium text-gray-900 dark:text-white">Event Rules</h4>
//                     <p className="text-gray-600 dark:text-gray-300">
//                       Please arrive at least 30 minutes before the event starts. No refunds available after purchase.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <FontAwesomeIcon icon={faClock} className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
//                   <div>
//                     <h4 className="font-medium text-gray-900 dark:text-white">Duration</h4>
//                     <p className="text-gray-600 dark:text-gray-300">Approximately 3 hours</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right column - Booking card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Book Your Tickets</h3>

//               {/* Price */}
//               <div className="mb-4">
//                 <span className="text-3xl font-bold text-gray-900 dark:text-white">
//                   {event.price ? `$${event.price}` : "Free"}
//                 </span>
//                 <span className="text-gray-500 dark:text-gray-400 ml-2">per ticket</span>
//               </div>

//               {/* Ticket quantity selector */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Number of Tickets
//                 </label>
//                 <div className="flex items-center">
//                   <button
//                     onClick={() => handleQuantityChange(quantity - 1)}
//                     disabled={quantity <= 1}
//                     className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
//                   >
//                     <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
//                   </button>
//                   <input
//                     type="number"
//                     min="1"
//                     max={event.available_tickets}
//                     value={quantity}
//                     onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
//                     className="w-16 text-center p-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                   />
//                   <button
//                     onClick={() => handleQuantityChange(quantity + 1)}
//                     disabled={quantity >= event.available_tickets}
//                     className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
//                   >
//                     <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Total price */}
//               {event.price > 0 && (
//                 <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
//                     <span className="font-medium text-gray-900 dark:text-white">
//                       ${(event.price * quantity).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
//                     <span className="font-medium text-gray-900 dark:text-white">Total</span>
//                     <span className="font-bold text-lg text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Ticket availability */}
//               <div className="mb-6">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="text-gray-600 dark:text-gray-300">Available tickets</span>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     {event.available_tickets} / {event.capacity}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//                   <div
//                     className={`h-2.5 rounded-full ${ticketPercentage <= 20 ? "bg-red-500" : ticketPercentage <= 50 ? "bg-yellow-500" : "bg-green-500"
//                       }`}
//                     style={{ width: `${ticketPercentage}%` }}
//                   ></div>
//                 </div>
//                 {ticketPercentage <= 20 && <p className="text-red-500 text-sm mt-1">Hurry! Only a few tickets left.</p>}
//               </div>

//               {/* Proceed to checkout button */}
//               <button
//                 onClick={handleProceedToCheckout}
//                 className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors font-medium"
//                 disabled={event.available_tickets <= 0}
//               >
//                 <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 mr-2" />
//                 {event.available_tickets > 0 ? `Proceed to Checkout` : "Sold Out"}
//               </button>

//               {/* Save to favorites */}
//               <button
//                 onClick={handleLoveClick}
//                 className={`w-full flex items-center justify-center px-6 py-3 mt-3 border ${isLoved
//                   ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
//                   : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                   } rounded-lg transition-colors font-medium`}
//                 disabled={isBookmarkLoading}
//               >
//                 {isBookmarkLoading ? (
//                   <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5 mr-2" />
//                 ) : (
//                   <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5 mr-2" />
//                 )}
//                 {isLoved ? "Saved to Favorites" : "Save to Favorites"}
//               </button>

//               {/* Additional info */}
//               <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
//                 <p className="flex items-center mb-2">
//                   <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
//                   {event.date}
//                 </p>
//                 <p className="flex items-center">
//                   <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
//                   {event.location}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EventDetails


// !--------------------------------------------------------------------------------------------------


"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeart as faHeartSolid,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faStar as faStarSolid,
  faSpinner,
  faClock,
  faTag,
  faArrowLeft,
  faShare,
  faInfoCircle,
  faMinus,
  faPlus,
  faExclamationTriangle,
  faShoppingCart,
  faTicketAlt,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import { useEvents } from "../../context/EventsContext"
import { useToast } from "../../context/ToastContext"
import { useWishlist } from "../../context/WishlistContext"
import { fetchEventById } from "../../api/eventsApi"

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { getEventById, filterEvents } = useEvents()
  const { isInWishlist, getBookmarkIdByEventId, toggleWishlist } = useWishlist()

  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)
  const [isChangingQuantity, setIsChangingQuantity] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [activeTab, setActiveTab] = useState("details")
  const descriptionRef = useRef(null)
  const [totalPrice, setTotalPrice] = useState(0)

  // Fetch event data
  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // First try to get from context
        const eventFromContext = getEventById(id)

        if (eventFromContext) {
          setEvent(eventFromContext)
          // Also fetch from API to ensure we have the latest data
          try {
            const freshData = await fetchEventById(id)
            if (freshData) {
              // Merge with any additional data from API
              setEvent((prev) => ({
                ...prev,
                ...freshData,
                // Keep the image from context if API doesn't provide one
                image: freshData.image || prev.image,
              }))
            }
          } catch (err) {
            console.log("Could not refresh event data from API, using cached data")
          }
        } else {
          // If not in context, fetch directly from API
          const apiEvent = await fetchEventById(id)
          if (apiEvent) {
            setEvent(apiEvent)
          } else {
            setError("Event not found")
          }
        }
      } catch (err) {
        console.error("Error loading event:", err)
        setError("Failed to load event details")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [id, getEventById])

  // Load related events
  useEffect(() => {
    if (event && event.category) {
      // Get events from the same category
      const filtered = filterEvents({ category: event.category })
        .filter((e) => e.id !== event.id)
        .slice(0, 3)

      setRelatedEvents(filtered)
    }
  }, [event, filterEvents])

  useEffect(() => {
    if (event && typeof event.price === "number") {
      setTotalPrice(event.price * quantity)
    } else {
      setTotalPrice(0)
    }
  }, [event, quantity])

  const isLoved = event ? isInWishlist(event.id) : false

  const handleLoveClick = async () => {
    if (!event) return
    setIsBookmarkLoading(true)
    await toggleWishlist(event.id, event.name)
    setIsBookmarkLoading(false)
  }

  const handleProceedToCheckout = () => {
    if (!event) return
    if (event.available_tickets < quantity) {
      toast.error(`Only ${event.available_tickets} tickets available`)
      return
    }

    // Navigate to checkout with event and quantity information
    navigate(`/checkout/${event.id}`, { state: { event, quantity } })
  }

  const handleQuantityChange = (newQuantity) => {
    setIsChangingQuantity(true)
    if (newQuantity < 1) newQuantity = 1
    if (event && newQuantity > event.available_tickets) {
      newQuantity = event.available_tickets
      toast.warning(`Maximum available tickets: ${event.available_tickets}`)
    }

    // Animate the quantity change
    setTimeout(() => {
      setQuantity(newQuantity)
      setIsChangingQuantity(false)
    }, 150)
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
    if (!showFullDescription && descriptionRef.current) {
      setTimeout(() => {
        descriptionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }

  // Function to render star rating
  const renderRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <motion.span
            key={`star-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <FontAwesomeIcon icon={faStarSolid} className="text-yellow-400" />
          </motion.span>,
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <motion.span
            key={`half-star`}
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <FontAwesomeIcon icon={faStarRegular} className="text-gray-300 dark:text-gray-600" />
            <span className="absolute top-0 left-0 overflow-hidden w-1/2">
              <FontAwesomeIcon icon={faStarSolid} className="text-yellow-400" />
            </span>
          </motion.span>,
        )
      } else {
        stars.push(
          <motion.span
            key={`empty-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <FontAwesomeIcon icon={faStarRegular} className="text-gray-300 dark:text-gray-600" />
          </motion.span>,
        )
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-gray-500 dark:text-gray-400">({rating?.toFixed(1) || "0.0"})</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Event Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
              {error ||
                "The event you're looking for could not be found. It may have been removed or the link is incorrect."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/events")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center"
            >
              Browse Events
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  const ticketPercentage = (event.available_tickets / event.capacity) * 100

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Hero section with image */}
      <div className="relative h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: isImageLoaded ? 1 : 0,
            scale: isImageLoaded ? 1 : 1.1,
          }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={event.image || "/placeholder.svg?height=800&width=1600"}
            alt={event.name}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-full transition-colors shadow-md hover:shadow-lg"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </motion.button>

        {/* Share button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute top-4 right-16 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-full transition-colors shadow-md hover:shadow-lg"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.info("Link copied to clipboard!")
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
        </motion.button>

        {/* Favorite button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full transition-colors shadow-md hover:shadow-lg ${isLoved ? "text-red-500" : "text-gray-800 dark:text-gray-200"
            } ${isBookmarkLoading ? "opacity-80 cursor-wait" : ""}`}
          onClick={handleLoveClick}
          disabled={isBookmarkLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isBookmarkLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
          ) : (
            <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5" />
          )}
        </motion.button>

        {/* Event title and category */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
        >
          <div className="container mx-auto">
            {event.category && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="inline-block bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3"
              >
                {event.category}
              </motion.span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-md">{event.name}</h1>
            <div className="flex items-center text-white mb-4">{renderRating(event.rating || 0)}</div>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Event details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-6"
            >
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === "details"
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    } transition-colors duration-200`}
                  onClick={() => setActiveTab("details")}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  Details
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === "location"
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    } transition-colors duration-200`}
                  onClick={() => setActiveTab("location")}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  Location
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === "tickets"
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    } transition-colors duration-200`}
                  onClick={() => setActiveTab("tickets")}
                >
                  <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
                  Tickets
                </button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
                      <div ref={descriptionRef}>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed whitespace-pre-line">
                          {showFullDescription
                            ? event.description
                            : `${event.description?.substring(0, 300)}${event.description?.length > 300 ? "..." : ""}`}
                        </p>
                        {event.description?.length > 300 && (
                          <button
                            onClick={toggleDescription}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center transition-colors duration-200"
                          >
                            {showFullDescription ? "Show Less" : "Read More"}
                            <FontAwesomeIcon
                              icon={showFullDescription ? faChevronUp : faChevronDown}
                              className="ml-1 w-4 h-4"
                            />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg shadow-sm"
                        >
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800/50 rounded-full flex items-center justify-center mr-4">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</h4>
                            <p className="text-gray-900 dark:text-white font-medium">{event.date || "Not specified"}</p>
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg shadow-sm"
                        >
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800/50 rounded-full flex items-center justify-center mr-4">
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h4>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {event.location || "Not specified"}
                            </p>
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg shadow-sm"
                        >
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800/50 rounded-full flex items-center justify-center mr-4">
                            <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</h4>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {event.available_tickets} / {event.capacity || "∞"} tickets available
                            </p>
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg shadow-sm"
                        >
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800/50 rounded-full flex items-center justify-center mr-4">
                            <FontAwesomeIcon icon={faTag} className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</h4>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {typeof event.price === "number" ? `$${event.price.toFixed(2)}` : "Free"}
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Event Rules</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                          <li>Please arrive at least 30 minutes before the event starts.</li>
                          <li>No refunds available after purchase.</li>
                          <li>Photography and recording may be restricted during certain performances.</li>
                          <li>Outside food and beverages are not permitted.</li>
                          <li>The organizer reserves the right to refuse entry.</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "location" && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Location</h2>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4 h-64 md:h-80">
                        {/* Placeholder for map - in a real app, you'd use Google Maps or similar */}
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20">
                          <div className="text-center">
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className="text-indigo-600 dark:text-indigo-400 text-4xl mb-3"
                            />
                            <p className="text-gray-700 dark:text-gray-300">
                              {event.location || "Location not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Address</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{event.location || "Not specified"}</p>

                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Getting There</h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800/50 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Public Transport</h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                Nearest bus stop: Central Station (5 min walk)
                                <br />
                                Nearest subway: Downtown Station (10 min walk)
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800/50 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Parking</h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                Paid parking available at the venue ($10 per hour)
                                <br />
                                Street parking available in surrounding areas
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "tickets" && (
                    <motion.div
                      key="tickets"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ticket Information</h2>

                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-300">Available tickets</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {event.available_tickets} / {event.capacity || "∞"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ticketPercentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-3 rounded-full ${ticketPercentage <= 20
                              ? "bg-red-500"
                              : ticketPercentage <= 50
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              }`}
                          ></motion.div>
                        </div>
                        {ticketPercentage <= 20 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-red-500 text-sm mt-1 flex items-center"
                          >
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                            Hurry! Only a few tickets left.
                          </motion.p>
                        )}
                      </div>

                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Regular Ticket</h3>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Price:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {typeof event.price === "number" ? `$${event.price.toFixed(2)}` : "Free"}
                            </span>
                          </div>
                          <div className="flex justify-between mb-4">
                            <span className="text-gray-600 dark:text-gray-300">Includes:</span>
                            <span className="text-gray-900 dark:text-white">General admission</span>
                          </div>

                          <div className="mt-4">
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                              Number of Tickets
                            </label>
                            <div className="flex items-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                                className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-l-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 disabled:opacity-50 transition-colors duration-200"
                              >
                                <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                              </motion.button>
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={quantity}
                                  initial={isChangingQuantity ? { opacity: 0, y: -10 } : false}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-16 text-center p-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl font-bold"
                                >
                                  {quantity}
                                </motion.div>
                              </AnimatePresence>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= event.available_tickets}
                                className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-r-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 disabled:opacity-50 transition-colors duration-200"
                              >
                                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          <div className="mt-6">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleProceedToCheckout}
                              disabled={event.available_tickets <= 0}
                              className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 mr-2" />
                              {event.available_tickets > 0
                                ? `Proceed to Checkout • $${totalPrice.toFixed(2)}`
                                : "Sold Out"}
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Price Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Base price</span>
                            <span className="text-gray-900 dark:text-white">
                              ${typeof event.price === "number" ? event.price.toFixed(2) : "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Quantity</span>
                            <span className="text-gray-900 dark:text-white">× {quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-indigo-100 dark:border-indigo-800/30">
                            <span className="font-medium text-gray-900 dark:text-white">Total</span>
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={`breakdown-${totalPrice}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="font-medium text-indigo-600 dark:text-indigo-400"
                              >
                                ${totalPrice.toFixed(2)}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                          <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                          Ticket Policy
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                          <li>All sales are final. No refunds or exchanges.</li>
                          <li>Tickets are transferable to another person if you cannot attend.</li>
                          <li>Please bring a valid ID that matches the name on the ticket.</li>
                          <li>E-tickets will be sent to your email after purchase.</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Similar Events You Might Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedEvents.map((relatedEvent) => (
                    <motion.div
                      key={relatedEvent.id}
                      whileHover={{ y: -5 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="h-40 overflow-hidden">
                        <img
                          src={relatedEvent.image || "/placeholder.svg?height=300&width=400"}
                          alt={relatedEvent.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {relatedEvent.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{relatedEvent.date}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                            {typeof relatedEvent.price === "number" ? `$${relatedEvent.price.toFixed(2)}` : "Free"}
                          </span>
                          <button
                            onClick={() => navigate(`/eventDetails/${relatedEvent.id}`)}
                            className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right column - Booking card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faTicketAlt} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                Book Your Tickets
              </h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {typeof event.price === "number" ? `$${event.price.toFixed(2)}` : "Free"}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">per ticket</span>
              </div>

              {/* Ticket quantity selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Tickets
                </label>
                <div className="flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-l-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 disabled:opacity-50 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                  </motion.button>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quantity}
                      initial={isChangingQuantity ? { opacity: 0, y: -10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="w-16 text-center p-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl font-bold"
                    >
                      {quantity}
                    </motion.div>
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= event.available_tickets}
                    className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-r-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 disabled:opacity-50 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Total price */}
              {event.price > 0 && (
                <motion.div
                  className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
                  animate={{
                    backgroundColor: ["hsl(226, 100%, 97%)", "hsl(226, 100%, 94%)", "hsl(226, 100%, 97%)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`subtotal-${quantity}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        ${typeof event.price === "number" ? (event.price * quantity).toFixed(2) : "0.00"}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-800/30">
                    <span className="font-medium text-gray-900 dark:text-white">Total</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`total-${totalPrice}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="font-bold text-lg text-indigo-600 dark:text-indigo-400"
                      >
                        ${totalPrice.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Ticket availability */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Available tickets</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {event.available_tickets} / {event.capacity || "∞"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ticketPercentage}%` }}
                    transition={{ duration: 1 }}
                    className={`h-2.5 rounded-full ${ticketPercentage <= 20 ? "bg-red-500" : ticketPercentage <= 50 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                  ></motion.div>
                </div>
                {ticketPercentage <= 20 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-red-500 text-sm mt-1 flex items-center"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Hurry! Only a few tickets left.
                  </motion.p>
                )}
              </div>

              {/* Proceed to checkout button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={event.available_tickets <= 0}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 mr-2" />
                {event.available_tickets > 0 ? `Proceed to Checkout • $${totalPrice.toFixed(2)}` : "Sold Out"}
              </motion.button>

              {/* Save to favorites */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLoveClick}
                className={`w-full flex items-center justify-center px-6 py-3 mt-3 border ${isLoved
                  ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } rounded-lg transition-colors font-medium`}
                disabled={isBookmarkLoading}
              >
                {isBookmarkLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5 mr-2" />
                ) : (
                  <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5 mr-2" />
                )}
                {isLoved ? "Saved to Favorites" : "Save to Favorites"}
              </motion.button>

              {/* Additional info */}
              <div className="mt-6 space-y-3">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-700 dark:text-gray-300">{event.date || "Date not specified"}</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="w-4 h-4 mr-3 text-indigo-600 dark:text-indigo-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{event.location || "Location not specified"}</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-700 dark:text-gray-300">Approximately 3 hours</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails

// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { Spinner, Button, Badge } from "flowbite-react"
// import { StarIcon, TicketIcon } from "flowbite-react/icons"
// import Slider from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

// // Import category images
// import sportsImage from "../assets/sports.jpeg"
// import concertImage from "../assets/concert.webp"
// import theaterImage from "../assets/theatre.jpeg"
// import conferenceImage from "../assets/conference.jpeg"
// import defaultImage from "../assets/logo.jpeg"

// const HotEvents = () => {
//   const [hotEvents, setHotEvents] = useState([])
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   // Function to get category image
//   const getCategoryImage = (category) => {
//     if (!category) return defaultImage

//     switch (category.toLowerCase()) {
//       case "sports":
//         return sportsImage
//       case "concert":
//         return concertImage
//       case "theater":
//         return theaterImage
//       case "conference":
//         return conferenceImage
//       default:
//         return defaultImage
//     }
//   }

//   useEffect(() => {
//     const fetchHotEvents = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/events", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         // Sort events by rating and get top 6
//         const sortedEvents = response.data
//           .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//           .slice(0, 6)
//           .map((event) => ({
//             ...event,
//             image: getCategoryImage(event.category),
//           }))

//         setHotEvents(sortedEvents)
//         setLoading(false)
//       } catch (error) {
//         console.error("❌ Error fetching hot events:", error.response?.data || error.message)
//         setLoading(false)
//       }
//     }

//     fetchHotEvents()
//   }, [])

//   // Custom arrows for navigation
//   const CustomArrow = ({ onClick, direction }) => (
//     <div
//       className={`absolute top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-100 ${direction === "left" ? "left-4" : "right-4"
//         }`}
//       onClick={onClick}
//     >
//       {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
//     </div>
//   )

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     cssEase: "ease-in-out",
//     nextArrow: <CustomArrow direction="right" />,
//     prevArrow: <CustomArrow direction="left" />,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           arrows: false,
//         },
//       },
//     ],
//   }

//   // Function to render star rating
//   const renderRating = (rating) => {
//     const stars = []
//     const fullStars = Math.floor(rating)
//     const hasHalfStar = rating % 1 >= 0.5

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<StarIcon key={`star-${i}`} className="h-4 w-4 text-yellow-400 fill-current" />)
//     }

//     if (hasHalfStar) {
//       stars.push(
//         <div key="half-star" className="relative">
//           <StarIcon className="h-4 w-4 text-gray-300 fill-current" />
//           <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
//             <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
//           </div>
//         </div>,
//       )
//     }

//     const emptyStars = 5 - stars.length
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300 fill-current" />)
//     }

//     return (
//       <div className="flex items-center">
//         <div className="flex mr-1">{stars}</div>
//         <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
//       </div>
//     )
//   }

//   const handleBookNow = (eventId) => {
//     navigate(`/booking/${eventId}`)
//   }

//   const handleShowMore = (eventId) => {
//     navigate(`/eventDetails/${eventId}`)
//   }

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Hot Events</h2>
//         <Button color="light" size="xs" onClick={() => navigate("/?sortBy=rating")}>
//           View All
//         </Button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <Spinner size="xl" />
//         </div>
//       ) : (
//         <Slider {...settings}>
//           {hotEvents.map((event) => (
//             <div key={event.id} className="px-2">
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
//                 <div className="relative">
//                   <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-48 object-cover" />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />

//                   {event.category && (
//                     <Badge color="info" className="absolute top-3 left-3">
//                       {event.category}
//                     </Badge>
//                   )}

//                   {/* Hot badge */}
//                   <Badge color="red" className="absolute top-3 right-3">
//                     Hot
//                   </Badge>
//                 </div>

//                 <div className="p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{event.name}</h3>
//                     {event.price && (
//                       <Badge color="purple">{typeof event.price === "number" ? `$${event.price}` : event.price}</Badge>
//                     )}
//                   </div>

//                   <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{event.description}</p>

//                   <div className="space-y-2 mb-4">
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Date: {event.date}</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Location: {event.location}</p>
//                     <div className="flex items-center">{renderRating(event.rating || 0)}</div>
//                   </div>

//                   <div className="flex justify-between gap-2">
//                     <Button color="light" size="xs" onClick={() => handleShowMore(event.id)} className="flex-1">
//                       Details
//                     </Button>
//                     <Button
//                       color="blue"
//                       size="xs"
//                       onClick={() => handleBookNow(event.id)}
//                       className="flex-1 flex items-center justify-center gap-1"
//                     >
//                       <TicketIcon className="h-4 w-4" />
//                       Book Now
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       )}
//     </div>
//   )
// }

// export default HotEvents

// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faHeart as faHeartSolid,
//   faTicketAlt,
//   faChevronRight,
//   faCalendarAlt,
//   faMapMarkerAlt,
//   faStar as faStarSolid,
//   faSpinner,
//   faFire,
// } from "@fortawesome/free-solid-svg-icons"
// import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
// import Slider from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

// // Import category images
// import sportsImage from "../../assets/sports.jpeg"
// import concertImage from "../../assets/concert.webp"
// import theaterImage from "../../assets/theatre.jpeg"
// import conferenceImage from "../../assets/conference.jpeg"
// import defaultImage from "../../assets/logo.jpeg"

// const HotEvents = () => {
//   const [hotEvents, setHotEvents] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [bookmarks, setBookmarks] = useState({})
//   const navigate = useNavigate()

//   // Function to get category image
//   const getCategoryImage = (category) => {
//     if (!category) return defaultImage

//     switch (category.toLowerCase()) {
//       case "sports":
//         return sportsImage
//       case "concert":
//         return concertImage
//       case "theater":
//         return theaterImage
//       case "conference":
//         return conferenceImage
//       default:
//         return defaultImage
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch events and bookmarks in parallel
//         const [eventsResponse, bookmarksResponse] = await Promise.all([
//           axios.get("http://127.0.0.1:8000/api/events", {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }),
//           axios.get("http://127.0.0.1:8000/api/bookmarks", {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }),
//         ])

//         // Create a map of bookmarked event IDs for quick lookup
//         const bookmarksMap = {}
//         bookmarksResponse.data.forEach((bookmark) => {
//           bookmarksMap[bookmark.event_id] = true
//         })
//         setBookmarks(bookmarksMap)

//         // Sort events by rating and get top 6
//         const sortedEvents = eventsResponse.data
//           .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//           .slice(0, 6)
//           .map((event) => ({
//             ...event,
//             image: getCategoryImage(event.category),
//           }))

//         setHotEvents(sortedEvents)
//       } catch (error) {
//         console.error("❌ Error fetching hot events:", error.response?.data || error.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Toggle bookmark status
//   const handleLoveClick = async (eventId) => {
//     try {
//       if (bookmarks[eventId]) {
//         // Remove from bookmarks
//         await axios.delete(`http://127.0.0.1:8000/api/bookmarks/${eventId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })
//         setBookmarks((prev) => {
//           const newBookmarks = { ...prev }
//           delete newBookmarks[eventId]
//           return newBookmarks
//         })
//       } else {
//         // Add to bookmarks
//         await axios.post(
//           "http://127.0.0.1:8000/api/bookmarks",
//           { event_id: eventId },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           },
//         )
//         setBookmarks((prev) => ({ ...prev, [eventId]: true }))
//       }
//     } catch (error) {
//       console.error("Error updating bookmark:", error)
//     }
//   }

//   // Custom arrows for navigation
//   const CustomArrow = ({ onClick, direction }) => (
//     <div
//       className={`absolute top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 ${direction === "left" ? "left-4" : "right-4"
//         }`}
//       onClick={onClick}
//     >
//       {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
//     </div>
//   )

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     cssEase: "ease-in-out",
//     nextArrow: <CustomArrow direction="right" />,
//     prevArrow: <CustomArrow direction="left" />,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           arrows: false,
//         },
//       },
//     ],
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
//         <span className="text-xs text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
//       </div>
//     )
//   }

//   const handleBookNow = (eventId) => {
//     navigate(`/booking/${eventId}`)
//   }

//   const handleShowMore = (eventId) => {
//     navigate(`/eventDetails/${eventId}`)
//   }

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
//           <FontAwesomeIcon icon={faFire} className="text-red-500 mr-2" />
//           Hot Events
//         </h2>
//         <button
//           className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
//           onClick={() => navigate("/?sortBy=rating")}
//         >
//           View All
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl" />
//         </div>
//       ) : (
//         <Slider {...settings}>
//           {hotEvents.map((event) => (
//             <div key={event.id} className="px-2">
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
//                 <div className="relative">
//                   <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-48 object-cover" />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />

//                   {event.category && (
//                     <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
//                       {event.category}
//                     </span>
//                   )}

//                   {/* Hot badge */}
//                   <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded flex items-center">
//                     <FontAwesomeIcon icon={faFire} className="mr-1" />
//                     Hot
//                   </span>

//                   {/* Love button */}
//                   <button
//                     className={`absolute bottom-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 transition-colors ${bookmarks[event.id] ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}
//                     onClick={() => handleLoveClick(event.id)}
//                   >
//                     <FontAwesomeIcon icon={bookmarks[event.id] ? faHeartSolid : faHeartRegular} className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div className="p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{event.name}</h3>
//                     {event.price && (
//                       <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded">
//                         {typeof event.price === "number" ? `$${event.price}` : event.price}
//                       </span>
//                     )}
//                   </div>

//                   <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{event.description}</p>

//                   <div className="space-y-2 mb-4">
//                     <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                       <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
//                       <span>{event.date}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                       <FontAwesomeIcon
//                         icon={faMapMarkerAlt}
//                         className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
//                       />
//                       <span>{event.location}</span>
//                     </div>
//                     <div className="flex items-center">{renderRating(event.rating || 0)}</div>
//                   </div>

//                   <div className="flex justify-between gap-2">
//                     <button
//                       className="flex-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors flex items-center justify-center"
//                       onClick={() => handleShowMore(event.id)}
//                     >
//                       <span>Details</span>
//                       <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5 ml-1" />
//                     </button>
//                     <button
//                       className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors flex items-center justify-center"
//                       onClick={() => handleBookNow(event.id)}
//                     >
//                       <FontAwesomeIcon icon={faTicketAlt} className="w-4 h-4 mr-1.5" />
//                       <span>Book Now</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       )}
//     </div>
//   )
// }

// export default HotEvents

"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeart as faHeartSolid,
  faTicketAlt,
  faChevronRight,
  faCalendarAlt,
  faMapMarkerAlt,
  faStar as faStarSolid,
  faSpinner,
  faFire,
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useEvents } from "../../context/EventsContext"

const HotEvents = () => {
  const { getHotEvents, bookmarks, toggleBookmark, loading } = useEvents()
  const [bookmarkLoading, setBookmarkLoading] = useState({})
  const navigate = useNavigate()

  // Get hot events from context
  const hotEvents = getHotEvents(6)

  // Toggle bookmark status
  const handleLoveClick = async (eventId) => {
    setBookmarkLoading((prev) => ({ ...prev, [eventId]: true }))
    try {
      await toggleBookmark(eventId)
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [eventId]: false }))
    }
  }

  // Custom arrows for navigation
  const CustomArrow = ({ onClick, direction }) => (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 ${direction === "left" ? "left-4" : "right-4"
        }`}
      onClick={onClick}
    >
      {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
    </div>
  )

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  }

  // Function to render star rating
  const renderRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStarSolid} className="text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={`half-star`} className="relative">
            <FontAwesomeIcon icon={faStarRegular} className="text-gray-300 dark:text-gray-600" />
            <span className="absolute top-0 left-0 overflow-hidden w-1/2">
              <FontAwesomeIcon icon={faStarSolid} className="text-yellow-400" />
            </span>
          </span>,
        )
      } else {
        stars.push(
          <FontAwesomeIcon key={`empty-${i}`} icon={faStarRegular} className="text-gray-300 dark:text-gray-600" />,
        )
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-xs text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
      </div>
    )
  }

  const handleBookNow = (eventId) => {
    // Navigate to event details instead of booking
    navigate(`/eventDetails/${eventId}`)
  }

  const handleShowMore = (eventId) => {
    navigate(`/eventDetails/${eventId}`)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <FontAwesomeIcon icon={faFire} className="text-red-500 mr-2" />
          Hot Events
        </h2>
        <button
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          onClick={() => navigate("/events?sortBy=rating")}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl" />
        </div>
      ) : (
        <Slider {...settings}>
          {hotEvents.map((event) => (
            <div key={event.id} className="px-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
                <div className="relative">
                  <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />

                  {event.category && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {event.category}
                    </span>
                  )}

                  {/* Hot badge */}
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded flex items-center">
                    <FontAwesomeIcon icon={faFire} className="mr-1" />
                    Hot
                  </span>

                  {/* Love button */}
                  <button
                    className={`absolute bottom-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 transition-colors ${bookmarks[event.id] ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}
                    onClick={() => handleLoveClick(event.id)}
                    disabled={bookmarkLoading[event.id]}
                  >
                    <FontAwesomeIcon icon={bookmarks[event.id] ? faHeartSolid : faHeartRegular} className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{event.name}</h3>
                    {event.price && (
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded">
                        {typeof event.price === "number" ? `$${event.price}` : event.price}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                      />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">{renderRating(event.rating || 0)}</div>
                  </div>

                  <div className="flex justify-between gap-2">
                    <button
                      className="flex-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors flex items-center justify-center"
                      onClick={() => handleShowMore(event.id)}
                    >
                      <span>Details</span>
                      <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5 ml-1" />
                    </button>
                    <button
                      className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors flex items-center justify-center"
                      onClick={() => handleBookNow(event.id)}
                    >
                      <FontAwesomeIcon icon={faTicketAlt} className="w-4 h-4 mr-1.5" />
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  )
}

export default HotEvents


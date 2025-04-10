// "use client";

// import axios from "axios";
// import { useContext, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { BeatLoader } from "react-spinners";
// import Slider from "react-slick";

// import toast from "react-hot-toast";
// import RelatedEvents from "../RelatedEvents/RelatedEvents";
// // import { EventDetails } from '../EventDetails/EventDetails'


// export default function EventDetails() {

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [loadingAddToCart, setLoadingAddToCart] = useState(false);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   async function getEventDetails(eventId) {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         },
//       });
//       setEvent(data);
//     } catch (error) {
//       console.error("Error fetching event details:", error);
//     } finally {
//       setLoading(false);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   }

//   useEffect(() => {
//     getEventDetails(id);
//   }, [id]);

//   async function handleAddToCart(eventId) {
//     setLoadingAddToCart(true);
//     try {
//       await addToCart(eventId);
//       toast.success("Event added to cart!");
//     } catch (error) {
//       toast.error("Failed to add to cart");
//     } finally {
//       setLoadingAddToCart(false);
//     }
//   }

//   return (
//     <>
//       <div className="container mx-auto px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
//         <h2 className="text-4xl mt-6 mb-10 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 tracking-wide">
//           Event Details
//         </h2>

//         {loading ? (
//           <div className="w-full h-screen flex flex-col justify-center items-center">
//             <BeatLoader color="#10b981" size={15} className="animate-pulse" />
//             <p className="mt-4 text-emerald-600 font-medium animate-fadeIn">Loading event details...</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-8 bg-white shadow-xl rounded-2xl p-6 md:p-8 animate-slideUp">
//             <div className="md:col-span-2 flex justify-center">
//               <div className="w-full max-w-md relative">
//                 <Slider {...settings} className="product-slider">
//                   {event?.images.map((image, index) => (
//                     <div key={index} className="px-2">
//                       <img
//                         src={image || "/placeholder.svg"}
//                         alt={`Image of ${event?.name}`}
//                         className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-md transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-lg"
//                       />
//                     </div>
//                   ))}
//                 </Slider>
//               </div>
//             </div>

//             <div className="md:col-span-4 flex flex-col justify-center space-y-6 text-center md:text-left">
//               <h2 className="text-3xl font-bold text-gray-800 animate-fadeIn">{event?.name}</h2>

//               <p className="text-gray-600 leading-relaxed text-base animate-fadeIn">{event?.description}</p>

//               <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
//                 <span className="text-2xl font-bold text-emerald-600 animate-fadeIn">${event?.price}</span>

//                 {loadingAddToCart ? (
//                   <div className="w-full md:w-auto flex justify-center items-center h-12 px-8 rounded-lg bg-emerald-100">
//                     <BeatLoader color="#10b981" size={10} />
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => handleAddToCart(event?._id)}
//                     className="w-full md:w-auto h-12 px-8 text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg font-medium flex items-center justify-center shadow-lg shadow-emerald-200 transition-all duration-300 hover:scale-105 active:scale-95"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 mr-2"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                       />
//                     </svg>
//                     Add to cart
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* عرض الأحداث المتعلقة */}
//         <RelatedEvents categoryId={event?.category._id} currentEventId={id} />
//       </div>

//       <style jsx="true">{`
//         /* Animation classes */
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes slideUp {
//           from { transform: translateY(20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease forwards;
//         }

//         .animate-slideUp {
//           animation: slideUp 0.5s ease forwards;
//         }

//         /* Line clamp for text truncation */
//         .line-clamp-1 {
//           display: -webkit-box;
//           -webkit-line-clamp: 1;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }

//         /* Custom slider styles */
//         .product-slider .slick-dots {
//           bottom: -30px;
//         }

//         .product-slider .slick-dots li button:before {
//           font-size: 10px;
//           color: #d1d5db;
//           opacity: 1;
//         }

//         .product-slider .slick-dots li.slick-active button:before {
//           color: #10b981;
//           opacity: 1;
//         }

//         .product-slider .slick-prev,
//         .product-slider .slick-next {
//           z-index: 10;
//           width: 40px;
//           height: 40px;
//           background: rgba(255, 255, 255, 0.8);
//           border-radius: 50%;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           transition: all 0.3s ease;
//         }

//         .product-slider .slick-prev:hover,
//         .product-slider .slick-next:hover {
//           background: white;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//         }

//         .product-slider .slick-prev {
//           left: -10px;
//         }

//         .product-slider .slick-next {
//           right: -10px;
//         }

//         .product-slider .slick-prev:before,
//         .product-slider .slick-next:before {
//           color: #10b981;
//           opacity: 1;
//         }
//       `}</style>
//     </>
//   );
// }

// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faHeart as faHeartSolid,
//   faTicketAlt,
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
// } from "@fortawesome/free-solid-svg-icons"
// import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"

// // Import category images
// import sportsImage from "../../assets/sports.jpeg"
// import concertImage from "../../assets/concert.webp"
// import theaterImage from "../../assets/theatre.jpeg"
// import conferenceImage from "../../assets/conference.jpeg"
// import defaultImage from "../../assets/logo.jpeg"

// const EventDetails = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [event, setEvent] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [isLoved, setIsLoved] = useState(false)
//   const [bookmarkLoading, setBookmarkLoading] = useState(false)

//   // Function to get category image
//   const getCategoryImage = (category) => {
//     if (!category) return defaultImage

//     switch (category?.toLowerCase()) {
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
//     const fetchEventDetails = async () => {
//       setLoading(true)
//       setError(null)

//       try {
//         // Fetch event details and bookmark status in parallel
//         const [eventResponse, bookmarksResponse] = await Promise.all([
//           axios.get(`http://127.0.0.1:8000/api/events/${id}`, {
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

//         // Add image to event
//         const eventWithImage = {
//           ...eventResponse.data,
//           image: getCategoryImage(eventResponse.data.category),
//         }

//         setEvent(eventWithImage)

//         // Check if this event is bookmarked
//         const isBookmarked = bookmarksResponse.data.some((bookmark) => bookmark.event_id === id)
//         setIsLoved(isBookmarked)
//       } catch (error) {
//         console.error("❌ Error fetching event details:", error.response?.data || error.message)
//         setError("Failed to load event details. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEventDetails()
//   }, [id])

//   const handleLoveClick = async () => {
//     if (!event) return

//     setBookmarkLoading(true)
//     try {
//       if (isLoved) {
//         // Remove from bookmarks
//         await axios.delete(`http://127.0.0.1:8000/api/bookmarks/${event.id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })
//       } else {
//         // Add to bookmarks
//         await axios.post(
//           "http://127.0.0.1:8000/api/bookmarks",
//           { event_id: event.id },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           },
//         )
//       }
//       setIsLoved(!isLoved)
//     } catch (error) {
//       console.error("Error updating bookmark:", error)
//     } finally {
//       setBookmarkLoading(false)
//     }
//   }

//   const handleBookNow = () => {
//     navigate(`/booking/${id}`)
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

//   if (loading) {
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

//   if (error) {
//     return (
//       <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-8 rounded-lg text-center">
//             <h3 className="text-xl font-semibold mb-2">Error</h3>
//             <p>{error}</p>
//             <button
//               className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
//               onClick={() => navigate("/")}
//             >
//               Back to Events
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!event) {
//     return (
//       <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-8 rounded-lg text-center">
//             <h3 className="text-xl font-semibold mb-2">Event Not Found</h3>
//             <p>The event you're looking for doesn't exist or has been removed.</p>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//               onClick={() => navigate("/")}
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
//             alert("Link copied to clipboard!")
//           }}
//         >
//           <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
//         </button>

//         {/* Favorite button */}
//         <button
//           className={`absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full transition-colors ${isLoved ? "text-red-500" : "text-gray-800 dark:text-gray-200"} ${bookmarkLoading ? "opacity-50 cursor-wait" : ""}`}
//           onClick={handleLoveClick}
//           disabled={bookmarkLoading}
//         >
//           <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5" />
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

//               {/* Book now button */}
//               <button
//                 onClick={handleBookNow}
//                 className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors font-medium"
//                 disabled={event.available_tickets <= 0}
//               >
//                 <FontAwesomeIcon icon={faTicketAlt} className="w-5 h-5 mr-2" />
//                 {event.available_tickets > 0 ? "Book Now" : "Sold Out"}
//               </button>

//               {/* Save to favorites */}
//               <button
//                 onClick={handleLoveClick}
//                 className={`w-full flex items-center justify-center px-6 py-3 mt-3 border ${isLoved
//                   ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
//                   : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                   } rounded-lg transition-colors font-medium`}
//                 disabled={bookmarkLoading}
//               >
//                 <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5 mr-2" />
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
// "use client"
// import { useParams, useNavigate } from "react-router-dom"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faHeart as faHeartSolid,
//   faTicketAlt,
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
// } from "@fortawesome/free-solid-svg-icons"
// import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
// import { useEvents } from "../../context/EventsContext"
// import { useToast } from "../../context/ToastContext"
// import { useBooking } from "../../context/BookingContext"

// const EventDetails = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const toast = useToast()
//   const { getEventById, bookmarks, toggleBookmark, buttonLoadingStates: eventButtonLoadingStates } = useEvents()

//   const {
//     bookTicket,
//     buttonLoadingStates: bookingButtonLoadingStates,
//     updateEventTicketQuantity,
//     getEventTicketQuantity,
//     calculateTotalPrice,
//     checkUserIdAvailable,
//   } = useBooking()

//   const event = getEventById(id)
//   const isLoved = bookmarks[id] || false
//   const isBookmarkLoading = eventButtonLoadingStates[`bookmark-${id}`] || false
//   const isBookingLoading = bookingButtonLoadingStates[`book-${id}`] || false
//   const quantity = getEventTicketQuantity(id)
//   const totalPrice = calculateTotalPrice(event, quantity)

//   const handleLoveClick = async () => {
//     if (!event) return
//     await toggleBookmark(event.id)
//   }

//   const handleBookNow = async () => {
//     if (!event) return
//     if (event.available_tickets < quantity) {
//       toast.error(`Only ${event.available_tickets} tickets available`)
//       return
//     }

//     // Check if user ID is available
//     if (!checkUserIdAvailable()) {
//       toast.error("User information not found. Please log in again.")
//       return
//     }

//     const success = await bookTicket(event.id, quantity)
//     if (success) {
//       toast.success(`Successfully booked ${quantity} ticket${quantity > 1 ? "s" : ""} for "${event.name}"`)
//       navigate(`/tickets`)
//     }
//   }

//   const handleQuantityChange = (newQuantity) => {
//     if (newQuantity < 1) newQuantity = 1
//     if (event && newQuantity > event.available_tickets) {
//       newQuantity = event.available_tickets
//       toast.warning(`Maximum available tickets: ${event.available_tickets}`)
//     }
//     updateEventTicketQuantity(id, newQuantity)
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

//   if (!event) {
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

//               {/* Book now button */}
//               <button
//                 onClick={handleBookNow}
//                 className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors font-medium"
//                 disabled={event.available_tickets <= 0 || isBookingLoading}
//               >
//                 {isBookingLoading ? (
//                   <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5 mr-2" />
//                 ) : (
//                   <FontAwesomeIcon icon={faTicketAlt} className="w-5 h-5 mr-2" />
//                 )}
//                 {event.available_tickets > 0 ? `Book ${quantity > 1 ? quantity + " tickets" : "Now"}` : "Sold Out"}
//               </button>

//               {/* Save to favorites */}
//               <button
//                 onClick={handleLoveClick}
//                 className={`w-full flex items-center justify-center px-6 py-3 mt-3 border ${isLoved
//                     ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
//                     : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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



"use client"
import { useParams, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeart as faHeartSolid,
  faTicketAlt,
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
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"
import { useEvents } from "../../context/EventsContext"
import { useToast } from "../../context/ToastContext"
import { useBooking } from "../../context/BookingContext"
import { useState, useEffect } from "react"

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { getEventById, bookmarks, toggleBookmark, buttonLoadingStates: eventButtonLoadingStates } = useEvents()

  const {
    bookTicket,
    buttonLoadingStates: bookingButtonLoadingStates,
    updateEventTicketQuantity,
    getEventTicketQuantity,
    calculateTotalPrice,
    checkUserIdAvailable,
  } = useBooking()

  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    try {
      // Get event directly from context
      const eventData = getEventById(id)

      if (eventData) {
        setEvent(eventData)
      } else {
        setError("Event not found")
      }
    } catch (err) {
      console.error("Error loading event:", err)
      setError("Failed to load event details")
    } finally {
      setIsLoading(false)
    }
  }, [id, getEventById])

  const isLoved = bookmarks[id] || false
  const isBookmarkLoading = eventButtonLoadingStates[`bookmark-${id}`] || false
  const isBookingLoading = bookingButtonLoadingStates[`book-${id}`] || false
  const quantity = getEventTicketQuantity(id)
  const totalPrice = calculateTotalPrice(event, quantity)

  const handleLoveClick = async () => {
    if (!event) return
    await toggleBookmark(event.id)
  }

  const handleBookNow = async () => {
    if (!event) return
    if (event.available_tickets < quantity) {
      toast.error(`Only ${event.available_tickets} tickets available`)
      return
    }

    // Check if user ID is available
    if (!checkUserIdAvailable()) {
      toast.error("User information not found. Please log in again.")
      return
    }

    const success = await bookTicket(event.id, quantity)
    if (success) {
      toast.success(`Successfully booked ${quantity} ticket${quantity > 1 ? "s" : ""} for "${event.name}"`)
      navigate(`/tickets`)
    }
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) newQuantity = 1
    if (event && newQuantity > event.available_tickets) {
      newQuantity = event.available_tickets
      toast.warning(`Maximum available tickets: ${event.available_tickets}`)
    }
    updateEventTicketQuantity(id, newQuantity)
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
        <span className="text-sm text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Event Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The event you're looking for could not be found."}
            </p>
            <button
              onClick={() => navigate("/events")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Browse Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  const ticketPercentage = (event.available_tickets / event.capacity) * 100

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero section with image */}
      <div className="relative h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
        <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

        {/* Back button */}
        <button
          className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full transition-colors"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </button>

        {/* Share button */}
        <button
          className="absolute top-4 right-16 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full transition-colors"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.info("Link copied to clipboard!")
          }}
        >
          <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
        </button>

        {/* Favorite button */}
        <button
          className={`absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full transition-colors ${isLoved ? "text-red-500" : "text-gray-800 dark:text-gray-200"} ${isBookmarkLoading ? "opacity-80 cursor-wait" : ""}`}
          onClick={handleLoveClick}
          disabled={isBookmarkLoading}
        >
          {isBookmarkLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
          ) : (
            <FontAwesomeIcon icon={isLoved ? faHeartSolid : faHeartRegular} className="w-5 h-5" />
          )}
        </button>

        {/* Event title and category */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            {event.category && (
              <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded mb-3">
                {event.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{event.name}</h1>
            <div className="flex items-center text-white mb-4">{renderRating(event.rating || 0)}</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Event details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">{event.description}</p>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Date & Time</h4>
                      <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
                      <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faUsers} className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Capacity</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.available_tickets} / {event.capacity} tickets available
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faTag} className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Price</h4>
                      <p className="text-gray-600 dark:text-gray-300">{event.price ? `$${event.price}` : "Free"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Additional Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Event Rules</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Please arrive at least 30 minutes before the event starts. No refunds available after purchase.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faClock} className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Duration</h4>
                    <p className="text-gray-600 dark:text-gray-300">Approximately 3 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Booking card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Book Your Tickets</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {event.price ? `$${event.price}` : "Free"}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">per ticket</span>
              </div>

              {/* Ticket quantity selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Tickets
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={event.available_tickets}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                    className="w-16 text-center p-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= event.available_tickets}
                    className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total price */}
              {event.price > 0 && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${(event.price * quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Ticket availability */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Available tickets</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {event.available_tickets} / {event.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${ticketPercentage <= 20 ? "bg-red-500" : ticketPercentage <= 50 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                    style={{ width: `${ticketPercentage}%` }}
                  ></div>
                </div>
                {ticketPercentage <= 20 && <p className="text-red-500 text-sm mt-1">Hurry! Only a few tickets left.</p>}
              </div>

              {/* Book now button */}
              <button
                onClick={handleBookNow}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors font-medium"
                disabled={event.available_tickets <= 0 || isBookingLoading}
              >
                {isBookingLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5 mr-2" />
                ) : (
                  <FontAwesomeIcon icon={faTicketAlt} className="w-5 h-5 mr-2" />
                )}
                {event.available_tickets > 0 ? `Book ${quantity > 1 ? quantity + " tickets" : "Now"}` : "Sold Out"}
              </button>

              {/* Save to favorites */}
              <button
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
              </button>

              {/* Additional info */}
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  {event.date}
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  {event.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails


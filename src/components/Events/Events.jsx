// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// import { PulseLoader } from "react-spinners";

// // استيراد الصور من الـ assets
// import sportsImage from "../../assets/sports.jpeg";
// import concertImage from "../../assets/concert.webp";
// import theaterImage from "../../assets/theatre.jpeg";
// import conferenceImage from "../../assets/conference.jpeg";
// import defaultImage from "../../assets/logo.jpeg";
// import EventCard from "../EventCard/EventCard";

// const Events = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const category = queryParams.get("category");

//   // دالة لإرجاع صورة تعبر عن الفئة
//   const getCategoryImage = (category) => {
//     if (!category) return defaultImage; // إذا category مش موجودة، نرجع الصورة الافتراضية

//     switch (category.toLowerCase()) {
//       case "sports":
//         return sportsImage;
//       case "concert":
//         return concertImage;
//       case "theater":
//         return theaterImage;
//       case "conference":
//         return conferenceImage;
//       default:
//         return defaultImage; // إذا الكاتجوري مش معروفة، نرجع الصورة الافتراضية
//     }
//   };

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8000/api/events`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         // فلترة الأحداث بناءً على الفئة إذا كانت موجودة
//         const filteredEvents = category
//           ? response?.data?.filter((event) => {
//             // تأكد من أن event.category موجودة قبل استخدام toLowerCase
//             if (event.category) {
//               return event.category.toLowerCase() === category.toLowerCase();
//             }
//             return false; // إذا event.category مش موجودة، نرجع false
//           })
//           : response?.data;

//         // إضافة الصور المناسبة لكل حدث
//         const eventsWithImages = filteredEvents.map((event) => ({
//           ...event,
//           image: getCategoryImage(event.category),
//         }));

//         setEvents(eventsWithImages);
//         setLoading(false);
//       } catch (error) {
//         console.error("❌ Error fetching events:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [category]);

//   // دالة لتحديد إذا كان الحدث مفضلًا
//   const handleLoveClick = (eventId) => {
//     console.log("Loved Event ID:", eventId);
//     // هنا يمكنك إضافة منطق لحفظ الحدث كـ "مفضل"
//   };

//   // دالة لحجز التذكرة
//   const handleBookingClick = (eventId) => {
//     console.log("Booking Event ID:", eventId);
//     // هنا يمكنك إضافة منطق لحجز التذكرة
//   };

//   // دالة للانتقال إلى صفحة تفاصيل الحدث
//   const handleShowMore = (eventId) => {
//     navigate(`/eventDetails/${eventId}`);
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 dark:bg-gray-900 dark:text-white">
//       <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
//         {category ? `Events in ${category}` : "All Events"}
//       </h2>
//       {loading ? (
//         <p className="text-center text-gray-500 dark:text-gray-400">Loading events...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {events.map((event) => (
//             <EventCard
//               key={event.id}
//               event={event}
//               onLoveClick={handleLoveClick}
//               onBookingClick={handleBookingClick}
//               onShowMore={handleShowMore}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Events;



// "use client"

// import { useEffect, useState } from "react"
// import { useLocation, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faSearch, faFilter, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons"
// import { EventCard } from "../EventCard/EventCard"

// // Import category images
// import sportsImage from "../../assets/sports.jpeg"
// import concertImage from "../../assets/concert.webp"
// import theaterImage from "../../assets/theatre.jpeg"
// import conferenceImage from "../../assets/conference.jpeg"
// import defaultImage from "../../assets/logo.jpeg"

// const Events = () => {
//   const [events, setEvents] = useState([])
//   const [filteredEvents, setFilteredEvents] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const location = useLocation()
//   const navigate = useNavigate()
//   const queryParams = new URLSearchParams(location.search)

//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState(queryParams.get("category") || "")
//   const [selectedLocation, setSelectedLocation] = useState("")
//   const [dateFilter, setDateFilter] = useState("")
//   const [sortBy, setSortBy] = useState("date")
//   const [locations, setLocations] = useState([])
//   const [showFilters, setShowFilters] = useState(false)

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
//     const fetchEvents = async () => {
//       setLoading(true)
//       setError(null)

//       try {
//         const response = await axios.get(`http://127.0.0.1:8000/api/events`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         // Add appropriate images and format data for each event
//         const eventsWithImages = response.data.map((event) => ({
//           ...event,
//           image: getCategoryImage(event.category),
//           category: event.category || "Other",
//           // Format date if needed
//           date: event.date || "TBA",
//           // Add any other formatting needed
//         }))

//         setEvents(eventsWithImages)

//         // Extract unique locations for filter dropdown
//         const uniqueLocations = [...new Set(eventsWithImages.map((event) => event.location).filter(Boolean))]
//         setLocations(uniqueLocations)

//         // Apply initial filters if any
//         applyFilters(eventsWithImages)
//       } catch (error) {
//         console.error("❌ Error fetching events:", error.response?.data || error.message)
//         setError("Failed to load events. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEvents()
//   }, [])

//   // Apply all filters whenever filter criteria change
//   useEffect(() => {
//     applyFilters(events)
//   }, [searchTerm, selectedCategory, selectedLocation, dateFilter, sortBy])

//   // Function to apply all filters
//   const applyFilters = (eventsToFilter) => {
//     if (!eventsToFilter || eventsToFilter.length === 0) return

//     let filtered = [...eventsToFilter]

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       filtered = filtered.filter(
//         (event) => event.name?.toLowerCase().includes(term) || event.description?.toLowerCase().includes(term),
//       )
//     }

//     // Apply category filter
//     if (selectedCategory) {
//       filtered = filtered.filter((event) => event.category?.toLowerCase() === selectedCategory.toLowerCase())
//     }

//     // Apply location filter
//     if (selectedLocation) {
//       filtered = filtered.filter((event) => event.location === selectedLocation)
//     }

//     // Apply date filter
//     if (dateFilter) {
//       const today = new Date()
//       const nextWeek = new Date()
//       nextWeek.setDate(today.getDate() + 7)
//       const nextMonth = new Date()
//       nextMonth.setMonth(today.getMonth() + 1)

//       filtered = filtered.filter((event) => {
//         const eventDate = new Date(event.date)

//         switch (dateFilter) {
//           case "today":
//             return eventDate.toDateString() === today.toDateString()
//           case "thisWeek":
//             return eventDate >= today && eventDate <= nextWeek
//           case "thisMonth":
//             return eventDate >= today && eventDate <= nextMonth
//           default:
//             return true
//         }
//       })
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "name":
//           return a.name.localeCompare(b.name)
//         case "date":
//           return new Date(a.date) - new Date(b.date)
//         case "rating":
//           return (b.rating || 0) - (a.rating || 0)
//         case "price":
//           return (a.price || 0) - (b.price || 0)
//         default:
//           return 0
//       }
//     })

//     setFilteredEvents(filtered)
//   }

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchTerm("")
//     setSelectedCategory("")
//     setSelectedLocation("")
//     setDateFilter("")
//     setSortBy("date")
//     navigate("/")
//   }

//   // Handle booking ticket
//   const handleBookingClick = (eventId) => {
//     navigate(`/booking/${eventId}`)
//   }

//   // Function to render categories filter
//   const renderCategoryFilters = () => {
//     const categories = ["Sports", "Concert", "Theater", "Conference"]

//     return (
//       <div className="flex flex-wrap gap-2 mb-4">
//         <button
//           className={`px-3 py-1 text-sm rounded-full ${!selectedCategory
//             ? "bg-blue-600 text-white"
//             : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//             }`}
//           onClick={() => setSelectedCategory("")}
//         >
//           All
//         </button>
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             className={`px-3 py-1 text-sm rounded-full ${selectedCategory?.toLowerCase() === cat.toLowerCase()
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//               }`}
//             onClick={() => setSelectedCategory(cat.toLowerCase())}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header section */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//             {selectedCategory
//               ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`
//               : "All Events"}
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Discover and book tickets for amazing events happening near you
//           </p>

//           {/* Search and filter section */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
//             <div className="flex flex-col md:flex-row gap-4 mb-4">
//               {/* Search input */}
//               <div className="flex-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search events..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 />
//               </div>

//               {/* Filter toggle button (mobile) */}
//               <button
//                 className="md:hidden flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
//                 onClick={() => setShowFilters(!showFilters)}
//               >
//                 <FontAwesomeIcon icon={faFilter} className="mr-2" />
//                 Filters
//               </button>

//               {/* Desktop filters */}
//               <div className="hidden md:flex md:flex-row gap-4">
//                 {/* Location filter */}
//                 <div className="w-48">
//                   <select
//                     value={selectedLocation}
//                     onChange={(e) => setSelectedLocation(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="">All Locations</option>
//                     {locations.map((location) => (
//                       <option key={location} value={location}>
//                         {location}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Date filter */}
//                 <div className="w-48">
//                   <select
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="">Any Date</option>
//                     <option value="today">Today</option>
//                     <option value="thisWeek">This Week</option>
//                     <option value="thisMonth">This Month</option>
//                   </select>
//                 </div>

//                 {/* Sort by */}
//                 <div className="w-48">
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="date">Sort by Date</option>
//                     <option value="name">Sort by Name</option>
//                     <option value="rating">Sort by Rating</option>
//                     <option value="price">Sort by Price</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile filters (collapsible) */}
//             {showFilters && (
//               <div className="md:hidden space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                 {/* Location filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
//                   <select
//                     value={selectedLocation}
//                     onChange={(e) => setSelectedLocation(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="">All Locations</option>
//                     {locations.map((location) => (
//                       <option key={location} value={location}>
//                         {location}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Date filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
//                   <select
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="">Any Date</option>
//                     <option value="today">Today</option>
//                     <option value="thisWeek">This Week</option>
//                     <option value="thisMonth">This Month</option>
//                   </select>
//                 </div>

//                 {/* Sort by */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="date">Sort by Date</option>
//                     <option value="name">Sort by Name</option>
//                     <option value="rating">Sort by Rating</option>
//                     <option value="price">Sort by Price</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-between items-center">
//               {/* Category filters */}
//               {renderCategoryFilters()}

//               {/* Reset filters button */}
//               <button
//                 onClick={resetFilters}
//                 className="flex items-center px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
//               >
//                 <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5 mr-1" />
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Loading state */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
//             <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg text-center">
//             {error}
//           </div>
//         ) : filteredEvents.length === 0 ? (
//           <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center">
//             <h3 className="text-xl font-semibold mb-2">No events found</h3>
//             <p>No events match your current filters. Try adjusting your search criteria.</p>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//               onClick={resetFilters}
//             >
//               Clear All Filters
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Events count */}
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
//             </p>

//             {/* Events grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredEvents.map((event) => (
//                 <EventCard
//                   key={event.id}
//                   event={{
//                     ...event,
//                     // Ensure all required properties are available
//                     name: event.name || event.title || "Untitled Event",
//                     description: event.description || "No description available",
//                     location: event.location || "TBA",
//                     available_tickets: event.available_tickets || 0,
//                     capacity: event.capacity || 100,
//                     // Add price if available
//                     price: event.price ? `$${event.price}` : "Free",
//                     // Add rating if available
//                     rating: event.rating || 0,
//                   }}
//                   onBookingClick={handleBookingClick}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Events
"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faFilter, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { EventCard } from "../EventCard/EventCard"
import { useEvents } from "../../context/EventsContext"

const Events = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)

  // Get data from context
  const { loading, error, filterEvents, getLocations } = useEvents()

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get("category") || "")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [showFilters, setShowFilters] = useState(false)
  const [filteredEvents, setFilteredEvents] = useState([])

  // Get locations for filter dropdown
  const locations = getLocations()

  // Apply filters whenever filter criteria change
  useEffect(() => {
    const filtered = filterEvents({
      searchTerm,
      category: selectedCategory,
      location: selectedLocation,
      dateFilter,
      sortBy,
    })
    setFilteredEvents(filtered)
  }, [searchTerm, selectedCategory, selectedLocation, dateFilter, sortBy])

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedLocation("")
    setDateFilter("")
    setSortBy("date")
    navigate("/events")
  }

  // Handle booking ticket
  const handleBookingClick = (eventId) => {
    // Navigate to event details instead of booking
    navigate(`/eventDetails/${eventId}`)
  }

  // Function to render categories filter
  const renderCategoryFilters = () => {
    const categories = ["Sports", "Concert", "Theater", "Conference"]

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 text-sm rounded-full ${!selectedCategory
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 text-sm rounded-full ${selectedCategory?.toLowerCase() === cat.toLowerCase()
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            onClick={() => setSelectedCategory(cat.toLowerCase())}
          >
            {cat}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`
              : "All Events"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Discover and book tickets for amazing events happening near you
          </p>

          {/* Search and filter section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filter toggle button (mobile) */}
              <button
                className="md:hidden flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                Filters
              </button>

              {/* Desktop filters */}
              <div className="hidden md:flex md:flex-row gap-4">
                {/* Location filter */}
                <div className="w-48">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date filter */}
                <div className="w-48">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Any Date</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                </div>

                {/* Sort by */}
                <div className="w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="price">Sort by Price</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile filters (collapsible) */}
            {showFilters && (
              <div className="md:hidden space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {/* Location filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Any Date</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                </div>

                {/* Sort by */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="price">Sort by Price</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              {/* Category filters */}
              {renderCategoryFilters()}

              {/* Reset filters button */}
              <button
                onClick={resetFilters}
                className="flex items-center px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5 mr-1" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p>No events match your current filters. Try adjusting your search criteria.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={resetFilters}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Events count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            </p>

            {/* Events grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={{
                    ...event,
                    // Ensure all required properties are available
                    name: event.name || event.title || "Untitled Event",
                    description: event.description || "No description available",
                    location: event.location || "TBA",
                    available_tickets: event.available_tickets || 0,
                    capacity: event.capacity || 100,
                    // Add price if available
                    price: event.price ? `$${event.price}` : "Free",
                    // Add rating if available
                    rating: event.rating || 0,
                  }}
                  onBookingClick={handleBookingClick}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Events



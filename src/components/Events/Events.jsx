// // "use client"

// // import { useState, useEffect } from "react"
// // import { useLocation, useNavigate } from "react-router-dom"
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// // import {
// //   faSearch,
// //   faFilter,
// //   faTimes,
// //   faSpinner,
// //   faCalendarAlt,
// //   faMapMarkerAlt,
// //   faSortAmountDown,
// //   faTicketAlt,
// //   faChevronDown,
// //   faChevronUp,
// // } from "@fortawesome/free-solid-svg-icons"
// // import { EventCard } from "../EventCard/EventCard"
// // import { useEvents } from "../../context/EventsContext"
// // import defaultImage from "../../assets/logo.jpeg" // Import default image

// // const Events = () => {
// //   const location = useLocation()
// //   const navigate = useNavigate()
// //   const queryParams = new URLSearchParams(location.search)

// //   // Get data from context
// //   const { loading, error, filterEvents, getLocations } = useEvents()

// //   // Search and filter states
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [selectedCategory, setSelectedCategory] = useState(queryParams.get("category") || "")
// //   const [selectedLocation, setSelectedLocation] = useState("")
// //   const [dateFilter, setDateFilter] = useState("")
// //   const [sortBy, setSortBy] = useState("date")
// //   const [showFilters, setShowFilters] = useState(false)
// //   const [filteredEvents, setFilteredEvents] = useState([])
// //   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

// //   // Get locations for filter dropdown
// //   const locations = getLocations()

// //   // Apply filters whenever filter criteria change
// //   useEffect(() => {
// //     const filtered = filterEvents({
// //       searchTerm,
// //       category: selectedCategory,
// //       location: selectedLocation,
// //       dateFilter,
// //       sortBy,
// //     })
// //     setFilteredEvents(filtered)
// //   }, [searchTerm, selectedCategory, selectedLocation, dateFilter, sortBy])

// //   // Reset all filters
// //   const resetFilters = () => {
// //     setSearchTerm("")
// //     setSelectedCategory("")
// //     setSelectedLocation("")
// //     setDateFilter("")
// //     setSortBy("date")
// //     navigate("/events")
// //   }

// //   // Handle booking ticket
// //   const handleBookingClick = (eventId) => {
// //     // Navigate to event details instead of booking
// //     navigate(`/eventDetails/${eventId}`)
// //   }

// //   // Function to render categories filter
// //   const renderCategoryFilters = () => {
// //     const categories = ["Sports", "Concert", "Theater", "Conference", "Workshop", "Exhibition"]

// //     return (
// //       <div className="flex flex-wrap gap-2 mb-4">
// //         <button
// //           className={`px-3 py-1.5 text-sm rounded-full transition-all ${!selectedCategory
// //               ? "bg-purple-600 text-white shadow-md"
// //               : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
// //             }`}
// //           onClick={() => setSelectedCategory("")}
// //         >
// //           All
// //         </button>
// //         {categories.map((cat) => (
// //           <button
// //             key={cat}
// //             className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedCategory?.toLowerCase() === cat.toLowerCase()
// //                 ? "bg-purple-600 text-white shadow-md"
// //                 : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
// //               }`}
// //             onClick={() => setSelectedCategory(cat.toLowerCase())}
// //           >
// //             {cat}
// //           </button>
// //         ))}
// //       </div>
// //     )
// //   }

// //   // Process events to ensure they have all required properties
// //   const processEvents = (events) => {
// //     return events.map(event => ({
// //       ...event,
// //       // Ensure all required properties are available
// //       name: event.name || event.title || "Untitled Event",
// //       description: event.description || "No description available",
// //       location: event.location || "TBA",
// //       available_tickets: event.available_tickets || 0,
// //       capacity: event.capacity || 100,
// //       // Use image_path if available
// //       image: event.image_path || event.image || defaultImage,
// //       // Add price if available
// //       price: event.price || "Free",
// //       // Add rating if available
// //       rating: event.rating || 0,
// //     }))
// //   }

// //   return (
// //     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
// //       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* Header section with gradient background */}
// //         <div className="relative mb-10 rounded-2xl overflow-hidden">
// //           <div className="gradient-bg p-8 md:p-12">
// //             <div className="max-w-3xl animate-fadeIn">
// //               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
// //                 {selectedCategory
// //                   ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`
// //                   : "Discover Amazing Events"}
// //               </h2>
// //               <p className="text-white/80 text-lg mb-6">Find and book tickets for the best events happening near you</p>

// //               {/* Search input with glass effect */}
// //               <div className="relative glass-effect rounded-full overflow-hidden shadow-lg">
// //                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
// //                   <FontAwesomeIcon icon={faSearch} className="text-white/70" />
// //                 </div>
// //                 <input
// //                   type="text"
// //                   placeholder="Search events by name, location, or description..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-white placeholder-white/70 focus:outline-none focus:ring-0"
// //                 />
// //                 {searchTerm && (
// //                   <button
// //                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white"
// //                     onClick={() => setSearchTerm("")}
// //                   >
// //                     <FontAwesomeIcon icon={faTimes} />
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Filters section */}
// //         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 animate-slideUp">
// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
// //             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
// //               <FontAwesomeIcon icon={faFilter} className="mr-2 text-purple-500" />
// //               Filter Events
// //             </h3>

// //             {/* Mobile filter toggle */}
// //             <div className="flex items-center gap-4 w-full md:w-auto">
// //               <button
// //                 className="md:hidden flex items-center justify-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg w-full"
// //                 onClick={() => setShowFilters(!showFilters)}
// //               >
// //                 <FontAwesomeIcon icon={faFilter} className="mr-2" />
// //                 {showFilters ? "Hide Filters" : "Show Filters"}
// //               </button>

// //               {/* Reset filters button */}
// //               <button
// //                 onClick={resetFilters}
// //                 className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
// //               >
// //                 <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5 mr-2" />
// //                 Reset Filters
// //               </button>
// //             </div>
// //           </div>

// //           {/* Desktop filters */}
// //           <div className={`${showFilters ? "block" : "hidden md:block"}`}>
// //             {/* Category filters */}
// //             {renderCategoryFilters()}

// //             {/* Advanced filters toggle */}
// //             <button
// //               onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
// //               className="flex items-center text-sm text-purple-600 dark:text-purple-400 mb-4 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
// //             >
// //               <FontAwesomeIcon
// //                 icon={showAdvancedFilters ? faChevronUp : faChevronDown}
// //                 className="w-3.5 h-3.5 mr-1.5"
// //               />
// //               {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
// //             </button>

// //             {/* Advanced filters */}
// //             <div
// //               className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showAdvancedFilters ? "animate-slideDown" : "hidden"}`}
// //             >
// //               {/* Location filter */}
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 dark:text-gray-500" />
// //                 </div>
// //                 <select
// //                   value={selectedLocation}
// //                   onChange={(e) => setSelectedLocation(e.target.value)}
// //                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// //                 >
// //                   <option value="">All Locations</option>
// //                   {locations.map((location) => (
// //                     <option key={location} value={location}>
// //                       {location}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* Date filter */}
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 dark:text-gray-500" />
// //                 </div>
// //                 <select
// //                   value={dateFilter}
// //                   onChange={(e) => setDateFilter(e.target.value)}
// //                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// //                 >
// //                   <option value="">Any Date</option>
// //                   <option value="today">Today</option>
// //                   <option value="thisWeek">This Week</option>
// //                   <option value="thisMonth">This Month</option>
// //                   <option value="nextMonth">Next Month</option>
// //                 </select>
// //               </div>

// //               {/* Sort by */}
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <FontAwesomeIcon icon={faSortAmountDown} className="text-gray-400 dark:text-gray-500" />
// //                 </div>
// //                 <select
// //                   value={sortBy}
// //                   onChange={(e) => setSortBy(e.target.value)}
// //                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// //                 >
// //                   <option value="date">Sort by Date</option>
// //                   <option value="name">Sort by Name</option>
// //                   <option value="rating">Sort by Rating</option>
// //                   <option value="price">Sort by Price</option>
// //                 </select>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Loading state */}
// //         {loading ? (
// //           <div className="flex flex-col items-center justify-center py-16">
// //             <div className="relative w-20 h-20 mb-4">
// //               <FontAwesomeIcon
// //                 icon={faSpinner}
// //                 spin
// //                 className="text-purple-600 dark:text-purple-400 text-4xl absolute"
// //                 style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
// //               />
// //               <div className="w-full h-full rounded-full border-4 border-purple-200 dark:border-purple-900/30 animate-pulse-glow"></div>
// //             </div>
// //             <p className="text-gray-600 dark:text-gray-400 text-lg">Loading amazing events for you...</p>
// //           </div>
// //         ) : error ? (
// //           <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-xl text-center shadow-sm">
// //             <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
// //             <p>{error}</p>
// //           </div>
// //         ) : filteredEvents.length === 0 ? (
// //           <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 p-8 rounded-xl text-center shadow-sm">
// //             <div className="inline-flex justify-center items-center w-16 h-16 bg-purple-100 dark:bg-purple-800/50 rounded-full mb-4">
// //               <FontAwesomeIcon icon={faTicketAlt} className="text-purple-600 dark:text-purple-300 text-2xl" />
// //             </div>
// //             <h3 className="text-xl font-semibold mb-2">No events found</h3>
// //             <p className="mb-4">No events match your current filters. Try adjusting your search criteria.</p>
// //             <button
// //               className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
// //               onClick={resetFilters}
// //             >
// //               Clear All Filters
// //             </button>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Events count and results summary */}
// //             <div className="flex justify-between items-center mb-6">
// //               <p className="text-sm text-gray-600 dark:text-gray-400">
// //                 Showing{" "}
// //                 <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredEvents.length}</span>{" "}
// //                 event{filteredEvents.length !== 1 ? "s" : ""}
// //                 {selectedCategory && (
// //                   <span>
// //                     {" "}
// //                     in <span className="font-semibold">{selectedCategory}</span>
// //                   </span>
// //                 )}
// //                 {selectedLocation && (
// //                   <span>
// //                     {" "}
// //                     at <span className="font-semibold">{selectedLocation}</span>
// //                   </span>
// //                 )}
// //                 {dateFilter && (
// //                   <span>
// //                     {" "}
// //                     for <span className="font-semibold">{dateFilter.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
// //                   </span>
// //                 )}
// //               </p>
// //             </div>

// //             {/* Events grid */}
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //               {processEvents(filteredEvents).map((event, index) => (
// //                 <div key={event.id} className={`animate-slideUp delay-${(index % 5) * 100}`}>
// //                   <EventCard
// //                     event={event}
// //                     onBookingClick={handleBookingClick}
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default Events


// "use client"

// import { useState, useEffect } from "react"
// import { useLocation, useNavigate } from "react-router-dom"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faSearch,
//   faFilter,
//   faTimes,
//   faSpinner,
//   faCalendarAlt,
//   faMapMarkerAlt,
//   faSortAmountDown,
//   faTicketAlt,
//   faChevronDown,
//   faChevronUp,
// } from "@fortawesome/free-solid-svg-icons"
// import { EventCard } from "../EventCard/EventCard"
// import { useEvents } from "../../context/EventsContext"

// const Events = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const queryParams = new URLSearchParams(location.search)

//   // Get data from context
//   const { loading, error, filterEvents, getLocations } = useEvents()

//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState(queryParams.get("category") || "")
//   const [selectedLocation, setSelectedLocation] = useState("")
//   const [dateFilter, setDateFilter] = useState("")
//   const [sortBy, setSortBy] = useState("date")
//   const [showFilters, setShowFilters] = useState(false)
//   const [filteredEvents, setFilteredEvents] = useState([])
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

//   // Get locations for filter dropdown
//   const locations = getLocations()

//   // Apply filters whenever filter criteria change
//   useEffect(() => {
//     const filtered = filterEvents({
//       searchTerm,
//       category: selectedCategory,
//       location: selectedLocation,
//       dateFilter,
//       sortBy,
//     })
//     setFilteredEvents(filtered)
//   }, [searchTerm, selectedCategory, selectedLocation, dateFilter, sortBy])

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchTerm("")
//     setSelectedCategory("")
//     setSelectedLocation("")
//     setDateFilter("")
//     setSortBy("date")
//     navigate("/events")
//   }

//   // Handle booking ticket
//   const handleBookingClick = (eventId) => {
//     // Navigate to event details instead of booking
//     navigate(`/eventDetails/${eventId}`)
//   }

//   // Function to render categories filter
//   const renderCategoryFilters = () => {
//     const categories = ["Sports", "Concert", "Theater", "Conference", "Workshop", "Exhibition"]

//     return (
//       <div className="flex flex-wrap gap-2 mb-4">
//         <button
//           className={`px-3 py-1.5 text-sm rounded-full transition-all ${!selectedCategory
//               ? "bg-purple-600 text-white shadow-md"
//               : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
//             }`}
//           onClick={() => setSelectedCategory("")}
//         >
//           All
//         </button>
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedCategory?.toLowerCase() === cat.toLowerCase()
//                 ? "bg-purple-600 text-white shadow-md"
//                 : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
//               }`}
//             onClick={() => setSelectedCategory(cat.toLowerCase())}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>
//     )
//   }

//   // Process events to ensure they have all required properties
//   const processEvents = (events) => {
//     return events.map((event) => ({
//       ...event,
//       // Ensure all required properties are available
//       name: event.name || event.title || "Untitled Event",
//       description: event.description || "No description available",
//       location: event.location || "TBA",
//       available_tickets: event.available_tickets || 0,
//       capacity: event.capacity || 100,
//       // Use image_path if available
//       image: event.image_path || event.image || "/placeholder.svg",
//       // Add price if available
//       price: event.price || "Free",
//       // Add rating if available
//       rating: event.rating || 0,
//     }))
//   }

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header section with gradient background */}
//         <div className="relative mb-10 rounded-2xl overflow-hidden">
//           <div className="gradient-bg p-8 md:p-12">
//             <div className="max-w-3xl animate-fadeIn">
//               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//                 {selectedCategory
//                   ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`
//                   : "Discover Amazing Events"}
//               </h2>
//               <p className="text-white/80 text-lg mb-6">Find and book tickets for the best events happening near you</p>

//               {/* Search input with glass effect */}
//               <div className="relative glass-effect rounded-full overflow-hidden shadow-lg">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <FontAwesomeIcon icon={faSearch} className="text-white/70" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search events by name, location, or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-white placeholder-white/70 focus:outline-none focus:ring-0"
//                 />
//                 {searchTerm && (
//                   <button
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white"
//                     onClick={() => setSearchTerm("")}
//                   >
//                     <FontAwesomeIcon icon={faTimes} />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters section */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 animate-slideUp">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
//               <FontAwesomeIcon icon={faFilter} className="mr-2 text-purple-500" />
//               Filter Events
//             </h3>

//             {/* Mobile filter toggle */}
//             <div className="flex items-center gap-4 w-full md:w-auto">
//               <button
//                 className="md:hidden flex items-center justify-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg w-full"
//                 onClick={() => setShowFilters(!showFilters)}
//               >
//                 <FontAwesomeIcon icon={faFilter} className="mr-2" />
//                 {showFilters ? "Hide Filters" : "Show Filters"}
//               </button>

//               {/* Reset filters button */}
//               <button
//                 onClick={resetFilters}
//                 className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
//               >
//                 <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5 mr-2" />
//                 Reset Filters
//               </button>
//             </div>
//           </div>

//           {/* Desktop filters */}
//           <div className={`${showFilters ? "block" : "hidden md:block"}`}>
//             {/* Category filters */}
//             {renderCategoryFilters()}

//             {/* Advanced filters toggle */}
//             <button
//               onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//               className="flex items-center text-sm text-purple-600 dark:text-purple-400 mb-4 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
//             >
//               <FontAwesomeIcon
//                 icon={showAdvancedFilters ? faChevronUp : faChevronDown}
//                 className="w-3.5 h-3.5 mr-1.5"
//               />
//               {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
//             </button>

//             {/* Advanced filters */}
//             <div
//               className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showAdvancedFilters ? "animate-slideDown" : "hidden"}`}
//             >
//               {/* Location filter */}
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 dark:text-gray-500" />
//                 </div>
//                 <select
//                   value={selectedLocation}
//                   onChange={(e) => setSelectedLocation(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 >
//                   <option value="">All Locations</option>
//                   {locations.map((location) => (
//                     <option key={location} value={location}>
//                       {location}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Date filter */}
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 dark:text-gray-500" />
//                 </div>
//                 <select
//                   value={dateFilter}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 >
//                   <option value="">Any Date</option>
//                   <option value="today">Today</option>
//                   <option value="thisWeek">This Week</option>
//                   <option value="thisMonth">This Month</option>
//                   <option value="nextMonth">Next Month</option>
//                 </select>
//               </div>

//               {/* Sort by */}
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FontAwesomeIcon icon={faSortAmountDown} className="text-gray-400 dark:text-gray-500" />
//                 </div>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 >
//                   <option value="date">Sort by Date</option>
//                   <option value="name">Sort by Name</option>
//                   <option value="rating">Sort by Rating</option>
//                   <option value="price">Sort by Price</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Loading state */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <div className="relative w-20 h-20 mb-4">
//               <FontAwesomeIcon
//                 icon={faSpinner}
//                 spin
//                 className="text-purple-600 dark:text-purple-400 text-4xl absolute"
//                 style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
//               />
//               <div className="w-full h-full rounded-full border-4 border-purple-200 dark:border-purple-900/30 animate-pulse-glow"></div>
//             </div>
//             <p className="text-gray-600 dark:text-gray-400 text-lg">Loading amazing events for you...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-xl text-center shadow-sm">
//             <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
//             <p>{error}</p>
//           </div>
//         ) : filteredEvents.length === 0 ? (
//           <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 p-8 rounded-xl text-center shadow-sm">
//             <div className="inline-flex justify-center items-center w-16 h-16 bg-purple-100 dark:bg-purple-800/50 rounded-full mb-4">
//               <FontAwesomeIcon icon={faTicketAlt} className="text-purple-600 dark:text-purple-300 text-2xl" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">No events found</h3>
//             <p className="mb-4">No events match your current filters. Try adjusting your search criteria.</p>
//             <button
//               className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
//               onClick={resetFilters}
//             >
//               Clear All Filters
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Events count and results summary */}
//             <div className="flex justify-between items-center mb-6">
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Showing{" "}
//                 <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredEvents.length}</span>{" "}
//                 event{filteredEvents.length !== 1 ? "s" : ""}
//                 {selectedCategory && (
//                   <span>
//                     {" "}
//                     in <span className="font-semibold">{selectedCategory}</span>
//                   </span>
//                 )}
//                 {selectedLocation && (
//                   <span>
//                     {" "}
//                     at <span className="font-semibold">{selectedLocation}</span>
//                   </span>
//                 )}
//                 {dateFilter && (
//                   <span>
//                     {" "}
//                     for <span className="font-semibold">{dateFilter.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
//                   </span>
//                 )}
//               </p>
//             </div>

//             {/* Events grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {processEvents(filteredEvents).map((event, index) => (
//                 <div key={event.id} className={`animate-slideUp delay-${(index % 5) * 100}`}>
//                   <EventCard event={event} onBookingClick={handleBookingClick}>
//                     <img
//                       src={event.image_path || event.image || "/placeholder.svg"}
//                       alt={event.name}
//                       className="w-full h-48 object-cover rounded-t-lg"
//                       onError={(e) => {
//                         e.target.onerror = null
//                         e.target.src = "/placeholder.svg"
//                       }}
//                     />
//                   </EventCard>
//                 </div>
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
import {
  faSearch,
  faFilter,
  faTimes,
  faSpinner,
  faCalendarAlt,
  faMapMarkerAlt,
  faSortAmountDown,
  faTicketAlt,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { useEvents } from "../../context/EventsContext"
import { motion, AnimatePresence } from "framer-motion"

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage] = useState(12)
  const [paginatedEvents, setPaginatedEvents] = useState([])
  const [totalPages, setTotalPages] = useState(1)

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
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, selectedCategory, selectedLocation, dateFilter, sortBy])

  // Update paginated events when filtered events or current page changes
  useEffect(() => {
    const indexOfLastEvent = currentPage * eventsPerPage
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
    setPaginatedEvents(filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent))
    setTotalPages(Math.ceil(filteredEvents.length / eventsPerPage))
  }, [filteredEvents, currentPage, eventsPerPage])

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedLocation("")
    setDateFilter("")
    setSortBy("date")
    setCurrentPage(1)
    navigate("/events")
  }

  // Handle booking ticket
  const handleBookingClick = (eventId) => {
    // Navigate to event details instead of booking
    navigate(`/eventDetails/${eventId}`)
    // Scroll to top
    window.scrollTo(0, 0)
  }

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Scroll to top of events grid
    document.getElementById("events-grid")?.scrollIntoView({ behavior: "smooth" })
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  // Function to render categories filter
  const renderCategoryFilters = () => {
    const categories = ["Sports", "Concert", "Theater", "Conference", "Workshop", "Exhibition"]

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 text-sm rounded-full transition-all ${!selectedCategory
              ? "bg-purple-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedCategory?.toLowerCase() === cat.toLowerCase()
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            onClick={() => setSelectedCategory(cat.toLowerCase())}
          >
            {cat}
          </motion.button>
        ))}
      </div>
    )
  }

  // Function to render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const maxPagesToShow = 5

    // Logic to show limited page numbers with ellipsis
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're at the start or end
      if (currentPage <= 2) {
        endPage = 4
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3
      }

      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always show last page
      pageNumbers.push(totalPages)
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${currentPage === 1
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/30"
            }`}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
        </motion.button>

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="text-gray-500 dark:text-gray-400">
              ...
            </span>
          ) : (
            <motion.button
              key={page}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === page
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              {page}
            </motion.button>
          ),
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${currentPage === totalPages
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/30"
            }`}
        >
          <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
        </motion.button>
      </div>
    )
  }

  // Process events to ensure they have all required properties
  const processEvents = (events) => {
    return events.map((event) => ({
      ...event,
      // Ensure all required properties are available
      name: event.name || event.title || "Untitled Event",
      description: event.description || "No description available",
      location: event.location || "TBA",
      available_tickets: event.available_tickets || 0,
      capacity: event.capacity || 100,
      // Use image_path if available
      image: event.image_path || event.image || "/placeholder.svg",
      // Add price if available
      price: event.price || "Free",
      // Add rating if available
      rating: event.rating || 0,
    }))
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section with gradient background */}
        <motion.div
          className="relative mb-10 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-12">
            <div className="max-w-3xl">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {selectedCategory
                  ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`
                  : "Discover Amazing Events"}
              </motion.h2>
              <motion.p
                className="text-white/80 text-lg mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Find and book tickets for the best events happening near you
              </motion.p>

              {/* Search input with glass effect */}
              <motion.div
                className="relative backdrop-blur-sm bg-white/20 rounded-full overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-white/70" />
                </div>
                <input
                  type="text"
                  placeholder="Search events by name, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-white placeholder-white/70 focus:outline-none focus:ring-0"
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white"
                    onClick={() => setSearchTerm("")}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Filters section */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
              <FontAwesomeIcon icon={faFilter} className="mr-2 text-purple-500" />
              Filter Events
            </h3>

            {/* Mobile filter toggle */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden flex items-center justify-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg w-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </motion.button>

              {/* Reset filters button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5 mr-2" />
                Reset Filters
              </motion.button>
            </div>
          </div>

          {/* Desktop filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category filters */}
                {renderCategoryFilters()}

                {/* Advanced filters toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center text-sm text-purple-600 dark:text-purple-400 mb-4 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  <FontAwesomeIcon
                    icon={showAdvancedFilters ? faChevronUp : faChevronDown}
                    className="w-3.5 h-3.5 mr-1.5"
                  />
                  {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
                </motion.button>

                {/* Advanced filters */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
                    >
                      {/* Location filter */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <select
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Any Date</option>
                          <option value="today">Today</option>
                          <option value="thisWeek">This Week</option>
                          <option value="thisMonth">This Month</option>
                          <option value="nextMonth">Next Month</option>
                        </select>
                      </div>

                      {/* Sort by */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faSortAmountDown} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="date">Sort by Date</option>
                          <option value="name">Sort by Name</option>
                          <option value="rating">Sort by Rating</option>
                          <option value="price">Sort by Price</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading state */}
        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-20 h-20 mb-4">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-purple-600 dark:text-purple-400 text-4xl absolute"
                style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
              />
              <div className="w-full h-full rounded-full border-4 border-purple-200 dark:border-purple-900/30 animate-pulse-glow"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading amazing events for you...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-xl text-center shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
            <p>{error}</p>
          </motion.div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            className="bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 p-8 rounded-xl text-center shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex justify-center items-center w-16 h-16 bg-purple-100 dark:bg-purple-800/50 rounded-full mb-4">
              <FontAwesomeIcon icon={faTicketAlt} className="text-purple-600 dark:text-purple-300 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="mb-4">No events match your current filters. Try adjusting your search criteria.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors shadow-md"
              onClick={resetFilters}
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Events count and results summary */}
            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {paginatedEvents.length} of {filteredEvents.length}
                </span>{" "}
                event{filteredEvents.length !== 1 ? "s" : ""}
                {selectedCategory && (
                  <span>
                    {" "}
                    in <span className="font-semibold">{selectedCategory}</span>
                  </span>
                )}
                {selectedLocation && (
                  <span>
                    {" "}
                    at <span className="font-semibold">{selectedLocation}</span>
                  </span>
                )}
                {dateFilter && (
                  <span>
                    {" "}
                    for <span className="font-semibold">{dateFilter.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </p>
            </motion.div>

            {/* Events grid */}
            <div id="events-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {processEvents(paginatedEvents).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image_path || event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                      {event.category && (
                        <div className="absolute top-2 left-2 bg-purple-600/80 text-white text-xs px-2 py-0.5 rounded-full">
                          {event.category}
                        </div>
                      )}
                      {event.price && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
                          ${event.price}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
                        {event.name}
                      </h3>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 mr-1" />
                        <span>{event.date || event.event_date || "TBA"}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-3">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 mr-1" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBookingClick(event.id)}
                        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  )
}

export default Events

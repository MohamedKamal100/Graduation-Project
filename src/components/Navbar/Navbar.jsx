

// "use client"

// import { useState, useEffect, useContext, useRef } from "react"
// import { NavLink, Link, useNavigate } from "react-router-dom"
// import logo from "../../assets/logo.jpeg"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faMoon,
//   faSun,
//   faBars,
//   faUser,
//   faTicketAlt,
//   faHeart,
//   faSignOutAlt,
//   faCalendarAlt,
// } from "@fortawesome/free-solid-svg-icons"
// import { UserContext } from "../../context/UserContext"

// export default function Navbar() {
//   const { userLogin, userData, handleLogout } = useContext(UserContext)
//   const [isOpen, setIsOpen] = useState(false)
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark")
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
//   const dropdownRef = useRef(null)
//   const navigate = useNavigate()

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//     if (!darkMode) {
//       document.documentElement.classList.add("dark")
//       localStorage.setItem("theme", "dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//       localStorage.setItem("theme", "light")
//     }
//   }

//   // Check dark mode on page load
//   useEffect(() => {
//     if (localStorage.getItem("theme") === "dark") {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }, [])

//   // Toggle mobile menu
//   const toggleMenu = () => {
//     setIsOpen(!isOpen)
//   }

//   const closeMenu = () => {
//     setIsOpen(false)
//   }

//   // Toggle profile dropdown
//   const toggleProfileDropdown = () => {
//     setProfileDropdownOpen(!profileDropdownOpen)
//   }

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setProfileDropdownOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   // Handle logout
//   function logout() {
//     handleLogout()
//     navigate("/login")
//   }

//   // Get user initials for avatar
//   const getUserInitials = () => {
//     if (!userData) return "U"

//     const fname = userData.fname || ""
//     const lname = userData.lname || ""

//     return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
//   }

//   return (
//     <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         {/* Logo */}
//         {userLogin ? (
//           <Link to="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
//             <img src={logo || "/placeholder.svg"} className="h-8 rounded" alt="Logo" />
//             <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white font-bold text-green-700">
//               EV
//             </span>
//           </Link>
//         ) : (
//           <div className="flex items-center space-x-3 rtl:space-x-reverse">
//             <img src={logo || "/placeholder.svg"} className="h-8 rounded" alt="Logo" />
//             <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white font-bold text-green-700">
//               EV
//             </span>
//           </div>
//         )}

//         {/* Control buttons */}
//         <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
//           {/* Dark mode toggle */}
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 mx-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
//           >
//             <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-gray-900 dark:text-white" size="lg" />
//           </button>

//           {/* User profile or login buttons */}
//           {userLogin ? (
//             <div className="relative" ref={dropdownRef}>
//               <button onClick={toggleProfileDropdown} className="flex items-center space-x-2 focus:outline-none">
//                 {userData?.profile_picture ? (
//                   <img
//                     src={userData.profile_picture || "/placeholder.svg"}
//                     alt="Profile"
//                     className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
//                   />
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">
//                     {getUserInitials()}
//                   </div>
//                 )}
//                 <span className="hidden md:block text-gray-700 dark:text-gray-300">
//                   {userData?.fname ? `${userData.fname} ${userData.lname}` : "User"}
//                 </span>
//               </button>

//               {/* Profile dropdown */}
//               {profileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
//                   <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                     <p className="text-sm font-medium text-gray-900 dark:text-white">
//                       {userData?.fname ? `${userData.fname} ${userData.lname}` : "User"}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email || ""}</p>
//                   </div>

//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                     onClick={() => setProfileDropdownOpen(false)}
//                   >
//                     <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
//                     Profile
//                   </Link>

//                   <Link
//                     to="/tickets"
//                     className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                     onClick={() => setProfileDropdownOpen(false)}
//                   >
//                     <FontAwesomeIcon icon={faTicketAlt} className="w-4 h-4 mr-2" />
//                     My Tickets
//                   </Link>

//                   <Link
//                     to="/favorite"
//                     className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                     onClick={() => setProfileDropdownOpen(false)}
//                   >
//                     <FontAwesomeIcon icon={faHeart} className="w-4 h-4 mr-2" />
//                     Favorites
//                   </Link>

//                   <div className="border-t border-gray-200 dark:border-gray-700 mt-1"></div>

//                   <button
//                     onClick={logout}
//                     className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                   >
//                     <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
//                     Log Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link to="/login">
//                 <button className="text-white bg-blue-700 mx-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//                   Login
//                 </button>
//               </Link>
//               <Link to="/register">
//                 <button className="text-white bg-blue-700 mx-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//                   Register
//                 </button>
//               </Link>
//             </>
//           )}

//           {/* Mobile menu toggle */}
//           <button
//             onClick={toggleMenu}
//             className="p-2 w-10 h-10 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ml-2"
//           >
//             <FontAwesomeIcon icon={faBars} size="lg" />
//           </button>
//         </div>

//         {/* Navigation menu */}
//         <div
//           className={`items-center justify-between ${isOpen ? "block" : "hidden"} w-full md:flex md:w-auto md:order-1`}
//         >
//           {userLogin ? (
//             <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//               <li>
//                 <NavLink
//                   to="/home"
//                   onClick={closeMenu}
//                   className={({ isActive }) =>
//                     `flex items-center py-2 px-3 rounded-md md:p-0 transition ${isActive
//                       ? "text-blue-700 dark:text-blue-400 font-bold"
//                       : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-transparent md:dark:hover:bg-transparent"
//                     }`
//                   }
//                 >
//                   <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 md:hidden" />
//                   Home
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/events"
//                   onClick={closeMenu}
//                   className={({ isActive }) =>
//                     `flex items-center py-2 px-3 rounded-md md:p-0 transition ${isActive
//                       ? "text-blue-700 dark:text-blue-400 font-bold"
//                       : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-transparent md:dark:hover:bg-transparent"
//                     }`
//                   }
//                 >
//                   <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 md:hidden" />
//                   Events
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/tickets"
//                   onClick={closeMenu}
//                   className={({ isActive }) =>
//                     `flex items-center py-2 px-3 rounded-md md:p-0 transition ${isActive
//                       ? "text-blue-700 dark:text-blue-400 font-bold"
//                       : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-transparent md:dark:hover:bg-transparent"
//                     }`
//                   }
//                 >
//                   <FontAwesomeIcon icon={faTicketAlt} className="mr-2 md:hidden" />
//                   Tickets
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/favorite"
//                   onClick={closeMenu}
//                   className={({ isActive }) =>
//                     `flex items-center py-2 px-3 rounded-md md:p-0 transition ${isActive
//                       ? "text-blue-700 dark:text-blue-400 font-bold"
//                       : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-transparent md:dark:hover:bg-transparent"
//                     }`
//                   }
//                 >
//                   <FontAwesomeIcon icon={faHeart} className="mr-2 md:hidden" />
//                   Favorite
//                 </NavLink>
//               </li>
//               {/* Mobile-only profile link */}
//               <li className="md:hidden border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
//                 <NavLink
//                   to="/profile"
//                   onClick={closeMenu}
//                   className={({ isActive }) =>
//                     `flex items-center py-2 px-3 rounded-md transition ${isActive
//                       ? "text-blue-700 dark:text-blue-400 font-bold"
//                       : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                     }`
//                   }
//                 >
//                   <FontAwesomeIcon icon={faUser} className="mr-2" />
//                   Profile
//                 </NavLink>
//               </li>
//               {/* Mobile-only logout button */}
//               <li className="md:hidden">
//                 <button
//                   onClick={() => {
//                     logout()
//                     closeMenu()
//                   }}
//                   className="flex items-center w-full text-left py-2 px-3 rounded-md text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                 >
//                   <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
//                   Log Out
//                 </button>
//               </li>
//             </ul>
//           ) : (
//             ""
//           )}
//         </div>
//       </div>
//     </nav>
//   )
// }"use client"
"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMoon,
  faSun,
  faBars,
  faTimes,
  faUser,
  faTicketAlt,
  faHeart,
  faSignOutAlt,
  faCalendarAlt,
  faSearch,
  faChevronDown,
  faCog, // Added faCog import
} from "@fortawesome/free-solid-svg-icons"

// You can replace this with your actual context
import { useTheme } from "../../context/ThemeContext"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"


const Navbar = () => {
  const { userLogin, userData, handleLogout } = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme?.() || { theme: "light", toggleTheme: () => { } }
  const darkMode = theme === "dark"

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setSearchOpen(false)
  }, [location])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData) return "U"
    const fname = userData.fname || ""
    const lname = userData.lname || ""
    return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
  }

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/home", icon: faCalendarAlt },
    { name: "Events", path: "/events", icon: faCalendarAlt },
    { name: "Tickets", path: "/tickets", icon: faTicketAlt },
    { name: "Favorites", path: "/favorite", icon: faHeart },
  ]

  // Logo animation variants
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  // Navbar animation variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  // Nav item animation variants
  const navItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  }

  // Mobile menu animation variants
  const mobileMenuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  // Search animation variants
  const searchVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "100%",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    exit: {
      width: 0,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed w-full z-50 top-1  px-4 transition-all duration-300 ${isScrolled ? "top-0" : "top-4"}`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl border border-gray-200 dark:border-gray-700 ${isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900 shadow-md"
          } transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          {userLogin ? (
            <Link to="/home" className="flex items-center space-x-3">
              <motion.div variants={logoVariants} whileHover="hover" className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  EV
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    repeatType: "reverse",
                  }}
                />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="self-center text-xl font-bold whitespace-nowrap dark:text-white bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
              >
                EventVibe
              </motion.span>
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <motion.div variants={logoVariants} whileHover="hover" className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  EV
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    repeatType: "reverse",
                  }}
                />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="self-center text-xl font-bold whitespace-nowrap dark:text-white bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
              >
                EventVibe
              </motion.span>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {userLogin && (
              <div className="flex items-center space-x-1">
                {navLinks.map((link, index) => (
                  <motion.div key={link.path} variants={navItemVariants} whileHover="hover" custom={index}>
                    <Link
                      to={link.path}
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                        }`}
                    >
                      {location.pathname === link.path && (
                        <motion.div
                          layoutId="activeNavBackground"
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl -z-10"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Search button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faSearch} />
            </motion.button>

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </motion.button>

            {/* User profile or login buttons */}
            {userLogin ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {userData?.profile_picture ? (
                    <img
                      src={userData.profile_picture || "/placeholder.svg"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                      {getUserInitials()}
                    </div>
                  )}
                  <span className="hidden md:flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {userData?.fname ? `${userData.fname}` : "User"}
                    <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
                  </span>
                </motion.button>

                {/* Profile dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {userData?.fname ? `${userData.fname} ${userData.lname}` : "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email || ""}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                          Profile
                        </Link>

                        <Link
                          to="/tickets"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FontAwesomeIcon
                            icon={faTicketAlt}
                            className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500"
                          />
                          My Tickets
                        </Link>

                        <Link
                          to="/favorite"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FontAwesomeIcon icon={faHeart} className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                          Favorites
                        </Link>

                        {userData?.role === "admin" && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                            Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className="w-4 h-4 mr-3 text-red-500 dark:text-red-400"
                          />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </motion.button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial="hidden" animate="visible" exit="exit" variants={searchVariants} className="px-4 pb-3">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search events, venues, artists..."
                  className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl"
              variants={mobileMenuVariants}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </motion.button>
                </div>

                {userLogin ? (
                  <div className="space-y-1">
                    {navLinks.map((link, index) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center py-3 px-4 rounded-xl text-base font-medium transition-colors ${location.pathname === link.path
                          ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                      >
                        <FontAwesomeIcon icon={link.icon} className="w-5 h-5 mr-3" />
                        {link.name}
                      </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to="/profile"
                        className="flex items-center py-3 px-4 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-3" />
                        Profile
                      </Link>

                      {userData?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center py-3 px-4 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <FontAwesomeIcon icon={faCog} className="w-5 h-5 mr-3" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full py-3 px-4 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-2"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4">
                    <Link to="/login" className="block w-full">
                      <button className="w-full py-3 px-4 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link to="/register" className="block w-full">
                      <button className="w-full py-3 px-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all">
                        Register
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar

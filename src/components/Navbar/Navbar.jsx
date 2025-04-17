

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

import { useNavigate } from "react-router-dom"
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

  const navigate = useNavigate()

  const onLogout = () => {
    handleLogout()
    navigate("/")
  }
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
                          onClick={onLogout}
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
                        onClick={onLogout}
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



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

import { useState, useEffect, useContext, useRef } from "react"
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import logo from "../../assets/logo.jpeg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMoon,
  faSun,
  faBars,
  faUser,
  faTicketAlt,
  faHeart,
  faSignOutAlt,
  faCalendarAlt,
  faCog,
} from "@fortawesome/free-solid-svg-icons"
import { UserContext } from "../../context/UserContext"

export default function Navbar() {
  const { userLogin, userData, handleLogout } = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  // Check dark mode on page load
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle logout
  function logout() {
    handleLogout()
    navigate("/login")
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData) return "U"

    const fname = userData.fname || ""
    const lname = userData.lname || ""

    return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
  }

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-30 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        {userLogin ? (
          <Link to="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo || "/placeholder.svg"} className="h-8 rounded" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white font-bold text-green-700">
              EV
            </span>
          </Link>
        ) : (
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo || "/placeholder.svg"} className="h-8 rounded" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white font-bold text-green-700">
              EV
            </span>
          </div>
        )}

        {/* Control buttons */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 mx-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-gray-900 dark:text-white" size="lg" />
          </button>

          {/* User profile or login buttons */}
          {userLogin ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleProfileDropdown} className="flex items-center space-x-2 focus:outline-none">
                {userData?.profile_picture ? (
                  <img
                    src={userData.profile_picture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">
                    {getUserInitials()}
                  </div>
                )}
                <span className="hidden md:block text-gray-700 dark:text-gray-300">
                  {userData?.fname ? `${userData.fname} ${userData.lname}` : "User"}
                </span>
              </button>

              {/* Profile dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData?.fname ? `${userData.fname} ${userData.lname}` : "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email || ""}</p>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                    Profile
                  </Link>

                  <Link
                    to="/tickets"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faTicketAlt} className="w-4 h-4 mr-2" />
                    My Tickets
                  </Link>

                  <Link
                    to="/favorite"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faHeart} className="w-4 h-4 mr-2" />
                    Favorites
                  </Link>

                  {userData?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 mt-1"></div>

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="text-white bg-blue-700 mx-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="text-white bg-blue-700 mx-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Register
                </button>
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMenu}
            className="p-2 w-10 h-10 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ml-2"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* Navigation menu */}
        <div
          className={`items-center justify-between ${isOpen ? "block" : "hidden"} w-full md:flex md:w-auto md:order-1`}
        >
          {userLogin ? (
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <NavLink
                  to="/home"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-3 rounded-md md:p-0 transition ${isActive
                      ? "text-blue-700 dark:text-blue-400 font-bold"
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-transparent md:dark:hover:bg-transparent"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 md:hidden" />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/events"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-3 rounded-md md:p-0 transition ${isActive
                      ? "text-blue-700 dark:text-blue-400 font-bold"
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-transparent md:dark:hover:bg-transparent"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 md:hidden" />
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tickets"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-3 rounded-md md:p-0 transition ${isActive
                      ? "text-blue-700 dark:text-blue-400 font-bold"
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-transparent md:dark:hover:bg-transparent"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faTicketAlt} className="mr-2 md:hidden" />
                  Tickets
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/favorite"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-3 rounded-md md:p-0 transition ${isActive
                      ? "text-blue-700 dark:text-blue-400 font-bold"
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-transparent md:dark:hover:bg-transparent"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faHeart} className="mr-2 md:hidden" />
                  Favorite
                </NavLink>
              </li>
              {/* Mobile-only profile link */}
              <li className="md:hidden border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-3 rounded-md transition ${isActive
                      ? "text-blue-700 dark:text-blue-400 font-bold"
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Profile
                </NavLink>
              </li>
              {userData?.role === "admin" && (
                <li className="md:hidden">
                  <NavLink
                    to="/admin"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center py-2 px-3 rounded-md transition ${isActive
                        ? "text-blue-700 dark:text-blue-400 font-bold"
                        : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    Admin Dashboard
                  </NavLink>
                </li>
              )}
              {/* Mobile-only logout button */}
              <li className="md:hidden">
                <button
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                  className="flex items-center w-full text-left py-2 px-3 rounded-md text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Log Out
                </button>
              </li>
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  )
}


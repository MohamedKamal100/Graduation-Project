// // "use client"

// // import { Outlet, useNavigate } from "react-router-dom"
// // import { useContext } from "react"
// // import { UserContext } from "../../context/UserContext"
// // import AdminSidebar from "./AdminSidebar"
// // import { ThemeToggle } from "./ThemeToggle"
// // import Navbar from "../Navbar/Navbar"

// // const AdminLayout = () => {
// //   const { userData, handleLogout } = useContext(UserContext)
// //   const navigate = useNavigate()

// //   // Handle logout from admin sidebar
// //   const handleAdminLogout = () => {
// //     handleLogout()
// //     navigate("/login")
// //   }

// //   return (
// //     <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

// //       <AdminSidebar onLogout={handleAdminLogout} />
// //       <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
// //         <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
// //           <div className="flex flex-1 items-center justify-end gap-4">
// //             <div className="flex items-center space-x-2">

// //               <span className="text-sm font-medium hidden md:inline-block">Welcome, {userData?.fname || "Admin"}</span>
// //               <ThemeToggle />
// //             </div>
// //           </div>
// //         </header>

// //         <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">

// //           <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }

// // export default AdminLayout

// "use client"

// import { Outlet, useNavigate } from "react-router-dom"
// import { useContext } from "react"
// import { UserContext } from "../../context/UserContext"
// import AdminSidebar from "./AdminSidebar"
// import { ThemeToggle } from "./ThemeToggle"

// const AdminLayout = () => {
//   const { userData, handleLogout } = useContext(UserContext)
//   const navigate = useNavigate()

//   // Handle logout from admin sidebar
//   const handleAdminLogout = () => {
//     handleLogout()
//     navigate("/login")
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
//       {/* Fixed sidebar */}
//       <AdminSidebar onLogout={handleAdminLogout} />

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
//         {/* Fixed header */}
//         <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 md:px-6 shadow-sm">
//           <div className="flex flex-1 items-center justify-between">
//             <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm font-medium hidden md:inline-block">Welcome, {userData?.fname || "Admin"}</span>
//               <ThemeToggle />
//             </div>
//           </div>
//         </header>

//         {/* Main content */}
//         <main className="flex-1 p-4 md:p-6 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }

// export default AdminLayout

"use client"

import { Outlet, useNavigate, Link } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { UserContext } from "../../context/UserContext"
import AdminSidebar from "./AdminSidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faCalendarAlt, faBell, faUser, faMoon, faSun } from "@fortawesome/free-solid-svg-icons"

const AdminLayout = () => {
  const { userData, handleLogout } = useContext(UserContext)
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme === "true") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
      document.body.classList.add("dark")
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      document.body.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      document.body.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }

  // Handle logout from admin sidebar
  const handleAdminLogout = () => {
    handleLogout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Fixed sidebar */}
      <AdminSidebar onLogout={handleAdminLogout} isDark={isDark} toggleDarkMode={toggleDarkMode} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        {/* Fixed navbar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            {/* Left side - Navigation links */}
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden md:block">Admin Panel</h1>
              <nav className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </Link>
                <Link
                  to="/events"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Events
                </Link>
              </nav>
            </div>

            {/* Right side - User info and controls */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 relative">
                <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userData?.fname || "Admin"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{userData?.role || "Administrator"}</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <FontAwesomeIcon
                  icon={isDark ? faSun : faMoon}
                  className={`w-5 h-5 ${isDark ? "text-yellow-400" : "text-blue-500"}`}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout


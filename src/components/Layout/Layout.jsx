"use client"

import { Outlet, useLocation } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { UserContext } from "../../context/UserContext"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../admin/AdminSidebar"
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { ThemeToggle } from "../admin/ThemeToggle"

const Layout = () => {
  const { userLogin, userData, handleLogout } = useContext(UserContext)
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = userData?.role === "admin"
  const isAdminRoute = location.pathname.startsWith("/admin")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Get sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true")
    }
  }, [])

  // Update sidebar state when it changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedState = localStorage.getItem("sidebarCollapsed")
      if (savedState !== null) {
        setSidebarCollapsed(savedState === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Handle logout from admin sidebar
  const handleAdminLogout = () => {
    handleLogout()
    navigate("/login")
  }

  // Calculate main content margin based on sidebar state
  const mainContentClass = sidebarCollapsed
    ? "ml-0 md:ml-20 transition-all duration-300 ease-in-out"
    : "ml-0 md:ml-64 transition-all duration-300 ease-in-out"

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {userLogin && isAdminRoute ? (
        <div className="flex min-h-screen">
          <AdminSidebar onLogout={handleAdminLogout} />
          <div className={`flex-1 flex flex-col min-w-0 ${mainContentClass}`}>
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
              <div className="flex flex-1 items-center justify-end gap-4">
                <ThemeToggle />
                {/* Add other header elements here */}
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <main className="">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

export default Layout

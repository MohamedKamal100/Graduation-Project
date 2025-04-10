"use client"

import { Outlet, useLocation } from "react-router-dom"
import { useContext } from "react"

import AdminSidebar from "../admin/AdminSidebar"
import { UserContext } from "../../context/UserContext"
import { useNavigate } from "react-router-dom"
import Navbar from "../Navbar/Navbar"

const Layout = () => {
  const { userLogin, userData, handleLogout } = useContext(UserContext)
  const location = useLocation()
  const navigate = useNavigate()

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin")

  // Handle logout from admin sidebar
  const handleAdminLogout = () => {
    handleLogout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Render AdminSidebar only for admin users */}
      {userLogin && userData?.role === "admin" && <AdminSidebar onLogout={handleAdminLogout} />}

      {/* Main content with padding for sidebar when on admin routes */}
      <main className={`pt-16 ${userLogin && userData?.role === "admin" ? "md:ml-64" : ""}`}>
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout


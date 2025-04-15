"use client"

import { Outlet, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import AdminSidebar from "./AdminSidebar"
import { ThemeToggle } from "./ThemeToggle"

const AdminLayout = () => {
  const { userData, handleLogout } = useContext(UserContext)
  const navigate = useNavigate()

  // Handle logout from admin sidebar
  const handleAdminLogout = () => {
    handleLogout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <AdminSidebar onLogout={handleAdminLogout} />
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium hidden md:inline-block">Welcome, {userData?.fname || "Admin"}</span>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

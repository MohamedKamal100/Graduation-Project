"use client"

import { useState, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTachometerAlt,
  faCalendarAlt,
  faUsers,
  faTicketAlt,
  faChartLine,
  faCog,
  faSignOutAlt,
  faBars,
  faTimes,
  faUserShield,
  faComments,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons"

const AdminSidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const menuItems = [
    { path: "/admin", icon: faTachometerAlt, label: "Dashboard" },
    { path: "/admin/events", icon: faCalendarAlt, label: "Events" },
    { path: "/admin/users", icon: faUsers, label: "Users" },
    { path: "/admin/tickets", icon: faTicketAlt, label: "Tickets" },
    { path: "/admin/reports", icon: faChartLine, label: "Reports" },
    { path: "/admin/reviews", icon: faComments, label: "Reviews" },
    { path: "/admin/payments", icon: faMoneyBill, label: "Payments" },
    { path: "/admin/settings", icon: faCog, label: "Settings" },
  ]

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-20 left-4 z-40 md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md text-gray-700 dark:text-gray-300"
      >
        <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleMobileSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-md z-20 transition-all duration-300 ${collapsed ? "w-20" : "w-64"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center h-12 w-12 mx-auto mt-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={collapsed ? faBars : faTimes} className="w-5 h-5" />
          </button>

          {/* Admin info */}
          <div className={`flex items-center p-4 ${collapsed ? "justify-center" : "justify-start"}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faUserShield} />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">Admin Panel</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage your platform</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-3 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-md transition-colors ${isActive || (item.path !== "/admin" && location.pathname.startsWith(item.path))
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${collapsed ? "justify-center" : "justify-start"}`
                    }
                  >
                    <FontAwesomeIcon icon={item.icon} className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onLogout}
              className={`flex items-center p-3 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors ${collapsed ? "justify-center w-full" : "justify-start"
                }`}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar


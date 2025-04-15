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
  faComments,
  faMoneyBill,
  faMoon,
  faSun,
  faChartBar,
  faQuestionCircle,
  faChevronLeft,
  faChevronRight,
  faGem,
} from "@fortawesome/free-solid-svg-icons"
import { useMediaQuery } from "../../hooks/useMediaQuery"
import { useTheme } from "./ThemeProvider"

const AdminSidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { theme, toggleTheme } = useTheme()
  const darkMode = theme === "dark"

  // Get sidebar state from localStorage or default to expanded
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setCollapsed(savedState === "true")
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Close mobile sidebar when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileOpen(false)
    }
  }, [isMobile, mobileOpen])

  // Group menu items by category
  const menuGroups = [
    {
      title: "Main",
      items: [
        { path: "/admin", icon: faTachometerAlt, label: "Dashboard" },
        { path: "/admin/events", icon: faCalendarAlt, label: "Events" },
        { path: "/admin/users", icon: faUsers, label: "Users" },
      ],
    },
    {
      title: "Management",
      items: [
        { path: "/admin/tickets", icon: faTicketAlt, label: "Tickets" },
        { path: "/admin/payments", icon: faMoneyBill, label: "Payments" },
        { path: "/admin/reviews", icon: faComments, label: "Reviews" },
      ],
    },
    {
      title: "Analytics",
      items: [
        { path: "/admin/reports", icon: faChartLine, label: "Reports" },
        { path: "/admin/analytics", icon: faChartBar, label: "Analytics" },
      ],
    },
    {
      title: "System",
      items: [
        { path: "/admin/settings", icon: faCog, label: "Settings" },
        { path: "/admin/help", icon: faQuestionCircle, label: "Help Center" },
      ],
    },
  ]

  // Calculate sidebar width based on state
  const sidebarWidth = collapsed ? "w-20" : "w-64"
  const sidebarTransition = "transition-all duration-300 ease-in-out"

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md text-primary hover:text-white hover:bg-primary dark:text-primary-dark transition-all duration-300 hover-scale"
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-40 ${sidebarTransition} ${sidebarWidth} ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and brand */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary-dark/20 dark:to-accent/20">
            <div className={`flex items-center ${collapsed ? "justify-center w-full" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white shadow-md animate-pulse">
                <FontAwesomeIcon icon={faGem} />
              </div>
              {!collapsed && (
                <div className="ml-3 transition-opacity duration-200 animate-slideRight">
                  <p className="font-semibold text-gray-900 dark:text-white">Ev</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                </div>
              )}
            </div>
            {/* Toggle button for desktop */}
            <button
              onClick={toggleSidebar}
              className={`hidden md:flex items-center justify-center h-8 w-8 rounded-md text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary-dark/20 dark:hover:text-primary-dark transition-colors ${collapsed ? "mx-auto" : ""
                } hover-scale`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {menuGroups.map((group, groupIndex) => (
              <div
                key={group.title}
                className={`mb-6 ${collapsed ? "text-center" : ""}`}
                style={{ animationDelay: `${groupIndex * 100}ms` }}
              >
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2 transition-opacity duration-200 animate-fadeIn">
                    {group.title}
                  </h3>
                )}
                <ul className="space-y-1">
                  {group.items.map((item, itemIndex) => (
                    <li
                      key={item.path}
                      className="animate-slideRight"
                      style={{ animationDelay: `${groupIndex * 100 + itemIndex * 50}ms` }}
                    >
                      <NavLink
                        to={item.path}
                        end={item.path === "/admin"}
                        className={({ isActive }) =>
                          `flex items-center p-2 rounded-md transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-primary/20 to-accent/10 text-primary dark:from-primary-dark/30 dark:to-accent/20 dark:text-primary-dark font-medium shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary-dark/20 dark:hover:text-primary-dark"
                          } ${collapsed ? "justify-center" : "justify-start"}`
                        }
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={`w-5 h-5 ${collapsed ? "" : "mr-3"} transition-transform duration-300 hover:scale-110`}
                        />
                        {!collapsed && <span className="truncate transition-opacity duration-200">{item.label}</span>}
                        {collapsed && <span className="sr-only">{item.label}</span>}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary-dark/10 dark:to-accent/10">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary-dark/20 dark:hover:text-primary-dark transition-colors ${collapsed ? "justify-center" : "justify-start"
                } hover-scale`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <FontAwesomeIcon
                icon={darkMode ? faSun : faMoon}
                className={`w-5 h-5 ${collapsed ? "" : "mr-3"} ${darkMode ? "text-yellow-400 animate-pulse" : "text-indigo-400"
                  }`}
              />
              {!collapsed && (
                <span className="transition-opacity duration-200">{darkMode ? "Light Mode" : "Dark Mode"}</span>
              )}
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className={`flex items-center w-full p-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors ${collapsed ? "justify-center" : "justify-start"
                } hover-scale`}
              aria-label="Logout"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span className="transition-opacity duration-200">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar

"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./navbar.css"   

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Listen for storage events (login/logout in other tabs)
    window.addEventListener("storage", () => {
      const token = localStorage.getItem("token")
      setIsLoggedIn(!!token)
    })

    return () => {
      window.removeEventListener("storage", () => {})
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div>
          <Link to="/" className="navbar-logo">
            TodoList-App
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <div className="navbar-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            {isLoggedIn && (
              <Link to="/todos" className="nav-link">
                Todos
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="auth-buttons">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "./navbar.css"   

export default function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const updateLoginStatus = () => {
      const token = localStorage.getItem("token")
      setIsLoggedIn(!!token)
    }
  
    updateLoginStatus() // check initially
  
    window.addEventListener("storage", updateLoginStatus)
    window.addEventListener("login", updateLoginStatus)
    window.addEventListener("logout", updateLoginStatus)
  
    return () => {
      window.removeEventListener("storage", updateLoginStatus)
      window.removeEventListener("login", updateLoginStatus)
      window.removeEventListener("logout", updateLoginStatus)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.dispatchEvent(new Event("logout"))
    setIsLoggedIn(false)
    navigate("/")
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

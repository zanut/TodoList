"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import API from "../../api/axios"
import { SignupForm } from "../../types/auth"
import "./Signup.css"


export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const password = watch("password")

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const { confirmPassword, ...signupData } = data
      await API.post("/signup", signupData)
      alert("Signup successful! Please log in.")
      navigate("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create an account</h2>
          <p>Enter your details to create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          {error && <div className="signup-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              placeholder="Choose a username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
              })}
            />
            {errors.username && <p className="signup-error">{errors.username.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.password && <p className="signup-error">{errors.password.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="signup-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="signup-submit">
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="signup-footer">
          Already have an account?{" "}
          <a href="/login">
            Log in
          </a>
        </div>
      </div>
    </div>
  )
}

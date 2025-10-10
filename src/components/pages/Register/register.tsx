"use client"

import type React from "react"
import { useEffect, useState } from "react"
import "./register.css"

export function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    useEffect(() => {
    localStorage.removeItem("user")
  }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match")
            return
        }
localStorage.setItem("user", JSON.stringify(formData))
        console.log("Form submitted:", formData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-form-header">
                    <h2 className="register-form-title">Sign up</h2>
                    <p className="register-form-subtitle">Complete the form to register on the platform</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <div className="email-input-wrapper">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input email-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        <p className="form-help-text">Minimum 8 characters</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <button type="submit" className="register-button">
                        Sign up
                    </button>

                    <p className="register-footer">
                        Are you registered?{" "}
                        <a href="/login" className="register-link">
                            Sign in here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}

"use client"

import type React from "react"
import { useState } from "react"
import "./login.css"
import { useNavigate } from "react-router-dom"

export function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        localStorage.setItem("user", JSON.stringify({ email: formData.email, name: "John Doe" }))
        navigate("/");
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

                <form onSubmit={handleSubmit} className="register-form">
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
                    </div>

                    <button type="submit" className="register-button">
                        Login
                    </button>

                    <p className="register-footer">
                        ¿Do you want to sign up?{" "}
                        <a href="/register" className="register-link">
                            Sign up here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}

"use client"

import type React from "react"
import { useState } from "react"
import "./login.css"
import { useNavigate } from "react-router-dom"
import { authService } from '../../../services/auth.service.ts';


export function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            authService.login(formData.email, formData.password).then(() => {
                navigate("/");
            })
        } catch (error) {
            console.log(error)
        }
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

                </form>
            </div>
        </div>
    )
}

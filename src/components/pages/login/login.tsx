"use client"

import type React from "react"
import { useState } from "react"
import "./login.css"
import { useNavigate } from "react-router-dom"
import { authService } from '../../../services/auth.service.ts';
import Swal from 'sweetalert2';


export function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.email.trim() || !formData.password.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please enter both email and password.',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        setLoading(true);
        try {
            await authService.login(formData.email, formData.password);
            
            Swal.fire({
                icon: 'success',
                title: 'Welcome!',
                text: 'Login successful',
                timer: 1500,
                showConfirmButton: false
            });
            
            navigate("/");
        } catch (error: any) {
            console.error('Login error:', error);
            
            let errorMessage = 'An error occurred during login. Please try again.';
            
            if (error?.response?.status === 401) {
                errorMessage = 'Invalid email or password. Please check your credentials.';
            } else if (error?.response?.status === 403) {
                errorMessage = 'Your account is not authorized to access this system.';
            } else if (error?.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage,
                confirmButtonColor: '#3B82F6'
            });
        } finally {
            setLoading(false);
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
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your SafeStore account</p>
                </div>

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

                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login'}
                    </button>

                </form>
            </div>
        </div>
    )
}

import type React from "react"
import { useState } from "react"

export function Register() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match")
            return
        }

        // Handle registration logic here
        console.log("Form submitted:", formData)

        // After successful registration, redirect to login page
        router.push("/login")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="w-full max-w-md space-y-8">
            {/* Logo and Header */}
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">SafeStore</h1>
                </div>
                <h2 className="text-2xl font-semibold text-balance">Create your account</h2>
                <p className="text-muted-foreground text-sm">Start shopping securely today</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full h-11 text-base font-medium">
                    Sign Up
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-foreground hover:underline underline-offset-4">
                        Log in
                    </Link>
                </p>
            </form>

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground px-8">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                    Privacy Policy
                </Link>
            </p>
        </div>
    )
}

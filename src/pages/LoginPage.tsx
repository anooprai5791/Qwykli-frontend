"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Send, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [otp, setOtp] = useState<string>("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setLoading(true)

    try {
      // Call your API to send OTP
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP")
      }

      // Move to OTP verification step
      setStep("otp")
    } catch (err) {
      console.error("Error sending OTP:", err)
      setError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP")
      return
    }

    setLoading(true)

    try {
      // Call your API to verify OTP
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP")
      }

      // Redirect to home page or dashboard after successful login
      window.location.href = "/"
    } catch (err) {
      console.error("Error verifying OTP:", err)
      setError("Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">Welcome to Qwickly</CardTitle>
          </div>
          <CardDescription>
            {step === "phone" ? "Enter your phone number to continue" : "Enter the OTP sent to your phone"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12 py-6 text-lg"
                    maxLength={10}
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+91</div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-6" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-5 w-5 mr-2" />
                    Send OTP
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500 mb-2">We've sent a 4-digit code to +91 {phoneNumber}</div>
                <Input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="py-6 text-lg text-center tracking-widest"
                  maxLength={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-6" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Verify OTP
                  </div>
                )}
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-gray-500" onClick={() => setStep("phone")} type="button">
                  Change phone number
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

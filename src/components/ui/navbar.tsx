"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MapPin, ShoppingCart, User } from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"

interface NavbarProps {
  cartCount: number
}

export function Navbar({ cartCount }: NavbarProps) {
  const [location, setLocation] = useState<string>("Loading location...")

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Here you would call your backend API with the coordinates
            // For example: const response = await fetch(`your-api/location?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);

            // For now, we'll use a free geocoding API as an example
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
            )
            const data = await response.json()

            // Extract city or locality from the response
            const locationName =
              data.address.city || data.address.town || data.address.village || data.address.suburb || "Your location"

            setLocation(locationName)
          } catch (error) {
            console.error("Error fetching location:", error)
            setLocation("Location unavailable")
          }
        },
        () => {
          setLocation("Location access denied")
        },
      )
    } else {
      setLocation("Geolocation not supported")
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-black">
        Qwykli
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="flex items-center text-gray-700 hover:text-black">
          <MapPin className="h-5 w-5 mr-1" />
          <span className="text-sm max-w-[120px] truncate">{location}</span>
        </Button>

        <Link to="/cart">
          <Button variant="ghost" className="relative p-2">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-black text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                {cartCount}
              </Badge>
            )}
          </Button>
        </Link>

        <Link to="/login">
          <Button variant="ghost" className="p-2">
            <User className="h-6 w-6 text-gray-700" />
          </Button>
        </Link>
      </div>
    </nav>
  )
}

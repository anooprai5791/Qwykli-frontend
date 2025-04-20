"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "../components/ui/navbar"
import { CategorySlider } from "../components/ui/category-slider"
import type { Category } from "../types"

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState<number>(0)

  // Create refs for each category section
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement }>({})

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories")

        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError("Failed to load categories. Please try again later.")
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }

    // Fetch cart items count
    const fetchCartCount = async () => {
      try {
        // Replace with your actual cart API endpoint
        // const response = await fetch('http://localhost:5000/api/cart/count');
        // const data = await response.json();
        // setCartCount(data.count);

        // For now, we'll use a mock value
        setCartCount(3)
      } catch (err) {
        console.error("Error fetching cart count:", err)
      }
    }

    fetchCategories()
    fetchCartCount()
  }, [])

  const scrollToCategory = (categoryId: string) => {
    if (categoryRefs.current[categoryId]) {
      categoryRefs.current[categoryId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={cartCount} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={cartCount} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded-md" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cartCount} />

      <main className="container mx-auto px-4 pt-20 pb-10">
        {/* Main Categories Slider */}
        <div className="my-8">
          <CategorySlider items={categories} title="Services" onCategoryClick={scrollToCategory} />
        </div>

        {/* Category Sections with Subcategories */}
        {categories.map((category) => (
          <div
            key={category._id}
            ref={(el) => {
              if (el && category._id) {
                categoryRefs.current[category._id] = el
              }
            }}
            className="my-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-black">{category.name}</h2>
            {category.subcategories && category.subcategories.length > 0 ? (
              <CategorySlider items={category.subcategories} title="Subcategories" isSubcategory={true} />
            ) : (
              <p className="text-gray-500">No subcategories available</p>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}

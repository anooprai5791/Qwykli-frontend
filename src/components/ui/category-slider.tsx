"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"
import { Card } from "./card"
import type { Category, Subcategory } from "../../types"

interface CategorySliderProps {
  items: Category[] | Subcategory[]
  title: string
  onCategoryClick?: (id: string) => void
  isSubcategory?: boolean
}

export function CategorySlider({ items, title, onCategoryClick, isSubcategory = false }: CategorySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { current } = sliderRef
      const scrollAmount = 200

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="relative my-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <Card
            key={isSubcategory ? (item as Subcategory).name : (item as Category)._id}
            className="flex-shrink-0 w-[150px] cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              if (!isSubcategory && onCategoryClick && (item as Category)._id) {
                onCategoryClick((item as Category)._id as string)
              }
            }}
          >
            <div className="p-4 flex flex-col items-center text-center">
              {item.icon ? (
                <img src={item.icon || "/placeholder.svg"} alt={item.name} className="w-12 h-12 mb-2 object-contain" />
              ) : (
                <div className="w-12 h-12 mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">{item.name.charAt(0)}</span>
                </div>
              )}
              <h3 className="font-medium text-sm mt-2">{item.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

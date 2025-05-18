export interface Subcategory {
    _id?: string
    name: string
    description?: string
    icon?: string
    createdAt?: string
    updatedAt?: string
  }
  
  export interface Category {
    _id?: string
    name: string
    description?: string
    icon?: string
    subcategories: Subcategory[]
    isActive: boolean
    createdAt?: string
    updatedAt?: string
  }
  
  export interface User {
    _id?: string
    phone: string
    isAdmin?: boolean
    otp?: string
    otpExpires?: Date
    isVerified?: boolean
    name?: string
    email?: string
    address?: string
    location?: {
      type: string
      coordinates: number[]
    }
    createdAt?: Date
  }
  
  export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
  }
  
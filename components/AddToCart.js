'use client'

import { useCart } from "@/context/CartContext"

export default function AddToCart({ productId }) {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart(productId)
    }

    return (
        <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
            Add to Cart
        </button>
    )
}
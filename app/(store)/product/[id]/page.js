
import AddToCart from "@/components/AddToCart"
import getProduct from "@/lib/getProduct"
import getProducts from "@/lib/getProducts"
import Image from "next/image"

export async function generateStaticParams() {
    const products = await getProducts()

    return products.map((product) => ({
        id: String(product.id),
    }))
}

export default async function ProductPage({ params }) {
    const { id } = params
    const product = await getProduct(id)

    if (!product) {
        return <div>Product not found</div>
    }

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
                <Image
                    src={product.image}
                    alt={product.title}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full rounded-lg"
                />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                    <h1 className="text-4xl font-bold">{product.title}</h1>
                    <p className="text-lg text-gray-600 mt-2">{product.description}</p>
                    <p className="text-2xl font-semibold mt-4">${product.price.toFixed(2)}</p>
                </div>
                <div className="mt-4">
                    <AddToCart productId={product.id} />
                </div>
            </div>
        </div>
    )
}
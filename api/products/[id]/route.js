
import { NextResponse } from "next/server";
import products from '../products.json'

export async function GET(request, { params }) {
    const { id } = params
    const product = products.find(p => p.id === parseInt(id))

    if (!product) {
        return new NextResponse('Product not found', { status: 404 })
    }

    return NextResponse.json(product)
}

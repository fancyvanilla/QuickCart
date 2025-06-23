import { getAuth } from '@clerk/nextjs/server'
import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import {v2 as cloudinary} from 'cloudinary';
import connectDB from '@/config/db';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
    const {userId}= getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const products=await request.json();
        if (!Array.isArray(products) || products.length === 0) {
            console.error("Invalid products array:", products);
            return NextResponse.json({ success: false, message: 'No products provided' }, { status: 400 });
        }
        //TODO:also we need smth to check if the products are valid
        const products_to_add=await Promise.all(
            products.map(async(product) => {
                const images_links=await Promise.all(product.image.map(async (product) => {
                    const res = await cloudinary.uploader.upload(product, {
                        folder: 'products',
                        resource_type: 'auto',
                    });
                    return res.secure_url;
                }))
                return {
                    userId,
                    name: product.name,
                    price: product.price,
                    offerPrice: product.offerPrice,
                    image: images_links,
                    category: product.category,
                    date: Date.now(),
                };
    }))
    await connectDB();
    await Product.insertMany(products_to_add);
    return NextResponse.json({ success: true }, { status: 200 });
        
    } catch (error) {
        console.error("Error adding products:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

}
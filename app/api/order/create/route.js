import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';
import { inngest } from '@/config/innges';
import User from '@/models/User';

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address,items } = await request.json();
        if (!address || ittems.length === 0) {
            return NextResponse.json({ success: false, message: 'Address and items are required' }, { status: 400 });
        }
        await connectDB();
        const amount=await items.reduce(
            async (acc,item) => {
                const product=await Product.findById(item.product);
                return acc + product.price * item.quantity;
            },0)
        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                items,
                amount:amount+Math.floor(amount*0.02), //taxes
                address,
                date: Date.now()
            }
        });
        // clear user cart
        const user=await User.findById(userId);
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true, message: 'Order created successfully' }, { status: 200 });
        
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
        
    }
}
import connectDB from '@/config/db';
import Address from '@/models/Address';
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const {userId}=getAuth(request)
        const { address }=await request.json();
        await connectDB()
        const newAddress = await Address.create({
            ...address,
            userId,
        });
        return NextResponse.json({ success: true, address: newAddress, message:"Address added sucessfully." }, { status: 200 });
        
    } catch (error) {
        console.error("Error adding address:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
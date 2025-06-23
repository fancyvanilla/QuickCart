import connectDB from '@/config/db';
import { getAuth } from '@clerk/nextjs/server'
import Address from '@/models/Address';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const {userId}=getAuth(request)
        await connectDB()
        const addresses = await Address.find({ userId })
        return NextResponse.json({ success: true, addresses }, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
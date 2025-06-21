import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
export async function GET(request) {
    try{
        const { userId }=getAuth(request);

        await connectDB();
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({success: false, message: "User not found"}, { status: 404 });
        }
        return NextResponse.json({success: true, user}, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({success: false, message: "Internal Server Error"}, { status: 500 });
    }
}
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller"
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function GET(request) {
    try {
        const { userId }=getAuth(request)

        const isSeller=authSeller(userId)

        if(!isSeller){
            return NextResponse.json({sucess:false, message:"Not Authorized"}, {status:403})
        }
        await connectDB()
        const products=await Product.find({userId})
        return NextResponse.json({success:true, products}, {status:200})

    } catch (error) {
        toast.error("Something went wrong")
        return NextResponse.json({success:false, message:"Internal Server Error"}, {status:500})
    }
}
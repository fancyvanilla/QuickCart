import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function GET(request) {
    try {
        await connectDB()
        const products=await Product.find()
        return NextResponse.json({success:true, products}, {status:200})

    } catch (error) {
        toast.error("Something went wrong")
        return NextResponse.json({success:false, message:"Internal Server Error"}, {status:500})
    }
}
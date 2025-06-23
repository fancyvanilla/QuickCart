import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId:{
        type: String,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    offerPrice: {
        type: Number,
        required: true,
        min: 0
    },
    image:{
        type:Array,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date:{
        type:Number,
        required: true,
    }
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
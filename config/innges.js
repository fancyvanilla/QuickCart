import User from "@/models/User";
import { Inngest } from "inngest";
import connectDB from "./db";
import Order from "@/models/Order";

// create a client to send and receive events
export const inngest=new Inngest({id:"quickcart-inngest"})

// inngest function to sync user creation event from Clerk to MongoDB
export const syncUserCreationEvent = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },{
        event: "clerk/user.created"
    }, async ({ event}) => {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const userData={
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name+ " " + last_name,
            imageUrl: image_url
        }
        await connectDB();
        await User.create(userData);
    }
)

export const syncUserUpdateEvent = inngest.createFunction(
    {
        id: "update-user-from-clerk",
    },{
        event: "clerk/user.updated"
    }, async ({ event}) => {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const userData={
            email: email_addresses[0].email_address,
            name: first_name+ " " + last_name,
            imageUrl: image_url
        }
        await connectDB();
        await User.findByIdAndUpdate(id, userData);
    }
)
export const syncUserDeletionEvent = inngest.createFunction(
    {
        id: "delete-user-from-clerk",
    },{
        event: "clerk/user.deleted"
    }, async ({ event}) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)

//Insert function to create user order in order
export const createUserOrderEvent = inngest.createFunction(
    {
        id: "sync-user-order",
        batchEvents:{
            maxSize: 25, 
            timeout:'5s'
        }
    },{
        event: "order/created"
    }, async ({ events}) => {
        const orders= events.map(event => {
            return {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date:event.data.date
            };
        });
        await connectDB();
        await Order.insertMany(orders);
        return { success: true, processed: orders.length };
    }
)
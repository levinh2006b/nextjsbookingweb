'use server'

import connectDB from "../../lib/mongodb"
import { Booking } from "@/database";
import { Types } from "mongoose";

export const createBookings = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string }) => {
    try {
        await connectDB()

    // Khong dung newBooking nua => Khong can store trong variable   const newBooking = await Booking.create({ eventId: new Types.ObjectId(eventId), slug, email });
        await Booking.create({ eventId, slug, email });
       
        return { success: true}

    } catch (e) {
        console.error('Create booking failed', e)
        return { success: false} // Lưu ý: e cũng cần đảm bảo là object thuần
    }
}
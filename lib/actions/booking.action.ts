'use server'

import connectDB from "../../lib/mongodb"     //Kết nối tới MongoDB 
import { Booking } from "@/database";         //Lấy model của Booking

export const createBookings = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string }) => {
    try {
        await connectDB()     //Đợi kết nối MongoDB thành công

    // Khong dung newBooking nua => Khong can store trong variable   const newBooking = await Booking.create({ eventId: new Types.ObjectId(eventId), slug, email });
        await Booking.create({ eventId, slug, email });      //Bảo mongodb tạo 1 document mới với thông  tin eventId, slug, email này
                                                             //Why eventId là string mà vẫn lưu được? -? MongoDB có chức năng Auto Casting -> Tự đổi thành ObjectId 
       
        return { success: true}

    } catch (e) {
        console.error('Create booking failed', e)
        return { success: false} 
    }
}
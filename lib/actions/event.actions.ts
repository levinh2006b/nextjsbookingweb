'use server';    //code dưới only chạy trên server => Bảo mật

import Event from '@/database/event.model'     //Nhập bản model Event
import connectDB from '@/lib/mongodb'          //Nhập chìa khóa để access mongodb

// Hàm 1: Lấy tất cả sự kiện (Dùng cho trang chủ)
export const getAllEvents = async () => {
    try {
        await connectDB();
        // Lấy list, sắp xếp mới nhất lên đầu
        const events = await Event.find().sort({ createdAt: -1 });
        
        // Chuyển sang JSON thuần để không bị lỗi seralization của Next.js
        return JSON.parse(JSON.stringify(events));       // NextJS dùng cơ chế Serialization để truyền data từ Server sang Client và giữa các Server Components -> Chỉ truyền được dữ liệu tĩnh (Text, Number, Boolean, Array, Object thuần), k được truyền hàm
                                                         // Mongoose Document chứa nhiều hàm save => Khi truyền sẽ bị lỗi
        // phải chuyển sang JSON là vì Mongoose sẽ trả về 1 Mongoose Document chứa rất nhiều thông tin thừa và nặng nên phải đổi về json để access được những cái cần thôi
    } catch (error) {
        console.log(error);
        return [];    //Trả về array rỗng nếu k get đc gì
    }
}

// Hàm 2: Lấy 1 sự kiện theo slug (Dùng cho trang chi tiết)
export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });
        
        if (!event) return null;
        
        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Hàm 3: Lấy sự kiện tương tự (Code cũ của bạn, giữ nguyên logic)
export const getSimlilarEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });   //Phải lấy cái event hiện tại ra để khi lấy các event tương tự thì né id của nó
        if (!event) return [];
        
        const similarEvents = await Event.find({ 
            _id: { $ne: event._id }, 
            tags: { $in: event.tags }      //Tìm các event có trùng tag với event hiện tại
        }).limit(3).lean(); // Thêm limit(3) để không lấy quá nhiều

        return JSON.parse(JSON.stringify(similarEvents));
    } catch {
        return []
    }
}
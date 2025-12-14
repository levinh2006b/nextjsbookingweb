'use server';

import Event from '@/database/event.model'
import connectDB from '@/lib/mongodb'

// Hàm 1: Lấy tất cả sự kiện (Dùng cho trang chủ)
export const getAllEvents = async () => {
    try {
        await connectDB();
        // Lấy list, sắp xếp mới nhất lên đầu
        const events = await Event.find().sort({ createdAt: -1 });
        
        // Chuyển sang JSON thuần để không bị lỗi seralization của Next.js
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.log(error);
        return [];
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
        const event = await Event.findOne({ slug });
        if (!event) return [];
        
        const similarEvents = await Event.find({ 
            _id: { $ne: event._id }, 
            tags: { $in: event.tags } 
        }).limit(3).lean(); // Thêm limit(3) để không lấy quá nhiều

        return JSON.parse(JSON.stringify(similarEvents));
    } catch {
        return []
    }
}
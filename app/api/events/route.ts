import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();


        //Lấy request dạng formData
        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());  //Chuyển đổi toàn bộ data từ formData thành JSON Object
                                                             //formData.entries() -> Trả về danh sách liệt kê các thứ trong formData
                                                             //Object.fromEntries()  -> Hàm đổi từ danh sách liệt kê entries trên thành Object JSON
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format'}, { status: 400 })
        }


        //Biến slug phụ thuộc title để có các title unique
        if (event.title) {
            event.slug = (event.title as string)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[đĐ]/g, "d")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/[\s_-]+/g, "-")
                .replace(/^-+|-+$/g, "");
        }

        //Lấy image trong formData là dạng file -> TypeScript chặt ép kiểu là file để TS hiểu đây k phải string, để dùng được các hàm dùng cho file
        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({ message: 'Image file is required'}, { status: 400 })


        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        // as string -> Make sure TypeScript know the value .get() get is not null 
        //JSON.parse -> Convert string to array/object
        //get('tags') -> Get the tag value of the object out to modify


        //arrayBuffer() lấy file dạng arrayBuffer -> 1 loạt 001110101 mà trình duyệt hiểu 
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        //Đang viết code ở nodejs (buffer) => Phải đổi về dạng nodejs hiểu: Buffer
        //Buffer là dạng data kiểu <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 ... >
  


        //Cloudinary dùng callback cũ-> không hỗ trợ await trực tiếp => Phải bọc hàm trong 1 Promise
        const uploadResult = await new Promise((resolve, reject) => {    //Promise này bao gồm kết quả (resolve) hoặc lỗi (reject)
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {     //Gửi xong cloudinary sẽ trả error hoặc result
                if(error) return reject(error);
                resolve(results);
            }).end(buffer);    //Cho buffer (Chứa data ảnh dạng buffer) vào cái stream để upload lên cloudinary
        });



        event.image = (uploadResult as { secure_url: string }).secure_url;
        //  .secure_url: đường link tới Cloudinary của ảnh
        //   TS khó tính => Ép kiểu uploadResult là chứa 1 secure_url dạng string để TS không kêu
        //   event.image -> Gán link đó vào image, thay file gốc bằng url của cloudinary rồi mới lưu vào database à

        const createdEvent = await Event.create({
            ...event,
            tags: tags,   //store tags va agenda in the right format
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e: any) {
        console.error(e);
        if (e.code === 11000) {
            return NextResponse.json({ message: 'Event Creation Failed', error: 'Duplicate key error: A record with this unique field already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 })
    }
}


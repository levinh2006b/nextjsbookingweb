import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
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

        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({ message: 'Image file is required'}, { status: 400 })


        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        // as string -> Make sure TypeScript know the value .get() get is not null 
        //JSON.parse -> Convert string to array/object
        //get('tags') -> Get the tag value of the object out to modify

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if(error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

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


export async function GET(){
  try{
     await connectDB();
     const events = await Event.find().sort({createdAt: -1});  //-1 tức là sự kiện tạo mới nhất sẽ nằm đầu danh sách

     return NextResponse.json({ message: 'Event fetch successfully', events}, {status: 200});

  }catch(e){
    return NextResponse.json({ message: 'Event fetch failed'}, {status: 500});
  }
}
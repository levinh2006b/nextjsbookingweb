import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// Sửa Interface: params bây giờ là một Promise
interface RouteParams {
  params: Promise<{ slug: string }>;  //NextJS 15 16 không có Params dùng luôn => Cần khai báo nó là 1 Promise
}

export async function GET(
  req: NextRequest, 
  { params }: RouteParams  // Destructuring params từ context
) {
  try {
    await connectDB();

    // --- KHÁC BIỆT LỚN Ở ĐÂY (Next.js 15/16) ---
    // Phải await params trước khi dùng
    const { slug } = await params; 
    // -------------------------------------------

    if (!slug) {    //Không có slug (null or unefined) thì stop luôn tránh mất tgian database
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    const event = await Event.findOne({ slug: slug });

    if (!event) {    //k tìm thấy event
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", event }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}
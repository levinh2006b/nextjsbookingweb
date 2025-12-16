//File standard cần có khi làm việc với MongoDB

import mongoose from 'mongoose';

// Lấy URI từ biến môi trường
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Next.js (đặc biệt trong môi trường dev) có cơ chế "Hot Reload" (sửa code là web tự cập nhật)
 * không có đoạn này thì  mỗi lần reload, một kết nối mới tới MongoDB sẽ được mở. Sau vài chục lần, MongoDB sẽ chặn IP của bạn vì quá nhiều kết nối rác
*/
interface MongooseCache {    //Bản vẽ cho kho chứa kết nối gồm 2 thứ dưới
  conn: typeof mongoose | null;      //Kết nối đã thành công (hoặc null)
  promise: Promise<typeof mongoose> | null;    //Quá trình đang kết nối (hoặc null)
}


//TypeScript không biết biến mongoose là biến global => Phải khai báo nó là global 
declare global {
  var mongoose: MongooseCache | undefined;      //  | undefined -> Đề phòng chưa tạo thì tạo mới, tạo r thì dùng cái cũ
}    //Ở đây, mongoose mới là biến global còn MongooseCache chỉ là máy tạo khuôn thôi


/**
  Tạo ra 1 cache mongoose để lưu kêt nối với MongoDB để mỗi khi khởi động, NextJS không chạy lại nguyên code backend
*/
let cached = global.mongoose;   //thử xem mongoose đã là biến global chưa (1)


//if cached chưa tồn tại => Tạo 1 object null
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };    //(2) nếu chưa thì tạo 1 object rỗng gán vào global.mongoose 
} 

/**
 * Hàm kết nối Database
 * Mục đích: Tái sử dụng kết nối đã mở thay vì tạo mới liên tục
 */
async function dbConnect(): Promise<typeof mongoose> {     //Kết nối DB tốn time => Trả về 1 promise  thư viện mongoose đã được kết nối
  // 1. Nếu đã có kết nối, trả về ngay lập tức
  if (cached!.conn) {     //   ! ở cuối tức là đảm bảo với TS chắc chắn không null
    return cached!.conn;
  }    //nếu có connection rồi thì dùng luôn

  //Nếu chưa ai kết nối và không ai đang đi kết nối
  if (!cached!.promise) {
    const opts = {
      bufferCommands: false, // Mặc định thì mongodb có cơ chế buffer (hàng chờ) -> Hàng này tăt cơ chế đó
    };

    // Tạo kết nối và lưu promise lại
    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {     //mongoose.connect(...) -> Bắt đầu kết nối MongoDB
                                                                                            //cached!.promise = ...   -> lưu cái "tiến trình kết nối" (Promise) này vào biến toàn cục ngay lập tức.
      return mongooseInstance;
    });
  }

  // 3. Chờ promise hoàn tất và gán vào biến conn
  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null; // Reset promise nếu lỗi để lần sau thử lại
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;    //File khác là connectDB() do export default thì các file khác đặt bất cứ thứ gì họ muốn đều được
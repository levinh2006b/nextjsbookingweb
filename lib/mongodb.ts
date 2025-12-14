import mongoose from 'mongoose';

// Lấy URI từ biến môi trường
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
Tạo 1 object khai báo nó chứa 2 kiểu dữ liệu conn và promise*/
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}


//TypeScript không biết biến mongoose là biến global => Phải khai báo nó là global 
declare global {
  var mongoose: MongooseCache | undefined;
}

/**
  Tạo ra 1 cache mongoose để lưu kêt nối với MongoDB để mỗi khi khởi động, NextJS không chạy lại nguyên code backend
*/
let cached = global.mongoose;


//if cached chưa tồn tại => Tạo 1 object null
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Hàm kết nối Database
 * Mục đích: Tái sử dụng kết nối đã mở thay vì tạo mới liên tục
 */
async function dbConnect(): Promise<typeof mongoose> {
  // 1. Nếu đã có kết nối, trả về ngay lập tức
  if (cached!.conn) {
    return cached!.conn;
  }

  // 2. Nếu chưa có promise kết nối đang chạy, tạo mới
  if (!cached!.promise) {
    const opts = {
      bufferCommands: false, // Tắt buffer để lỗi văng ra ngay nếu driver chưa kết nối
    };

    // Tạo kết nối và lưu promise lại
    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
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

export default dbConnect;
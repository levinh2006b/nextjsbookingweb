import mongoose, { Schema, model, models, Document, Model } from 'mongoose';

// 1. Sửa Interface: Thêm slug vào đây
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  slug: string; // <--- THÊM DÒNG NÀY
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true,
      index: true 
    },  
    // 2. Sửa Schema: Thêm cấu hình cho slug vào đây
    slug: {
      type: String,
      required: true, // Nếu bắt buộc phải có
    },
    email: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
  },
  { timestamps: true }
);

// Pre-save hook: Referential Integrity Check
// FIX: Thêm kiểu dữ liệu cho next: (err?: Error) => void
// Pre-save hook: Referential Integrity Check
// SỬA: Bỏ tham số 'next'. Hàm async sẽ tự trả về Promise.
BookingSchema.pre('save', async function () {
  const eventModel = mongoose.models.Event;
  
  // Thay next(new Error(...)) bằng throw new Error(...)
  if (!eventModel) {
    throw new Error('Event model not initialized.');
  }

  // Ép kiểu this để TypeScript hiểu (giữ nguyên cách bạn làm)
  const booking = this as unknown as IBooking;
  
  // Logic kiểm tra Event tồn tại
  const eventExists = await eventModel.exists({ _id: booking.eventId });

  if (!eventExists) {
    throw new Error(`Event with ID ${booking.eventId} does not exist.`);
  }

  // Không cần gọi next() ở cuối nữa, hàm chạy xong tự động hiểu là thành công.
});

// Prevent model overwrite in Next.js development environment
const Booking: Model<IBooking> = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
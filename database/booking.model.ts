import mongoose, { Schema, model, models, Document, Model } from 'mongoose';

// Interface definition
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true,
      index: true // Index for faster queries by Event
    },
    email: {
      type: String,
      required: true,
      // Basic Regex for email validation
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
  },
  { timestamps: true }
);

// Pre-save hook: Referential Integrity Check
// FIX: Thêm kiểu dữ liệu cho next: (err?: Error) => void
BookingSchema.pre('save', async function (next: (err?: Error) => void) {
  // We use mongoose.models.Event to verify existence without needing a direct file import
  // which avoids potential circular dependency issues in some architectures.
  const eventModel = mongoose.models.Event;
  
  if (!eventModel) {
    return next(new Error('Event model not initialized.'));
  }

  try {
    // Ép kiểu this để TypeScript hiểu đây là IBooking
    const booking = this as unknown as IBooking;
    
    const eventExists = await eventModel.exists({ _id: booking.eventId });

    if (!eventExists) {
      return next(new Error(`Event with ID ${booking.eventId} does not exist.`));
    }

    next();
  } catch (error) {
    // Nếu có lỗi bất ngờ xảy ra trong quá trình await
    next(error as Error);
  }
});

// Prevent model overwrite in Next.js development environment
const Booking: Model<IBooking> = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
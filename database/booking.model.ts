//File cấu hình Model để lưu vào database MongoDB



import mongoose, { Schema, model, models, Document, Model } from 'mongoose';

export interface IBooking extends Document {   //Bất kì cái là IBooking nào đều cần có 5 tham số và ngầm có thêm _id nữa
                                               //interface -> Khuôn mẫu cho IBooking 
                                               //extends Document -> Kế thừa từ Document của Mongoose ->  Có các tính năng  của nó như auto có thêm uid là _id và các hàm như .save() và .remove()
  eventId: mongoose.Types.ObjectId;   //Không để eventId là string mà là ObjectId mặc dù nhìn giống nhau
                                      //String thì chỉ là 1 string k làm đc gì còn ObjectId thì có các hàm mà có thể sử dụng như .getTimestamp() -> Có cả thời gian tạo ra
  email: string;
  slug: string; 
  createdAt: Date;
  updatedAt: Date;
}
//Interface chỉ tồn tại lúc viết code, để khi truyền thiếu tham số vào 1 sự kiện booking thì code báo lỗi

//Schema như ông bảo vệ, vận hành khi server chạy, các tham số truyền vào phải đủ điều kiện như email thì có @gmail.com
const BookingSchema = new Schema<IBooking>(     //Schema là máy tạo khuôn đúc, BookingSchema là thành phẩm, khuôn , được tạo ra từ Schema -> BẮT BUỘC PHẢI CÓ NEW dùng Schema tạo khuôn có đủ format của IBooking 
  {                                             //new Schema: Khởi động máy làm khuôn.
                                                //<IBooking>: Đưa bản vẽ kỹ thuật (Interface) vào để máy biết mà làm cho khớp.
    eventId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event',                      //Báo MongoDB id này là con của mục event    -> Nhờ dòng này mà sau dùng lệnh .populate() mới lôi thông tin sk về đc
      required: true,                    //Phải có
      index: true      
    },                  //Có index để tìm những người đăng ký 1 event cụ thể nào đó nhanh hơn
    // 2. Sửa Schema: Thêm cấu hình cho slug vào đây
    slug: {
      type: String,
      required: true, // Bắt buộc phải có
    },
    email: {     //Cấu hình email 
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
  },
  { timestamps: true }     //Tính năng tốt của Mongoose -> Bật là tự động có thêm 2 cột createdAt và updatedAt, không cần truyền vào
);


BookingSchema.pre('save', async function () {       //pre('save') => Trước khi lưu thì chạy hàm này -> Final check: K cho booking 1 sự kiện k tồn tại và lỗi thường gặp của MongoDB khi làm với NextJS 
  const eventModel = mongoose.models.Event;         //Lấy model của event ngay file dưới, không dùng import Event from ... tránh lỗi Circular Dependency
                                                    //mongoose.models -> Kho chứa mọi model được tạo
  
  if (!eventModel) {
    throw new Error('Event model not initialized.');
  }

  // Ép kiểu this để TypeScript hiểu (giữ nguyên cách bạn làm)
  const booking = this as unknown as IBooking;      //this là cái vé booking trong hàm pre('save') này
                                                    //Bịt miệng type script, "Tao thề với mày, cái this này chính là kiểu dữ liệu IBooking mà tao đã định nghĩa ở trên. Cứ tin tao!""

  
  // Logic kiểm tra Event tồn tại thì mới cho book và lưu
  const eventExists = await eventModel.exists({ _id: booking.eventId });    //booking.eventId lấy id của event đó
                                                                            //eventModel.exists() vào bảng Model, tìm id (tức là event) có tồn tại hay không, only trả về true/false => .exist rất nhanh so với .find()

  if (!eventExists) {
    throw new Error(`Event with ID ${booking.eventId} does not exist.`);
  }

  // Không cần gọi next() ở cuối nữa, hàm chạy xong tự động hiểu là thành công.
});

  // Prevent model overwrite in Next.js development environment
  //Nếu viết kiểu cũ: const Booking = model('Booking', ...) thì mỗi lần resave server thì mongodb lại tạo lại model vốn đã lưu => Gây lỗi overwrite
  // Dùng || -> nếu models.Booking đã tồn tại => Lấy cũ dùng  luôn, còn chưa thì tạo mới r lưu lại vào mongodb
const Booking: Model<IBooking> = models.Booking || model<IBooking>('Booking', BookingSchema);
//Code này chưa giải quyết được việc update model, phải khởi động lại server để xóa cái model cũ khi update model đó nhưng việc này đỡ đau đầu hơn lỗi overwrite => Better trade off

export default Booking;
import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image:string;   //Pass in URL
    slug: string;
    location: string;
    date: string;
    time: string;
}


const EventCard = ({title, image, slug, location, date, time}:Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">      {/* Component của NextJS -> Giúp chuyển trang nhanh mà không cần phải load lại cả web 
                                                             href là link tới url của event đó                                                                                   */}
          <Image src = {image} alt ={title} width = {410} height = {300} className ="poster" />     {/** src Lấy image from link từ cloudinary -> Phải truyền vào 1 string 
           *  Image -> Component của NextJS
           * img tải nguyên gốc, k nén như Image  -> Auto đổi sang các định dạng từ JPG sang AVIF or WebP cho nhẹ ảnh
           *  Image có Lazy loading 
           * Image bắt phải nhập width height để xí chỗ
          */}
                                    
          {/**Hiển thị icon và location */}
          <div className="flex flex-row gap-2">
               <Image src="/icons/pin.svg" alt = "location" width = {14} height = {14} />   {/*Public mac dinh la folder root => In link khong dien public vao */}
               <p>{location}</p>
          </div>


          {/**Hiển thị tên event */}
          <p className="title">{title}</p>

           {/**Hiển thị icon và date and time */}
          <div className="datetime">
              <div>
                <Image src = "/icons/calendar.svg" alt='date' width={14} height={14}></Image>
                <p>{date}</p>
              </div>

              <div>
                <Image src = "/icons/clock.svg" alt='time' width={14} height={14}></Image>
                <p>{time}</p>
              </div>

          </div>
    </Link>  //Tất cả, bấm vào đâu trong event card đều link tới trang event đó
  )
}

export default EventCard

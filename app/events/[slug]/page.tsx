import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
// Import hàm mới vừa tạo
import { getSimlilarEventBySlug, getEventBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database/event.model";
import EventCard from "@/components/EventCard";


/* ... (Giữ nguyên các component con EventDetailItem, EventAgenda, EventTags của bạn ở đây) ... */
const EventDetailItem = ({icon,alt,label}: {icon:string; alt:string;  label:string}) =>(  //Khi gọi component này sẽ có dạng <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                                            //Bắt phải truyền vào 1 string chỉ địa chỉ icon đó
  <div className="flex flex-row gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)      //Đây là cái khuôn cho các thứ thuộc phần Event Details

const EventAgenda = ({agendaItems} : {agendaItems: string[]}) => (   //Bắt truyền vào 1 biến tên là agendaItems dạng string
  <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems && agendaItems.map((item) => (   // && for safety, phải có agendaItems thì mới chạy code phía sau k web sập
          <li key={item}>{item}</li>                  // map là  duyệt mọi phần tử nên cần có key để duyệt
        ))}
      </ul>
  </div>
)

const EventTags = ({tags}:{tags:string[]}) => (     //pill để bao quanh text như 1 viên thuốc
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div className="pill" key={tag}>    
          {tag}
        </div> 
      ))}
    </div>
)
/* ... (Hết phần component con) ... */


const EventDetailsPage = async ({params}: {params: Promise<{slug: string}>}) => {    //param là 1 Promise chứa slug dạng string. NextJS 16 bắt phải chờ => Phải bọc nó trong Promise
                                                                                     // url la: https://trang-web-cua-ban.com/events/le-hoi-am-nhac  -> [slug] la le-hoi-am-nhac 
                                                                                     /*
                                                                                     {
                                                                                        slug: "le-hoi-am-nhac"
                                                                                      }
                                                                                     */ 
  
  // 1. Đợi có param thì lấy slug ra
  const { slug } = await params;

  // 2. THAY ĐỔI LỚN: Gọi Database trực tiếp, KHÔNG dùng fetch
  const event = await getEventBySlug(slug);

  // 3. Kiểm tra nếu không có event
  if (!event) return notFound();

  // Destructuring dữ liệu từ event
  const { description, overview, date, time, location, agenda, image, mode, audience, tags, organizer } = event;

  if(!description) return notFound();

  const bookings = 10;
  const similarEvents: IEvent[] = await getSimlilarEventBySlug(slug);   //Khai báo similarEvents là 1 array các Events tuân thủ theo khuôn mẫu IEvent

  return (
   <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>

    <div className="details">
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner" priority /> 

          <section>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>  

            <section className="flex-col-gap-2">
                <h2>Event Details</h2>
                <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />      {/* Dùng khuôn mẫu EventDetailItem truyền vào các tham số icon và label (text của cái icon) */ }
                <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                <EventDetailItem icon="/icons/pin.svg" alt= "pin" label={location} />
                <EventDetailItem icon="/icons/mode.svg" alt="mode" label="In-Person" />
                <EventDetailItem icon="/icons/audience.svg" alt="audience" label="Open to all" />
            </section>

            <EventAgenda agendaItems={agenda}/>    {/*  Cái này là .map() qua cái array thôi nên không cần truyền  */}

            <section className="flex-col-gap-2">
                <h2>About the Organizer</h2>
                <p>{organizer}</p>    {/* Just a string */}
            </section>
  
            <EventTags tags={tags} />
        </div>

        <aside className="booking">
           <div className="signup-card">
              <h2>Book Your Spot</h2>
                 {bookings > 0 ? (
                    <p className="text-sm">
                      Join {bookings} people who have booked their spot!
                    </p>
                 ):(
                  <p className="text-sm">Be the first to book your spot!</p>
                 )}
                 {/* Truyền _id và slug vào form */}
                 <BookEvent eventId={event._id}  slug={event.slug} />     {/* Đây k phải thẻ html chuẩn mà react component do bạn tự viết ra */}
           </div>
        </aside>
    </div>
    
    <div className="flex w-full flex-col gap-4 pt-20 ">
      <h2>Similar Events</h2>
      <div className="events">
         {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (    //Check cho chắc, phải có similar events mới chạy đoạn sau
                                                                                       //Liệt kê các similarEvents
             // Sửa key: chuyển _id thành string để tránh lỗi object
             <EventCard key={String(similarEvent._id)} {...similarEvent} />
         ))}                                                                     
      </div>
    </div>
</section>
  )
}

export default EventDetailsPage
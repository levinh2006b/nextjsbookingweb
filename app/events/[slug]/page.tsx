const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { getSimlilarEventBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database/event.model";
import EventCard from "@/components/EventCard";
import { cacheLife } from "next/cache";


export const dynamic = 'force-dynamic';
  
/* Tailwind properties used in this file
   mt-2: Margin top 2 => Cach le tren 2
   text-lg => Text large => Size
   trong Image witdth={800} height={800} -> Size anh
   flex-col-gap-2 -> Create space of 2px between the two collumns
   flex-row-gap-2 items-center -> Xep hop ngang hang nhau, cach nhau 2px, items-center -> Xep icon ngang hang text
   flex-row flex-wrap -> Tu dong xuong dong neu het cho
  className="pill" -> CSS tạo hình dáng (thường là bo tròn góc, có màu nền nhẹ) để nhìn nó giống viên thuốc.

*/

const EventDetailItem = ({icon,alt,label}: {icon:string; alt:string;  label:string}) =>(
  <div className="flex flex-row gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)


const EventAgenda = ({agendaItems} : {agendaItems: string[]}) => (
  <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems && agendaItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
  </div>
)


//In react, if you use {} after =>     , bat buoc phai co return, neu khong se return undefined 
const EventTags = ({tags}:{tags:string[]}) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div className="pill" key={tag}>
          {tag}
        </div> 
      ))}
    </div>
)

const EventDetailsPage = async ({params}: {params: Promise<{slug: string}>}) => {
  'use cache'      //Fix bug loi ma Suspense -> Thay vi tim cac component can load va wrap trong Suspense thi use truc tiep trong cache
  cacheLife('hours')

  const {slug} = await params
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);  //fetch: Lay data o dia chi trong ()
  
  // 1. KHAI BÁO: Phải có dòng này để tạo biến "event"
  const { event } = await request.json(); 

  if(!event) return notFound()    //Neu khong tim thay => Auto direct den trang 404
 
  // 1. DESTRUCTURING: Bóc tách dữ liệu để không phải gõ "event." nhiều lần
  // Giả sử event có các trường: description, overview, date, time, location, agenda...
  // 2. DESTRUCTURING: Chỉ được thực hiện SAU KHI đã có biến "event" ở trên
  const { description, overview, date, time, location, agenda, image, mode, audience, tags, organizer } = event;

  if(!description) return notFound()    //Neu khong tim thay => Auto direct den trang 404

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimlilarEventBySlug(slug)

  return (
   <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>



    <div className="details">
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner"  />

          <section>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>  

            <section className="flex-col-gap-2">
                <h2>Event Details</h2>
 
                <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                <EventDetailItem icon="/icons/pin.svg" alt= "pin" label={location} />
                <EventDetailItem icon="/icons/mode.svg" alt="mode" label="In-Person" />
                <EventDetailItem icon="/icons/audience.svg" alt="audience" label="Open to all" />


            </section>

            {/* 2. FIX: Bỏ JSON.parse nếu agenda đã là mảng. Nếu DB lưu string thì giữ nguyên JSON.parse(agenda) */}
            <EventAgenda agendaItems={agenda}/>

            <section className="flex-col-gap-2">
                <h2>About the Organizer</h2>
                <p>{organizer}</p>
            </section>
  
            <EventTags tags={tags} />
        </div>

        {/* Right Side - Booking Form */}
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
                 <BookEvent eventId={event._id}  slug={event.slug} />
           </div>
        </aside>
    </div>
    <div className="flex w-full flex-col gap-4 pt-20 ">
      <h2>Similar Events</h2>
      <div className="events">
         {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => ( // ...similarEvent -> Lay tat ca thong tin (title, agenda,...) cho vao similar event tam thoi, khong can liet ke tat ca properties
             <EventCard key={String(similarEvent._id)} {  ...similarEvent} />    //Error at key: key takes string != id (Dang object) 
         ))}                                                                     
      </div>
    </div>
</section>
  )
}

export default EventDetailsPage

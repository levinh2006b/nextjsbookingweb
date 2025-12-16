import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
// Import hàm mới
import { getAllEvents } from "@/lib/actions/event.actions";


const page = async () => {
  const events = await getAllEvents();
  //Hiển thị mọi event available ra trang web

  return (
   <section>
    <h1 className="text-center">Party Meet Up <br /> Social App </h1>
    <p className="text-center mt-5">Meet Ups, Networking, Booze, All in this website</p>

    <ExploreBtn/>

    <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">       {/* Khai báo list để liệt kê các event */}
          {events && events.length > 0 && events.map((event: IEvent) => (         //Mapping liệt kệ every event trong component events  khai báo được ở đầu
            // Sửa key: dùng _id thay vì title để chuẩn hơn (nếu có trùng tên)
            <li key={String(event._id)} className="list-none">      {/*list-none để phần tử liệt kê không có gạch đầu dòng nhìn xấu */}
              <EventCard {...event} />      {/* Cách viết tắt: Truyền toàn bộ thông tin của Event vào EventCard */}
            </li>
          ))}
        </ul>
    </div>
   </section>
  )
}

export default page
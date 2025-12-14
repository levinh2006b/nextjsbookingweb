import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
// Import hàm mới
import { getAllEvents } from "@/lib/actions/event.actions";


const page = async () => {
  // Thay thế đoạn fetch cũ bằng hàm này:
  const events = await getAllEvents();

  return (
   <section>
    <h1 className="text-center">Party Meet Up <br /> Social App </h1>
    <p className="text-center mt-5">Meet Ups, Networking, Booze, All in this website</p>

    <ExploreBtn></ExploreBtn>

    <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            // Sửa key: dùng _id thay vì title để chuẩn hơn (nếu có trùng tên)
            <li key={String(event._id)} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
    </div>
   </section>
  )
}

export default page
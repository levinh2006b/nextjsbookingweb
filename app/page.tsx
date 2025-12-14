import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
import { Events } from "@/lib/constants";
import { cacheLife } from "next/cache";


//Access global variable
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const page = async () => {
  'use cache'
  cacheLife('hours')
  const response = await fetch(`${BASE_URL}/api/events`)
  const {events} = await response.json();

  return (
   <section>
    <h1 className="text-center">Party Meet Up <br /> Social App </h1>
    <p className="text-center mt-5">Meet Ups, Networking, Booze, All in this website</p>

    <ExploreBtn></ExploreBtn>

    <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events && events.length >0 && events.map((event: IEvent) => (
            <li key = {event.title}  className="list-none">
              <EventCard {...event} />   {/* ...event lấy tất cả các thuộc tính của đối tượng event (là title và image) và truyền chúng vào Component <EventCard> dưới dạng Props. */}
            </li>

))}
        </ul>
    </div>

   </section>
  )
}

export default page

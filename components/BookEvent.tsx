'use client'

import React from 'react'
import { useState } from 'react';
import { createBookings } from '@/lib/actions/booking.action';
import { track } from '@vercel/analytics/react';


const BookEvent = ({eventId, slug}:{eventId:string, slug:string}  ) => {    //Tạo hàm BookEvent truyền vào eventId và slug


  const [email, setEmail] = useState('');                   //State chứa email ban đầu là rỗng
  const [submitted ,setSubmitted] = useState(false);        //Ban đầu state  check nộp chưa là chưa nộp

  const handleSubmit = async (e: React.FormEvent) => {      //Submit thì e nhận và một sự kiện EventObject
                                                            //e chứa tất cả data như Nút nào vừa được bấm? Form nào vừa được gửi? Thời gian bấm là khi nào?
                                                            //đảm bảo e đúng là sự kiện của Form chứ k phải của Click hay Cuộn trang,...
    e.preventDefault();
 
    const { success } = await createBookings({ eventId, slug, email });          //Kiểm tra xem gửi có thành công không qua biến success từ file Action
                                                                                 //Thực hiện hành động tạo Booking, truyền vào 3 tham số
   
    if (success) {
        setSubmitted(true);
        
        // --- THAY ĐỔI Ở ĐÂY (Thành công) ---
        // Cũ: posthog.capture('event_booked', { eventId, slug, email })
        // Mới: Gửi sự kiện 'event_booked' lên Vercel
        track('event_booked', { 
            eventId: eventId, 
            slug: slug, 
            email: email 
        });

    } else {
        // --- THAY ĐỔI Ở ĐÂY (Thất bại) ---
        console.error('Booking creation failed');

        // Cũ: posthog.captureException('Booking creation failed')
        // Mới: Vercel không có captureException, ta tự tạo sự kiện lỗi để theo dõi
        track('booking_failed', { 
            reason: 'Booking creation failed' 
        });
    }
}

  return (
    <div>
      {submitted ? (
        <p className='text-sm'>Thank you for signing up</p>
      ): (
        //Ket noi ham handleSubmit voi form nay thi ham day moi dung duoc    <- Trên kia mới khởi tạo ra thôi
        //Submit cái là hàm handleSubmit hoạt động luôn
      <form onSubmit={handleSubmit}>       
        <div id="book-event">
          <label htmlFor="email">Email Address</label>        {/*kết nối với ô input có id="email". Khi người dùng bấm vào chữ "Email Address", con trỏ chuột sẽ tự nhảy vào ô nhập. */}
            <input 
              type="email" 
              value={email}       //Cái này là output lên thanh điền 
              //User input chu A -> onChange report user just input A -> setEmail change email to A -> value={email} sees A => Show A on the input bar
              onChange={(e) => setEmail(e.target.value)}      //Làm vậy để tiện hiển thi những gì user input lên thanh đó theo ý muốn của ta (xóa khoảng trắng, ký tự lạ,...) -> Gõ phím cái kiểm soát được luôn
              id ="email"      //Dòng để con chuột biết chỗ nhảy vào
              placeholder='Enter your Email Adresss'
              />
        </div>

        <button type="submit" className='button-submit'>Submit</button>

      </form> 
      )  
    } 
    </div>
  )
}


export default BookEvent

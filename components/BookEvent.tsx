'use client'

import React from 'react'
import { useState } from 'react';
import { createBookings } from '@/lib/actions/booking.action';
import { track } from '@vercel/analytics/react';


const BookEvent = ({eventId, slug}:{eventId:string, slug:string}  ) => {


  const [email, setEmail] = useState('');
  const[submitted ,setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success } = await createBookings({ eventId, slug, email });

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
        //Ket noi ham handleSubmit voi form nayy thi ham day moi dung duoc
      <form onSubmit={handleSubmit}>      
        <div id="book-event">
          <label htmlFor="email">Email Address</label>
          <input 
             type="email" 
             value={email}     //User input chu A -> onChange report user just input A -> setEmail change email to A -> value={email} sees A => Show A on the input bar
             onChange={(e) => setEmail(e.target.value)}
             id ="email"
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

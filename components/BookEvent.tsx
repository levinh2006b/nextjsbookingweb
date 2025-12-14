'use client'

import React from 'react'
import { useState } from 'react';

const BookEvent = () => {
  const [email, setEmail] = useState('');
  const[submitted ,setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {   //FormEvent la 1 event sinh ra boi Form
    e.preventDefault()

    setTimeout(() =>{
      setSubmitted(true);
    }, 1000)
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

'use server';

//Server Action:  submit truc tiep tu UI len server ma khong can tao API 

import Event from '../../database/event.model'
import connectDB from '../../lib/mongodb'

export const getSimlilarEventBySlug = async (slug:string) => {
    try{
        await connectDB();

        

        const event = await Event.findOne({slug});
        
        if (!event) {
          return []; // Nếu không tìm thấy event gốc, trả về danh sách rỗng luôn
        
        }
        return await Event.find({_id: { $ne: event._id } , tags: { $in: event.tags} } ).lean()   
        //Cai ham nay tra ve cac Mongoose Object -> Co rat nhieu ham => Look like JSON object but isn't => ...similarEvents se khong nap cac properties chinh xac
        //Use lean() to only get JSON Object to display similar events


    } catch{
        return []
    } 
}
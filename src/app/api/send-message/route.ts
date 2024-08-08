import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from '@/model/User'

export const POST = async (request:Request)=>{
    await dbConnect()

    const {username,content} = await request.json()
    console.log(content)

    try {
       const user =await UserModel.findOne({username})
       if(!user){
        return Response.json({
            success:false,
            message:"User not found"
        },{status:404})
       }

       //is user accepting the messages
       if(!user.isAcceptingMessage){
        return Response.json({
            success:false,
            message:"User not accepting messages"
        },{status:403})
       }

       const newMessage={content,createdAt:new Date()}

       user.messages.push(newMessage as Message)
       await user.save()
       return Response.json({
        success:true,
        message:"Message sent success fully"
    },{status:200})

    } catch (error) {
        return Response.json({
            success:false,
            message:"internal server error"
        },{status:401})
        
    }
}
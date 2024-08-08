import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth';

export const POST=async(request:Request)=>{
    await dbConnect()

    const session=await getServerSession(authOptions)
    const user:User = session?.user as User
    
    if(!session||!session.user){
        return Response.json({
            success:false,
            message:"Not authenticeted"
        },{status:401})
    }

    const userId=user._id;
    const {acceptMessages}=await request.json()
    try {
        //quering the database
       const updatedUser = await UserModel.findByIdAndUpdate(userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )

        //if no updated user
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"failed to update status to accept messages"
            },{status:401})
        }

        //response if updatedUser found
        return Response.json({
            success:true,
            message:"message acceptanace status updated successfully",
            updatedUser
        },{status:200})
    } catch (error) {
        console.log("failed to update status to accept messages")
        return Response.json({
            success:false,
            message:"failed to update status to accept messages"
        },{status:500})
        
    }
}

export const GET = async(request:Request)=>{
    await dbConnect()

    const session=await getServerSession(authOptions)
    const user:User = session?.user as User
    
    if(!session||!session.user){
        return Response.json({
            success:false,
            message:"Not authenticeted"
        },{status:401})
    }

    const userId=user._id;

    try {
        const foundUser = await UserModel.findById(userId)

    if(!foundUser){
        return Response.json({
            success:false,
            message:"user not found"
        },{status:404})
    }
    return Response.json({
        success:true,
        message:"is accepting messages",
        isAcceptingMessage:foundUser.isAcceptingMessage
    },{status:200})
    } catch (error) {
        console.log("error in getting message acceptance status")
        return Response.json({
            success:false,
            message:"error in getting message acceptance status"
        },{status:500})
        
    }


}
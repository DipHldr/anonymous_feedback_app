import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth';
import mongoose from "mongoose";

export const GET = async (request:Request)=>{
    await dbConnect()
    const session = await getServerSession(authOptions);

    const _user:User = session?.user as User
    
    if(!session||!_user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    //using aggregation pipeline
    const userId=new mongoose.Types.ObjectId(_user._id);
    try {
        const user = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])

        console.log(user);

        if(!user||user.length === 0){
            return Response.json({
                success:false,
                message:"No messages to display"
            },{status:404})
        }
        return Response.json({
            success:true,
            message:"Not authenticated",
            messages:user[0].messages
        },{status:200})
    } catch (error) {
        console.log("unexpected error occured",error)
        return Response.json({
            success:false,
            message:"error in getting messages"
        },{status:500})
    }

    
}
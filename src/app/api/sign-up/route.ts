import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export const POST=async (request:Request)=>{
    await dbConnect()
    try {
      const {username,email,password} = await request.json()

      const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified:true
      })

      if(existingUserVerifiedByUsername){
        return Response.json({
            success:false,
            message:"Username is already taken"
        },{status:400})
      }

      const existingUserByEmail=await UserModel.findOne({email})
      const verifyCode=Math.floor(10000+Math.random()*900000).toString()
      if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
          return Response.json({
            success:false,
            messsage:"User already exists with this email"
          },{status:400})
        }else{
          const hashedPassword=await bcrypt.hash(password,10)
          existingUserByEmail.password=hashedPassword;
          existingUserByEmail.verifyCode=verifyCode;
          existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
          await existingUserByEmail.save()
        }
      }else{
        const hashedPassword=await bcrypt.hash(password,10)
        const expiryDate=new Date()
        expiryDate.setHours(expiryDate.getHours()+1)

       const newUser= new UserModel({
            username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessage:true,
            messages:[]
        })

        await newUser.save()
      }

      //send verification Email
      const emailResponse=await sendVerificationEmail(
        email,
        username,
        verifyCode
      )

      if(!emailResponse.success){
        return Response.json({
          success:false,
          messsage:emailResponse.message
        },{status:500})
      }
      return Response.json({
        success:true,
        messsage:"User registered successfully. Please verify your email"
      },{status:201})
        
    } catch (error) {
        console.error('Error registering user',error)
        return Response.json({
            success:false,
            message:"Error Registering user"
        },
        {
            status:500
        }
    )    
    }
}

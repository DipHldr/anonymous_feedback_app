import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
export const POST=async (request:Request)=>{
    await dbConnect()

    try {

       const {username,code} = await request.json()

      const decodedUsername = decodeURIComponent(username)
      const user = await UserModel.findOne({username:decodedUsername})
      if(!user){
        return Response.json({
            success:false,
            message:"user not found"
        },{status:500})
      }

      const isCodeValid = user.verifyCode === code
      const isCodeNotExpired = new Date(user.verifyCodeExpiry)> new Date()
        
      if(isCodeValid&&isCodeNotExpired){
        user.isVerified=true
        await user.save()
        return Response.json({
            success:true,
            message:"verified successfully"
        },{status:200})
      }else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            message:"verification code expired. please signup again to get a new code"
        },{status:400})
      }else{
        return Response.json({
            success:false,
            message:"incorrect verification code"
        },{status:400})
      }

    } catch (error) {
        console.error("Error verifying user ",error)
    return Response.json({
        success:false,
        message:"verification failed"
    },{status:500})        
    }
}
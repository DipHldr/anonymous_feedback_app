import {resend} from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export const sendVerificationEmail=async(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>=>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Verification Code',
            react:VerificationEmail({username,otp:verifyCode}) ,
          });
          console.log("verification Email sent")
        return {success:true,message:"Verification email sent successfully"}
    } catch (emailError) {
        console.error("Error sending verfication email!!",
            emailError)
            return {success:false,message:"Failed to send verification email"}        
    }
}
import {z} from 'zod';

export const usernameValidation=z
.string()
.min(2,"Username must be atleast 2 characters")
.max(25,"Username must be nomore than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters")


export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email address"}),
    password:z.string().min(6,{message:"password must be atleast 6 characters"})
})
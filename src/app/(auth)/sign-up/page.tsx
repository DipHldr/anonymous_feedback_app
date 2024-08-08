'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { useDebounce} from "@uidotdev/usehooks";
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import axios,{AxiosError} from 'axios'
import Link from "next/link"
import { useState,useEffect } from "react"
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Loader2 } from "lucide-react";

const page = () => {
  const [username,setUsername]=useState('')
  const[usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingUsername,setIsChecKingUseraname]=useState(false)
  const [isSubmitting,setIsSubmitting]=useState(false)
//   const debouncedUsername = useDebounce(username, 300);
const debounced = useDebounceCallback(setUsername, 300)
  const { toast } = useToast()
  const router=useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique=async()=>{
      if(username){
        setIsChecKingUseraname(true)
        setUsernameMessage('')
        try {
          const response=await axios.get(`/api/check-username-unique?username=${username}`)
        //   let message=response.data.message
          setUsernameMessage(response.data.message)
        } catch (error) {
          const AxiosError=error as AxiosError<ApiResponse>;
           setUsernameMessage(
            AxiosError.response?.data.message??"Error checking username"
           )
        }finally{
          setIsChecKingUseraname(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`,data)
      toast({
        title:'Success',
        description:response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("error in sign-up of user",error)
      const axiosError=error as AxiosError<ApiResponse>;
      let errorMessage=axiosError.response?.data.message
      toast({
        title:"signup failed",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center 
    min-h-screen bg-gray-100">

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
            <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>   
              {isCheckingUsername&&<Loader2 className="animate-spin"/>}      
              <p className={`text-sm ${usernameMessage==="username available"?"text-green-500":"text-red-500"}`}>
                    {usernameMessage}
                </p>     
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>              
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>                         
              <FormMessage />
            </FormItem>
          )}
        />

        <Button  type="submit">
          {
            isSubmitting?(<div>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait
            </div>):('Signup')
          }
          
        </Button>
               

          </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{''}
            <Link href="/sign-in" className="text-blue-500 hover:text-blue-800 cursor-pointer">Sign in</Link>
          </p>
        </div>

      </div>
      
    </div>
  )
}

export default page

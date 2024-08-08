'use client'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent,CardHeader } from "@/components/ui/card"

import messages from '@/messages.json'
import AutoPlay from "embla-carousel-autoplay"
import { Link } from 'react-router-dom';
const Home = () => {
  
  return (
    <>
    <main className='flex-grow flex flex-col items-center
    justify-center px=4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
       <a href="/dashboard"> <h1 className='text-3xl md:text-5xl font-bold'>
          Dive into the World of Anonymous Messages        
        </h1>
        </a>
        <p className='mt-3 md:mt-4 text-bold md:text-lg'>Explore Mystery Message - Where your identity remains a secret.</p>
      </section>
      <Carousel plugins={[AutoPlay({delay:2000})]}
      className="w-full max-w-xs">
      <CarouselContent>
        {
          messages.map((message,index)=>(
            <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-lg font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    </main>

    <footer className='text-center p-4 md:p-6'>&copy; Mystery Message. All Rights reserved.</footer>
    </>
  )
}

export default Home

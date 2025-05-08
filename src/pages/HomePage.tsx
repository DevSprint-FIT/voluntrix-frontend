'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'


import EventSection from "@/components/layout/EventSection";
import ServiceSection from "@/components/layout/ServiceSection";
import FeedSection from "@/components/layout/FeedSection";
import FooterSection from "@/components/layout/FooterSection";
import Navbar from "@/components/UI/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import TestimonialSection from "@/components/layout/TestimonialSection";
import GoToTop from "@/components/UI/GoToTop";

export default function HomePage() {

    const [open, setOpen] = useState(true)

  return (
    <div className="flex flex-col justify-center aitems-start flex-shrink-0 gap-[50px]">
      <Navbar />
      <HeroSection />
      <ServiceSection />
      <EventSection />
      <FeedSection />
      <TestimonialSection />
      <hr className="w-[1250px] border-t border-shark-200 mx-auto" />
      <FooterSection />
      <GoToTop />


      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >Click me</button>


     


    </div>
  );
}

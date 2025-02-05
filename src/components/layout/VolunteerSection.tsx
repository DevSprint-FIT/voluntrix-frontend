import React from 'react'
import Image from 'next/image'

const VolunteerSection = () => {
  return (
   
      <div className="bg-gradient-to-r from-[#D0FBE7] to-[#ECFDF6] py-16 px-12 text-center flex items-center justify-center gap-36">
        
          
          
          <div className="max-w-lg pl-6 md:pl-8 md:text-left ">
          <h1 className=" text-[44px] md:text-4xl  text-gray-900 font-primary">
            Celebrate Achievements and Stay Inspired
          </h1>
          <p className="text-gray-600 mt-4 font-secondary text-[18px] leading-[1.8] ">
            Explore stories of impact shared by organizations. See how volunteers are making a difference and get inspired to be part of the change.
          </p>
          <br/>
         <button className="bg-shark-950 text-white text-lg font-primary tracking-widest flex items-center gap-2 px-5 py-2 rounded-lg shadow-md hover:bg-gray-900">
          Explore Now
          <Image
            src="/icons/arrow.svg"
            alt="Arrow Icon"
            width={27}
            height={20}
          />
        </button>
        </div>
        <div className="mt-8 md:mt-0 flex space-x-6">
          <Image src="/images/posts.png" alt="Volunteer 1 Image" width={500} height={403} className="pr-4" />
        </div>
        
      
    </div>
  )
}

export default VolunteerSection
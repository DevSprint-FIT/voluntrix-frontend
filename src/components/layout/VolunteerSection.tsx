import React from 'react'
import Image from 'next/image'

const VolunteerSection = () => {
  return (
    <div>

  <section className="bg-green-100 py-16 px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <div className="max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Celebrate Achievements and Stay Inspired</h1>
          <p className="text-gray-600 mt-4">
            Explore stories of impact shared by organizations. See how volunteers are making a difference and get inspired to be part of the change.
          </p>

          <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition w-[165px]">
          <div className="flex gap-2" ><p>Take a Tour</p>

          <Image src="icons/arrow.svg" alt="Arrow Image" width={24} height={24} />
          

          </div>
          </button>


         
          
        </div>
        <div className="mt-8 md:mt-0 flex space-x-4">
         
        <Image src="/images/volunteer-1.png" alt="Volunteer 1 Image" width={315} height={403}/>
        <Image src="/images/volunteer-2.png" alt="Volunteer 1 Image" width={315} height={403}/>
         
         
         
        </div>
      </section>



    </div>
  )
}

export default VolunteerSection
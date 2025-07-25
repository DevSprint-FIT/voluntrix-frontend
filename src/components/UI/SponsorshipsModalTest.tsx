'use client'
import React, { useEffect, useState } from 'react';

interface SponsorshipPackage {
  id: string;
  name: string;
  price: string;
  available: boolean;
}

interface SponsorshipBenefit {
  id: string;
  description: string;
}

const SponsorshipModal: React.FC<{ 
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>('platinum');

    const [sponsorshipBenefits, setSponsorshipBenefits] = useState<SponsorshipBenefit[]>([]);

  useEffect(() => {
    const SponsorShipGold=async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/sponsorships');
        const data = await response.json();
        setSponsorshipBenefits(data);
        console.log(data);
    }
    SponsorShipGold();
}
, []);

  const packages: SponsorshipPackage[] = [
    { id: 'platinum', name: 'Platinum Sponsor', price: 'LKR 500,000', available: true },
    { id: 'gold', name: 'Gold Sponsor', price: 'LKR 250,000', available: true },
    { id: 'silver', name: 'Silver Sponsor', price: 'LKR 100,000', available: false },
    { id: 'community', name: 'Community Partner', price: 'LKR 50,000', available: true },
  ];

//   const benefits: SponsorshipBenefit[] = [
//     { id: 'logo', description: 'Prominent logo placement on all media (physical + digital)' },
//     { id: 'speaking', description: 'Speaking opportunity at opening ceremony' },
//     { id: 'booth', description: 'Branded booth space & banners at venue' },
//     { id: 'media', description: 'Featured in media and press releases' },
//     { id: 'materials', description: 'Logo on all recap materials & event emails' },
//     { id: 'video', description: 'Customized thank-you video from team' },
//   ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-4xl relative p-12">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

       
        <div className="p-8">
          <h2 className="text-[1.85rem] font-bold text-center mb-2 font-primary">Become a Proud Sponsor of Voluntrix Events</h2>
          <p className="text-shark-600 text-center mb-8 font-secondary text-sm">
            Support community-driven events and gain brand exposure through<br /> our flexible sponsorship packages.
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            
            <div className="md:w-1/2 space-y-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`p-4 rounded-xl   transition-all duration-300 cursor-pointer bg-[#fbfbfb] ${
                    selectedPackage === pkg.id ? '' : 'border-gray-200'
                  } ${!pkg.available ? 'opacity-60' : 'hover:shadow-xl'}`}
                  onClick={() => pkg.available && setSelectedPackage(pkg.id)}
                >
                  <label className="flex items-start space-x-4 cursor-pointer">
                    <input
                      type="checkbox"
                      value={pkg.id}
                      checked={selectedPackage === pkg.id}
                      onChange={() => pkg.available && setSelectedPackage(pkg.id)}
                      disabled={!pkg.available}
                      className="w-5 h-5 mt-1 accent-[#029972]"
                    />
                    <div className="flex gap-9">
                      <div className='flex flex-col'>
                        
                    <span className="font-bold text-xl">{pkg.name}</span>
                      <span className="text-gray-700">{pkg.price}</span>

                        
                        </div>  
                      
                      {!pkg.available && (
                        <span className=" bg-gray-200 text-gray-700 text-sm px-2 rounded  mt-1 flex h-5 ">
                          Not Available
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            
            <div className="md:w-1/2 pl-4  rounded-3xl bg-[#fbfbfb]">
            <br></br>
              <h3 className="font-semibold text-xl mb-4 ">Includes :</h3>
              <div>
                {sponsorshipBenefits.map((benefit) => (
                  <div key={benefit.id} className="mb-4 flex items-center gap-8">
                    <div className=" flex items-center justify-center mr-2 order-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#029972]">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <p className='w-80'>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium text-lg"
              onClick={() => console.log(`Requesting plans for ${selectedPackage} package`)}
            >
              Request Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipModal;

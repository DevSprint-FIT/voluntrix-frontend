import React, { useState } from 'react';

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

  const packages: SponsorshipPackage[] = [
    { id: 'platinum', name: 'Platinum Sponsor', price: 'LKR 500,000', available: true },
    { id: 'gold', name: 'Gold Sponsor', price: 'LKR 250,000', available: true },
    { id: 'silver', name: 'Silver Sponsor', price: 'LKR 100,000', available: false },
    { id: 'community', name: 'Community Partner', price: 'LKR 50,000', available: true },
  ];

  const benefits: SponsorshipBenefit[] = [
    { id: 'logo', description: 'Prominent logo placement on all media (physical + digital)' },
    { id: 'speaking', description: 'Speaking opportunity at opening ceremony' },
    { id: 'booth', description: 'Branded booth space & banners at venue' },
    { id: 'media', description: 'Featured in media and press releases' },
    { id: 'materials', description: 'Logo on all recap materials & event emails' },
    { id: 'video', description: 'Customized thank-you video from team' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl relative">
        {/* Close button */}
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

        {/* Modal content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Become a Proud Sponsor of Voluntrix Events</h2>
          <p className="text-gray-600 text-center mb-8">
            Support community-driven events and gain brand exposure through our flexible sponsorship packages.
          </p>

          <div className="flex flex-col md:flex-row">
            {/* Packages */}
            <div className="md:w-1/2 pr-4">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="mb-4 flex items-center"
                >
                  <div 
                    className={`w-8 h-8 rounded-md border flex items-center justify-center mr-4 cursor-pointer ${
                      pkg.available ? 'border-green-500' : 'border-gray-300'
                    }`}
                    onClick={() => pkg.available && setSelectedPackage(pkg.id)}
                  >
                    {pkg.available && selectedPackage === pkg.id && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl">{pkg.name}</h3>
                    <p className="text-gray-700">{pkg.price}</p>
                  </div>
                  {!pkg.available && (
                    <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                      Not Available
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="md:w-1/2 pl-4">
              <h3 className="font-semibold text-xl mb-4">Includes :</h3>
              <div>
                {benefits.map((benefit) => (
                  <div key={benefit.id} className="mb-4 flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center mr-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <p>{benefit.description}</p>
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

// Usage example:
// const App = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   
//   return (
//     <div>
//       <button onClick={() => setIsModalOpen(true)}>Open Sponsorship Modal</button>
//       <SponsorshipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   );
// };
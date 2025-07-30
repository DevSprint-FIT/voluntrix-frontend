import { SponsorshipType } from '@/types/SponsorshipType';
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

const SponsorshipModal: React.FC<{
  isOpen: boolean;
  sponsorships: SponsorshipType[];
  onFormChange: (open: boolean) => void;
}> = ({ isOpen, sponsorships, onFormChange }) => {
  const [selectedPackage, setSelectedPackage] =
    useState<SponsorshipType | null>(sponsorships[0] || null);

  return (
    <Modal isOpen={isOpen} onOpenChange={onFormChange} size="4xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center justify-center gap-2">
              <h2 className="text-3xl text-shark-950 font-semibold text-center font-primary">
                Become a Proud Sponsor of Voluntrix Events
              </h2>
              <p className="text-shark-700 text-center font-normal font-secondary text-sm">
                Support community-driven events and gain brand exposure through
                our flexible sponsorship packages.
              </p>
            </ModalHeader>
            <ModalBody className="flex flex-row justify-center items-center gap-6">
              <div className="w-1/2 space-y-6">
                {sponsorships.map((pkg) => (
                  <div
                    key={pkg.sponsorshipId}
                    className={`rounded-xl transition-all duration-300 cursor-pointer bg-shark-50 ${
                      selectedPackage?.sponsorshipId === pkg.sponsorshipId
                        ? ''
                        : 'border-shark-100'
                    } ${!pkg.available ? 'opacity-60' : 'hover:shadow-xl'}`}
                    onClick={() => pkg.available && setSelectedPackage(pkg)}
                  >
                    <label className="py-3 pr-2 pl-4 flex items-start space-x-4 cursor-pointer">
                      <input
                        type="checkbox"
                        value={pkg.sponsorshipId}
                        checked={
                          selectedPackage?.sponsorshipId === pkg.sponsorshipId
                        }
                        onChange={() =>
                          pkg.available && setSelectedPackage(pkg)
                        }
                        disabled={!pkg.available}
                        className="w-4 h-4 mt-1 text-verdant-500 rounded-md"
                      />
                      <div className="flex gap-9">
                        <div className="flex flex-col">
                          <span className="font-bold text-shark-950 text-lg">
                            {pkg.type}
                          </span>
                          <span className="text-shark-700 text-md">
                            {pkg.price}
                          </span>
                        </div>

                        {!pkg.available && (
                          <span className=" bg-shark-200 text-shark-900 text-sm px-2 rounded  mt-1 flex h-5 ">
                            Not Available
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="w-1/2 rounded-3xl bg-shark-50 p-6">
                <h3 className="font-semibold text-xl">Includes :</h3>
                <div>
                  {selectedPackage &&
                    (() => {
                      if (!selectedPackage.benefits) return null;

                      // Split the benefits paragraph into sentences
                      const sentences = selectedPackage.benefits
                        .split('.')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0);

                      return sentences.map((sentence, idx) => (
                        <div key={idx} className="flex flex-wrap items-center">
                          <div className="flex items-center justify-center mr-2 order-1">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-[#029972]"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <p className="w-80 text-sm text-shark-900">
                            {sentence}.
                          </p>
                        </div>
                      ));
                    })()}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="shadow"
                // disabled={!isFormValid || isLoading}
                // isLoading={isLoading}
                className={
                  'bg-verdant-600 text-white text-sm font-primary px-6 py-2 rounded-[20px] tracking-[1px]'
                }
                // ${
                // (!isFormValid || isLoading) &&
                // 'opacity-40 cursor-not-allowed'
                // }`}
                onPress={() => {
                  console.log(
                    `Requesting plans for ${selectedPackage?.type} package`
                  );
                  onClose();
                }}
              >
                Request Sponsorship
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SponsorshipModal;

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
import { CheckCircle } from 'lucide-react';

const SponsorshipModal: React.FC<{
  isOpen: boolean;
  sponsorships: SponsorshipType[];
  onFormChange: (open: boolean) => void;
}> = ({ isOpen, sponsorships, onFormChange }) => {
  const [selectedPackage, setSelectedPackage] =
    useState<SponsorshipType | null>(sponsorships[0] || null);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onFormChange}
      size="4xl"
      className="rounded-2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-center space-y-2 flex flex-col pt-6 pb-7">
              <h2 className="text-2xl font-semibold text-shark-950 font-primary">
                Become a Proud Sponsor of Voluntrix Events
              </h2>
              <p className="text-shark-600 font-normal text-sm font-secondary">
                Support community-driven events and gain brand exposure through
                our flexible sponsorship packages.
              </p>
            </ModalHeader>

            <ModalBody className="flex flex-col lg:flex-row justify-between gap-6 px-6">
              <div className="w-full lg:w-1/2 space-y-4">
                {sponsorships.map((pkg) => (
                  <div
                    key={pkg.sponsorshipId}
                    className={`rounded-xl border px-5 py-4 cursor-pointer transition-all ${
                      selectedPackage?.sponsorshipId === pkg.sponsorshipId
                        ? 'border-verdant-600 bg-verdant-50 shadow-md'
                        : 'border-shark-200 hover:shadow-sm'
                    } ${!pkg.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => pkg.available && setSelectedPackage(pkg)}
                    role="radio"
                    aria-checked={
                      selectedPackage?.sponsorshipId === pkg.sponsorshipId
                    }
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-shark-950">
                          {pkg.type}
                        </span>
                        <span className="text-md text-shark-700">
                          Rs. {pkg.price.toLocaleString()}
                        </span>
                      </div>

                      {!pkg.available && (
                        <span className="text-xs bg-shark-200 text-shark-900 px-2 py-1 rounded">
                          Not Available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full lg:w-1/2 rounded-2xl bg-shark-50 p-6 space-y-3">
                <h3 className="text-xl font-semibold mb-3 text-shark-900">
                  What You Get:
                </h3>
                {selectedPackage?.benefits ? (
                  selectedPackage.benefits
                    .split('.')
                    .map((sentence) => sentence.trim())
                    .filter(Boolean)
                    .map((sentence, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-verdant-600 mt-1" />
                        <p className="text-shark-800 text-sm">{sentence}.</p>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-shark-500">No benefits listed.</p>
                )}
              </div>
            </ModalBody>

            <ModalFooter className="px-6">
              <Button
                variant="shadow"
                isLoading={false}
                className="bg-verdant-600 hover:bg-verdant-700 text-white font-medium rounded-full px-6 py-2 text-sm tracking-wide"
                onPress={() => {
                  console.log(
                    `Requesting plans for ${selectedPackage?.type} package`
                  );
                  onClose();
                }}
                isDisabled={!selectedPackage}
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

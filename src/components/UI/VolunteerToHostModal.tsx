'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
} from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';

interface VolunteerToHostModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function VolunteerToHostModal({
  isOpen,
  onOpenChange,
}: VolunteerToHostModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConfirming(false);
    onOpenChange();
    // Add your API call here to upgrade volunteer to event host
    console.log('Volunteer upgraded to Event Host');
  };

  const benefits = [
    {
      title: 'Create & Manage Events',
      description:
        'Design and organize impactful events that bring communities together',
    },
    {
      title: 'Build Your Network',
      description:
        'Connect with like-minded individuals and expand your professional circle',
    },
    {
      title: 'Earn Recognition Points',
      description:
        'Gain extra recognition points for hosting successful events',
    },
    {
      title: 'Leadership Development',
      description: 'Develop valuable leadership and project management skills',
    },
    {
      title: 'Partnership Opportunities',
      description:
        'Collaborate with organizations and secure sponsorships for your events',
    },
    {
      title: 'Greater Impact',
      description: 'Amplify your contribution to causes you care about',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        backdrop:
          'bg-gradient-to-t from-shark-900/50 to-shark-900/25 backdrop-opacity-20',
        base: 'border-none bg-gradient-to-br from-white to-gray-50',
        header: 'border-b-[1px] border-gray-200',
        footer: 'border-t-[1px] border-gray-200',
        closeButton: 'hover:bg-shark-100 active:bg-shark-200 transition-colors',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-4 pt-8 pb-4">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-shark-900 to-shark-700 bg-clip-text text-transparent font-primary">
                  Ready to Lead the Change?
                </h2>
                <p className="text-shark-600 font-secondary font-normal text-lg max-w-md">
                  Become an event host and create meaningful impact in your
                  community
                </p>
              </div>
            </ModalHeader>

            <ModalBody className="px-8 py-6">
              <div className="space-y-8">
                {/* Introduction Section */}
                <Card className="bg-gradient-to-r from-verdant-50 to-emerald-50 border-verdant-200 shadow-sm">
                  <CardBody className="p-6">
                    <div className="flex items-start gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-shark-900 font-primary mb-2">
                          What does it mean to be an Event Host?
                        </h3>
                        <p className="text-shark-700 font-secondary leading-relaxed">
                          As an Event Host, you&apos;ll have the power to
                          create, organize, and lead events that matter.
                          You&apos;ll be at the forefront of community
                          engagement, bringing people together for causes
                          you&apos;re passionate about while developing valuable
                          leadership skills.
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Benefits Section */}
                <div>
                  <h3 className="text-2xl font-bold text-shark-900 font-primary mb-6 text-center">
                    Your Host Benefits & Opportunities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-md transition-all duration-300 hover:scale-[1.02] bg-white border-gray-200"
                      >
                        <CardBody className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-shark-900 font-primary text-lg mb-1">
                                {benefit.title}
                              </h4>
                              <p className="text-shark-600 font-secondary text-sm leading-relaxed">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="px-8 py-6">
              <div className="flex justify-between items-center w-full">
                <Button
                  color="default"
                  variant="bordered"
                  className="border-shark-300 text-shark-700 hover:bg-shark-50 px-6 py-3 font-medium"
                >
                  Learn More
                </Button>
                <div className="flex gap-3">
                  <Button
                    color="default"
                    variant="light"
                    onPress={onClose}
                    className="text-shark-600 hover:bg-shark-100 px-8 py-3 font-medium transition-colors"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    isLoading={isConfirming}
                    onPress={handleConfirm}
                    className="bg-gradient-to-r from-verdant-600 to-verdant-700 text-white px-8 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isConfirming ? 'Processing...' : 'Make Me a Host'}
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

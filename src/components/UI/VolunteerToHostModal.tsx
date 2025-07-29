'use client';

import { makeEventHost } from '@/services/volunteerProfileService';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

  const router = useRouter();

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      // Call the service to make the volunteer an event host
      await makeEventHost(6); // Replace with actual volunteer ID
      console.log('Volunteer upgraded to Event Host');
      router.push('/event-host/events');
    } catch (error) {
      console.error('Error making volunteer an event host:', error);
    } finally {
      setIsConfirming(false);
      onOpenChange();
    }
  };

  const benefits = [
    'Create & Manage Events - Design and organize impactful events that bring communities together',
    'Build Your Network - Connect with like-minded individuals and expand your professional circle',
    'Earn Recognition Points - Gain extra recognition points for hosting successful events',
    'Leadership Development - Develop valuable leadership and project management skills',
    'Partnership Opportunities - Collaborate with organizations and secure sponsorships for your events',
    'Greater Impact - Amplify your contribution to causes you care about',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent className="px-8">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-2 pt-5">
              <div className="text-3xl font-bold text-shark-950 font-primary">
                Ready to Lead the Change?
              </div>
              <p className="text-shark-700 font-secondary font-normal text-lg">
                Become an event host and create meaningful impact in your
                community
              </p>
            </ModalHeader>

            <ModalBody>
              <div className="space-y-8">
                <Card className="bg-gradient-to-r from-verdant-100 to-emerald-100 border-verdant-200 shadow-sm">
                  <CardBody className="px-6 py-5">
                    <div>
                      <h3 className="text-xl font-semibold text-shark-950 font-primary mb-2">
                        What does it mean to be an Event Host?
                      </h3>
                      <p className="text-shark-700 font-secondary leading-relaxed">
                        As an Event Host, you&apos;ll have the power to create,
                        organize, and lead events that matter. You&apos;ll be at
                        the forefront of community engagement, bringing people
                        together for causes you&apos;re passionate about while
                        developing valuable leadership skills.{' '}
                        <Link
                          href="#learn-more"
                          className="text-verdant-600 hover:text-verdant-700 underline font-medium"
                        >
                          Learn more
                        </Link>
                      </p>
                    </div>
                  </CardBody>
                </Card>
                <div>
                  <div className="text-xl font-semibold text-shark-950 font-primary mb-3">
                    Your Host Benefits & Opportunities
                  </div>
                  <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-verdant-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-shark-700 font-secondary">
                          <span className="font-medium text-shark-950">
                            {benefit.split(' - ')[0]}
                          </span>{' '}
                          - {benefit.split(' - ')[1]}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex gap-3">
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  className="text-shark-600 bg-shark-200 hover:bg-shark-300 px-8 py-3 font-medium rounded-[20px]"
                >
                  Maybe Later
                </Button>
                <Button
                  isLoading={isConfirming}
                  onPress={handleConfirm}
                  className="bg-gradient-to-r from-verdant-600 to-verdant-700 text-white px-6 py-3 font-semibold rounded-[20px] shadow-lg hover:shadow-xl"
                >
                  Make Me a Host
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

import { Button } from '@heroui/react';
import Image from 'next/image';

export default function OrganizationEC() {
  return (
    <>
      <div className="mt-2 font-primary font-medium text-shark-950 text-[20px]">
        Organizations
      </div>
      <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
        Select your organization
        <div className="flex gap-4">
          <input
            type="text"
            className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[350px] placeholder:text-shark-300"
          />
          <Button
            variant="shadow"
            // disabled={!isFormValid}
            className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-lg tracking-[1px] h-9"
            onPress={() => {
              // if (!isFormValid) return;
              // 👉 TODO: send data to your API here
              // await fetch(...)
              // setArea(null);
              // setReason('');
              // setIsAgree(false);
              // onClose();
              // openSuccessModal();
            }}
          >
            Invite
          </Button>
        </div>
      </label>
      <div className="flex items-center gap-2">
        <Image
          src={'/images/DummyOrganization.svg'}
          width={24}
          height={24}
          alt="organization"
        />
        <p className="font-secondary font-normal text-shark-950 text-[15px]">
          INTECS, UoM
        </p>
      </div>
      <div className="font-secondary font-normal text-shark-950 text-[13px]">
        *Once you invite an organization to the event, they will be notified to
        review the event details. The organization will then either accept or
        decline the invitation based on their evaluation.
      </div>
    </>
  );
}

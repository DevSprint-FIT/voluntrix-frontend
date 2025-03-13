import Image from 'next/image';

interface FilterProps {
  name: string;
}

export default function FilterTag({ name }: FilterProps) {
  return (
    <div className="w-[130px] h-[44px] flex justify-center items-center bg-shark-50 rounded-[20px] gap-2">
      <p className="font-secondary font-medium text-shark-950 text-[16px]">
        {name}
      </p>
      <Image
        src="/icons/close-circle.svg"
        width={24}
        height={24}
        alt="Search icon"
        className="cursor-pointer"
      />
    </div>
  );
}

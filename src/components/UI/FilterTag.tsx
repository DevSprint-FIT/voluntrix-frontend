import Image from 'next/image';

interface FilterProps {
  name: string;
}

export default function FilterTag({ name }: FilterProps) {
  return (
    <div className="px-3 py-2 flex justify-center items-center bg-shark-50 rounded-[20px] gap-2">
      <p className="font-secondary text-shark-950 text-sm">
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

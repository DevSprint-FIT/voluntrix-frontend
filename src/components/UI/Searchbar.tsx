import Image from 'next/image';

export default function Searchbar() {
  return (
    <div className="w-[639px] flex justify-center items-center rounded-[40px] border-2 border-shark-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] py-3">
      <div className="w-[607px] h-8 flex">
        <input
          type="text"
          className="w-[575px] text-shark-950 text-lg outline-none bg-transparent px-2"
          placeholder="Search for events by name"
        />
        <Image src={'icons/search.svg'} width={32} height={32} alt="search" />
      </div>
    </div>
  );
}

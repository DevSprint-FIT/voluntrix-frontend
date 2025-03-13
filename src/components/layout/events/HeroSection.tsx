import Breadcrumb from '@/components/UI/Breadcrumb';
import FilterSection from '@/components/UI/FilterSection';
import Searchbar from '@/components/UI/Searchbar';

export default function HeroSection() {
  return (
    <div className="w-full flex items-start justify-center mt-32">
      <div className="w-[1200px] flex flex-col items-center justify-start">
        <Breadcrumb />
        <div className="w-[806px] h-[248px] mt-16 flex flex-col items-center justify-start">
          <p className="font-primary text-shark-950 font-medium text-[44px]">
            <span className="text-verdant-600">Join</span> Meaningful
            <span className="text-verdant-600"> Events</span>
          </p>
          <p className="font-primary text-shark-950 font-medium text-[44px]">
            and <span className="text-verdant-600">Contribute </span>
            to the Community
          </p>
          <p className="font-secondary text-shark-700 text-lg mt-4">
            Discover events that match your passion and make a difference
          </p>
        </div>
        <div className="relative w-[806px] mt-10 flex gap-6 rounded-10">
          <div className="w-[639px] relative">
            <Searchbar />
          </div>
          <FilterSection />
        </div>
      </div>
    </div>
  );
}

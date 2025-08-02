"use client"; 

import RewardSummary from "@/components/UI/RewardSummary";
import ButtonGroup from "@/components/UI/ButtonGroup";
import { usePathname, useRouter } from "next/navigation";

export default function RewardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '';

  const buttons = [
    { label: "Status", path: "/Reward/status" },
    { label: "Redeem", path: "/Reward/redeem" },
  ];

  const activeButtonLabel = buttons.find(btn => pathname.startsWith(btn.path))?.label || "Earn";

  const handleBackClick = () => {
    router.back(); // Goes back to previous page
    // Alternative: router.push('/volunteer/profile') for specific route
  };

  return (
    <div className="mt-2 p-4">
      {/* Back Button Header */}
      <div className="mb-4">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 px-4  text-shark-600 hover:text-shark-800 hover:bg-shark-50 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Profile
        </button>
      </div>

      <RewardSummary />
      
      <div className="mt-10">
        <ButtonGroup
          buttons={buttons}
          onSelect={(label) => {
            const btn = buttons.find(b => b.label === label);
            if (btn) router.push(btn.path);
          }}
          activeButton={activeButtonLabel} 
        />
      </div>

      <div className="mt-10">{children}</div>
    </div>
  );
}
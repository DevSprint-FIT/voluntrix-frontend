"use client"; 

import RewardSummary from "@/components/UI/RewardSummary";
import ButtonGroup from "@/components/UI/ButtonGroup";
import { usePathname, useRouter } from "next/navigation";

export default function RewardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const buttons = [
    { label: "Earn", path: "/Reward/earn" },
    { label: "Redeem", path: "/Reward/redeem" },
    { label: "Status", path: "/Reward/status" },
  ];

  const activeButtonLabel = buttons.find(btn => pathname.startsWith(btn.path))?.label || "Earn";

  return (
    <div className="mt-10 p-4">
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

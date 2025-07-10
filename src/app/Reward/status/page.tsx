
export default function RewardStatus() {
 
  const currentPoints = 6053;
  const nextLevelPoints = 7500;
  const level = 1;
  const progress = Math.min((currentPoints / nextLevelPoints) * 100, 100);
  const lifetimePoints = 6053; 
  const lifetimeRedeemed = 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-0">
      <div className="bg-white shadow-lg rounded-xl p-12 w-full flex flex-col items-center">
        <div className="flex w-full justify-between items-start mb-10">
          {/* Lifetime Points */}
          <div className="flex flex-col items-start" style={{ paddingLeft: "10rem" }}>
            <span className="text-shark-900 text-medium mt-2 order-2">Lifetime points earned</span>
            <div className="flex items-center order-1">
              <span className="text-6xl font-bold text-shark-950">{lifetimePoints}</span>
            </div>
          </div>
          {/* Profile + Level + Progress */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-gray-200 border-4 shadow mb-4 flex items-center justify-center">
              {/* Empty profile placeholder */}
            </div>
            <div className="text-shark-900 font-semibold text-4xl mb-2">Level {level}</div>
            <div className="w-64 bg-shark-100 rounded-full h-3 mb-2">
              <div
                className="bg-verdant-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-base text-shark-400">
              {nextLevelPoints - currentPoints} points until Level {level + 1} this month
            </div>
          </div>
          {/* Lifetime Redeemed */}
          <div className="flex flex-col items-end" style={{ paddingRight: "10rem" }}>
            <div className="flex items-center gap-2">
              <span className="text-6xl font-bold text-shark-950">{lifetimeRedeemed}</span>
            </div>
            <span className="text-shark-900 text-medium mt-2">Lifetime points redeemed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
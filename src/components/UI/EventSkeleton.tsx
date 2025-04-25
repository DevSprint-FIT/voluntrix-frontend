import { Card, Skeleton } from '@heroui/react';

export default function EventSkeleton() {
  return (
    <Card
      className="w-[310px] h-[460px] flex flex-col items-center justify-start bg-white shadow-lg gap-3"
      radius="md"
    >
      <Skeleton className="w-full h-[165px] rounded-md" />

      <div className="flex flex-col w-full gap-4 p-4">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="w-2/3 h-4 rounded-lg" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
        <Skeleton className="w-1/3 h-3 rounded-lg" />
        <div className="flex flex-col gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-2 rounded-lg" />
          ))}
          <Skeleton className="w-1/3 h-2 rounded-lg" />
        </div>
        <div className="flex gap-2 mt-2">
          <Skeleton className="w-[90px] h-5 rounded-md" />
          <Skeleton className="w-[90px] h-5 rounded-md" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="w-6 h-6 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[70px] h-2 rounded-lg" />
            <Skeleton className="w-[70px] h-2 rounded-lg" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full ml-6" />
          <Skeleton className="w-[70px] h-2 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

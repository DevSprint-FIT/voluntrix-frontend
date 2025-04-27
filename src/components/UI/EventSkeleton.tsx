import { Skeleton } from '@heroui/react';

export default function EventSkeleton() {
  return (
    <div className="w-full flex items-start justify-center mb-[88px]">
      <div className="w-[1200px] flex items-start justify-center">
        <div className="mt-14 flex gap-20">
          <div className="w-[522px] flex items-center justify-end">
            <Skeleton className="w-[495px] h-[369px] rounded-lg" />
          </div>
          <div className="flex justify-start w-[545px]">
            <div className="flex flex-col items-start gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex w-[545px] items-start justify-between">
                  <Skeleton className="w-[350px] h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-[120px] h-5 rounded-full mx-2" />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex gap-2 items-center mt-1">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-[100px] h-2 rounded-lg" />
                    <Skeleton className="w-[100px] h-2 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-[100px] h-2 rounded-lg" />
                    <Skeleton className="w-[100px] h-2 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <Skeleton className="w-[100px] h-2 rounded-lg" />
                </div>
              </div>
              <div className="flex flex-col gap-5 mt-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-[545px] h-2 rounded-lg" />
                  <Skeleton className="w-[345px] h-2 rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-[545px] h-2 rounded-lg" />
                  <Skeleton className="w-[545px] h-2 rounded-lg" />
                  <Skeleton className="w-[545px] h-2 rounded-lg" />
                  <Skeleton className="w-[545px] h-2 rounded-lg" />
                  <Skeleton className="w-[545px] h-2 rounded-lg" />
                  <Skeleton className="w-[100px] h-2 rounded-lg" />
                </div>
              </div>
              <Skeleton className="w-[180px] h-10 rounded-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

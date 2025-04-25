import { Card, Skeleton } from '@heroui/react';

export default function EventSkeleton() {
  return (
    <>
      <Card
        className="w-[310px] h-[460px] flex flex-col items-center justify-start bg-white shadow-lg gap-6"
        radius="md"
      >
        <Skeleton className="rounded-md">
          <div className="w-[310px] h-[165px] rounded-t-md bg-defualt" />
        </Skeleton>
        <div className="flex flex-col w-[258px] gap-4">
          <div className="flex items-center justify-between w-full">
            <Skeleton className="w-[200px] rounded-lg">
              <div className="h-4 w-full rounded-lg bg-defualt" />
            </Skeleton>
            <Skeleton className="rounded-full">
              <div className="w-6 h-6 rounded-full bg-defualt" />
            </Skeleton>
          </div>
          <Skeleton className="w-[130px] rounded-lg">
            <div className="h-3 w-full rounded-lg bg-defualt-300" />
          </Skeleton>
          <div className="flex flex-col gap-2 mt-2">
            <Skeleton className="w-[250px] rounded-lg">
              <div className="h-2 w-full rounded-lg bg-defualt-200" />
            </Skeleton>
            <Skeleton className="w-[250px] rounded-lg">
              <div className="h-2 w-full rounded-lg bg-defualt-200" />
            </Skeleton>
            <Skeleton className="w-[250px] rounded-lg">
              <div className="h-2 w-full rounded-lg bg-defualt-200" />
            </Skeleton>
            <Skeleton className="w-[110px] rounded-lg">
              <div className="h-2 w-full rounded-lg bg-defualt-200" />
            </Skeleton>
          </div>
          <div className="flex justify-start gap-2 mt-2">
            <Skeleton className="w-[90px] rounded-md">
              <div className="h-5 w-full rounded-md bg-defualt-300" />
            </Skeleton>
            <Skeleton className="w-[90px] rounded-md">
              <div className="h-5 w-full rounded-md bg-defualt-300" />
            </Skeleton>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <Skeleton className="w-6 rounded-full">
              <div className="h-6 w-full rounded-full bg-defualt" />
            </Skeleton>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-[70px] rounded-lg">
                <div className="h-2 w-full rounded-lg bg-defualt-200" />
              </Skeleton>
              <Skeleton className="w-[70px] rounded-lg">
                <div className="h-2 w-full rounded-lg bg-defualt-200" />
              </Skeleton>
            </div>
            <Skeleton className="w-6 rounded-full ml-6">
              <div className="w-full h-6 rounded-full bg-defualt" />
            </Skeleton>
            <Skeleton className="w-[70px] h-2 rounded-lg">
              <div className="h-full w-full rounded-lg bg-defualt-200" />
            </Skeleton>
          </div>
        </div>
      </Card>
    </>
  );
}

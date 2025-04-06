interface FilterTagProps {
  name: string;
}

export default function FilterTag({ name }: FilterTagProps) {
  return (
    <div className="px-3 py-2 flex justify-center items-center bg-shark-100 rounded-[20px] gap-2">
      <p className="font-secondary text-shark-950 text-sm">
        {name}
      </p>
    </div>
  );
}

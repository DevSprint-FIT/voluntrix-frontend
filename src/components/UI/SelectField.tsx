import { Select, SelectItem } from '@heroui/react';

export default function SelectField({ options, value, onChange, disabled }) {
  return (
    <>
      <Select
        className="w-[141px] border-2 border-shark-300 rounded-lg"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {options.length > 0 ? (
          options.map((option) => (
            <SelectItem key={option.key || option} value={option.key || option}>
              {option.label || option}
            </SelectItem>
          ))
        ) : (
          <SelectItem disabled>Select Province</SelectItem>
        )}
      </Select>
    </>
  );
}

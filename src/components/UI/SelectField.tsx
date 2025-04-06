import { Select, SelectItem } from '@heroui/react';

interface SelectFieldProps {
  options: { key: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SelectField({
  options,
  value,
  onChange,
  disabled,
}: SelectFieldProps) {
  return (
    <Select
      variant="bordered"
      className="w-[141px] rounded-lg"
      classNames={{
        base: 'border-shark-300',
        trigger: 'border-shark-300',
      }}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      size={'sm'}
    >
      {options.length > 0 ? (
        options.map((option) => (
          <SelectItem
            className="font-medium text-shark-600"
            key={option.key}
            value={option.label}
          >
            {option.label}
          </SelectItem>
        ))
      ) : (
        <SelectItem className="font-medium text-shark-600" isDisabled>
          Select Province
        </SelectItem>
      )}
    </Select>
  );
}

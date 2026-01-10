"use client";
import {
  IconAlignLeft,
  IconCheck,
  IconCircleDot,
  IconHash,
  IconTextSize,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { FIELD_TYPES, type FieldType, fieldTypeLabels } from "./types";

const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  text: <IconTextSize className="h-4 w-4" />,
  textarea: <IconAlignLeft className="h-4 w-4" />,
  number: <IconHash className="h-4 w-4" />,
  select: <IconCircleDot className="h-4 w-4" />,
  multiselect: <IconCheck className="h-4 w-4" />,
};

interface FormFieldTypeSelectorProps {
  value: FieldType;
  onChange: (value: FieldType) => void;
  disabled?: boolean;
}

export function FormFieldTypeSelector({
  value,
  onChange,
  disabled,
}: FormFieldTypeSelectorProps) {
  return (
    <Select
      disabled={disabled}
      onValueChange={(newValue) => {
        if (newValue) {
          onChange(newValue as FieldType);
        }
      }}
      value={value}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            {fieldTypeIcons[value]}
            <span>{fieldTypeLabels[value]}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {FIELD_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            <span className="flex items-center gap-2">
              {fieldTypeIcons[type]}
              <span>{fieldTypeLabels[type]}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { IconCircle, IconPlus, IconSquare, IconX } from "@tabler/icons-react";

import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";
import { Input } from "@amaxa/ui/input";

interface FormQuestionOptionsProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
  type: "select" | "multiselect";
}

interface OptionInputProps {
  value: string;
  index: number;
  isEditing: boolean;
  onUpdate: (index: number, value: string) => void;
  onFocus: (index: number) => void;
  onBlur: (index: number, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number, value: string) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  Icon: typeof IconCircle  ;
  canRemove: boolean;
  onRemove: (index: number) => void;
}

const OptionInput = memo(function OptionInput({
  value: initialValue,
  index,
  isEditing,
  onUpdate,
  onFocus,
  onBlur,
  onKeyDown,
  inputRef,
  Icon,
  canRemove,
  onRemove,
}: OptionInputProps) {
  const [localValue, setLocalValue] = useState(initialValue);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  return (
    <div className="group flex items-center gap-2">
      <Icon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
      <Input
        className={cn(
          "focus-visible:border-primary flex-1 rounded-none border-0 border-b px-0 focus-visible:ring-0",
          isEditing ? "border-primary border-b-2" : "",
        )}
        onBlur={() => {
          onBlur(index, localValue);
        }}
        onChange={(e) => {
          setLocalValue(e.target.value);
        }}
        onFocus={() => onFocus(index)}
        onKeyDown={(e) => onKeyDown(e, index, localValue)}
        placeholder={`Option ${index + 1}`}
        ref={inputRef}
        value={localValue}
      />
      {canRemove && (
        <Button
          className="opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onRemove(index)}
          size="icon-sm"
          title="Remove option"
          type="button"
          variant="ghost"
        >
          <IconX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

export function FormQuestionOptions({
  options,
  onOptionsChange,
  type,
}: FormQuestionOptionsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const OptionIcon = type === "select" ? IconCircle : IconSquare;

  const addOption = useCallback(() => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    onOptionsChange(newOptions);
    setTimeout(() => {
      const newIndex = newOptions.length - 1;
      setEditingIndex(newIndex);
      inputRefs.current[newIndex]?.focus();
      inputRefs.current[newIndex]?.select();
    }, 0);
  }, [options, onOptionsChange]);

  const commitOption = useCallback(
    (index: number, value: string) => {
      if (options[index] !== value) {
        const newOptions = [...options];
        newOptions[index] = value;
        onOptionsChange(newOptions);
      }
    },
    [options, onOptionsChange],
  );

  const removeOption = useCallback(
    (index: number) => {
      if (options.length <= 1) {
        return;
      }
      const newOptions = options.filter((_, i) => i !== index);
      onOptionsChange(newOptions);
    },
    [options, onOptionsChange],
  );

  const handleFocus = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  const handleBlur = useCallback(
    (index: number, value: string) => {
      setEditingIndex(null);
      commitOption(index, value);
    },
    [commitOption],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number, currentValue: string) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitOption(index, currentValue);
        if (index === options.length - 1) {
          addOption();
        } else {
          setEditingIndex(index + 1);
          inputRefs.current[index + 1]?.focus();
        }
      } else if (
        e.key === "Backspace" &&
        currentValue === "" &&
        options.length > 1
      ) {
        e.preventDefault();
        removeOption(index);
        const prevIndex = Math.max(0, index - 1);
        setEditingIndex(prevIndex);
        setTimeout(() => {
          inputRefs.current[prevIndex]?.focus();
        }, 0);
      }
    },
    [options.length, addOption, removeOption, commitOption],
  );

  useEffect(() => {
    if (options.length === 0) {
      onOptionsChange(["Option 1"]);
    }
  }, [options, onOptionsChange]);

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <OptionInput
          Icon={OptionIcon}
          canRemove={options.length > 1}
          index={index}
          inputRef={(el) => {
            inputRefs.current[index] = el;
          }}
          isEditing={editingIndex === index}
          key={index}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onRemove={removeOption}
          onUpdate={commitOption}
          value={option}
        />
      ))}
      <Button
        className="text-muted-foreground hover:text-foreground"
        onClick={addOption}
        size="sm"
        type="button"
        variant="ghost"
      >
        <IconPlus className="mr-1 h-4 w-4" />
        Add option
      </Button>
    </div>
  );
}

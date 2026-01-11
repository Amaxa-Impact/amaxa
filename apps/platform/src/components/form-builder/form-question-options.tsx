"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconCircle, IconPlus, IconSquare, IconX } from "@tabler/icons-react";

import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";
import { Input } from "@amaxa/ui/input";

interface FormQuestionOptionsProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
  type: "select" | "multiselect";
}

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

  const updateOption = useCallback(
    (index: number, value: string) => {
      const newOptions = [...options];
      newOptions[index] = value;
      onOptionsChange(newOptions);
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (index === options.length - 1) {
          addOption();
        } else {
          setEditingIndex(index + 1);
          inputRefs.current[index + 1]?.focus();
        }
      } else if (
        e.key === "Backspace" &&
        options[index] === "" &&
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
    [options, addOption, removeOption],
  );

  useEffect(() => {
    if (options.length === 0) {
      onOptionsChange(["Option 1"]);
    }
  }, [options, onOptionsChange]);

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div className="group flex items-center gap-2" key={index}>
          <OptionIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <Input
            className={cn(
              "focus-visible:border-primary flex-1 rounded-none border-0 border-b px-0 focus-visible:ring-0",
              editingIndex === index ? "border-primary border-b-2" : "",
            )}
            onBlur={() => setEditingIndex(null)}
            onChange={(e) => updateOption(index, e.target.value)}
            onFocus={() => setEditingIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder={`Option ${index + 1}`}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={option}
          />
          {options.length > 1 && (
            <Button
              className="opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => removeOption(index)}
              size="icon-sm"
              title="Remove option"
              type="button"
              variant="ghost"
            >
              <IconX className="h-4 w-4" />
            </Button>
          )}
        </div>
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

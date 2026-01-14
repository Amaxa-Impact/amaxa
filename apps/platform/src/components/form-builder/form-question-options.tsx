"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IconCheck,
  IconCircle,
  IconPlus,
  IconSparkles,
  IconSquare,
  IconX,
} from "@tabler/icons-react";

import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";
import { Input } from "@amaxa/ui/input";

interface FormQuestionOptionsProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
  type: "select" | "multiselect";
  suggestedOptions?: string[];
  onDismissSuggestions?: () => void;
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
  Icon: typeof IconCircle;
  canRemove: boolean;
  onRemove: (index: number) => void;
}

const OptionInput = memo(function OptionInput({
  value: initialValue,
  index,
  isEditing,
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
      <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
      <Input
        className={cn(
          "focus-visible:border-primary flex-1 rounded-none border-0 border-b px-0 focus-visible:ring-0",
          isEditing ? "border-primary border-b-2" : "",
        )}
        onBlur={() => onBlur(index, localValue)}
        onChange={(e) => setLocalValue(e.target.value)}
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
  suggestedOptions,
  onDismissSuggestions,
}: FormQuestionOptionsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const OptionIcon = type === "select" ? IconCircle : IconSquare;

  const availableSuggestions = useMemo(() => {
    return (
      suggestedOptions?.filter(
        (suggestion) =>
          !options.some(
            (opt) => opt.toLowerCase() === suggestion.toLowerCase(),
          ),
      ) ?? []
    );
  }, [suggestedOptions, options]);

  const hasSuggestions =
    !suggestionsDismissed && availableSuggestions.length > 0;

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
      if (options.length <= 1) return;
      onOptionsChange(options.filter((_, i) => i !== index));
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

  const handleAcceptSuggestion = useCallback(
    (suggestion: string) => {
      setSuggestionsDismissed(false);
      if (options.length === 1 && options[0] === "Option 1") {
        onOptionsChange([suggestion]);
      } else {
        onOptionsChange([...options, suggestion]);
      }
    },
    [options, onOptionsChange],
  );

  const handleAcceptAllSuggestions = useCallback(() => {
    setSuggestionsDismissed(true);
    onDismissSuggestions?.();
    if (options.length === 1 && options[0] === "Option 1") {
      onOptionsChange(availableSuggestions);
    } else {
      onOptionsChange([...options, ...availableSuggestions]);
    }
  }, [options, availableSuggestions, onOptionsChange, onDismissSuggestions]);

  const handleDismissSuggestions = useCallback(() => {
    setSuggestionsDismissed(true);
    onDismissSuggestions?.();
  }, [onDismissSuggestions]);

  useEffect(() => {
    if (options.length === 0) {
      onOptionsChange(["Option 1"]);
    }
  }, [options, onOptionsChange]);

  return (
    <div className="space-y-3">
      {hasSuggestions && (
        <div className="rounded-lg border border-dashed border-purple-300 bg-purple-50 p-3 dark:border-purple-700 dark:bg-purple-950/20">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-medium text-purple-700 dark:text-purple-300">
              <IconSparkles className="h-4 w-4" />
              AI Suggested Options
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/30"
                onClick={handleAcceptAllSuggestions}
              >
                <IconCheck className="mr-1 h-3 w-3" />
                Accept All
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/30"
                onClick={handleDismissSuggestions}
                title="Dismiss suggestions"
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAcceptSuggestion(suggestion)}
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-purple-800 shadow-sm transition-colors hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-200 dark:hover:bg-purple-900/50"
              >
                <IconPlus className="h-3 w-3" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
}

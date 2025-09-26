"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  maxDisplay?: number;
  label?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  label,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (optionValue: string) => {
    const newSelected = selected.includes(optionValue)
      ? selected.filter((item) => item !== optionValue)
      : [...selected, optionValue];
    onChange(newSelected);
  };


  const handleSelectAll = () => {
    const allSelected = selected.length === options.length;
    if (allSelected) {
      onChange([]);
    } else {
      onChange(options.map(option => option.value));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            className
          )}
        >
          <div className="flex flex-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <span>
                {label ? `${label}: ` : ''}
                {selected.length === options.length ? '(all)' : `(${selected.length})`}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 text-amber-100" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="border-b p-2">
          <div
            className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={handleSelectAll}
          >
            <Checkbox
              checked={selected.length === options.length}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <span className="flex-1 font-medium">Select All</span>
          </div>
        </div>
        <div className="max-h-64 overflow-auto p-1">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-blue-100 text-blue-500"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleSelect(option.value)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <span className="flex-1">{option.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 font-semibold text-blue-500" />
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
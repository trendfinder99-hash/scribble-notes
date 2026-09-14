"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  swatches: string[];
  label?: string;
  triggerClassName?: string;
}

export function ColorPicker({
  value,
  onChange,
  swatches,
  label,
  triggerClassName,
}: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label ?? "Choose color"}
          className={cn(
            "h-6 w-6 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-black/10 transition hover:scale-110 dark:border-stone-900",
            triggerClassName
          )}
          style={{ backgroundColor: value }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-56">
        {label && (
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            {label}
          </p>
        )}
        <div className="grid grid-cols-6 gap-2">
          {swatches.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={color}
              className={cn(
                "h-7 w-7 rounded-full border-2 border-white shadow transition hover:scale-110 dark:border-stone-700",
                value.toLowerCase() === color.toLowerCase() &&
                  "ring-2 ring-offset-2 ring-stone-900 dark:ring-stone-200"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <label className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-stone-400 text-xs font-bold text-stone-500">
            +
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}

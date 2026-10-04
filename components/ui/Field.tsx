import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-2 min-h-11 w-full rounded-xl border border-rose/20 bg-white/70 px-3.5 py-2.5 text-sm text-bark transition placeholder:text-taupe/70 focus:border-rose";

export function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-cocoa">
      {label}
      {children}
    </label>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function SelectInput({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputClass, className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClass, "min-h-28 resize-y", className)} {...props} />;
}

import React from "react";

export default function FormRow({
  label,
  children,
  labelWidth = "w-[130px]",
}: {
  label: string;
  children: React.ReactNode;
  labelWidth?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
      <label className={`text-sm font-medium whitespace-nowrap ${labelWidth}`}>
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

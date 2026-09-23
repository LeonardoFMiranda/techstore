"use client";

import { ReactNode } from "react";

export function AutoSubmitSelect({
  name,
  defaultValue,
  className,
  style,
  id,
  children,
}: {
  name: string;
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  children: ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className={className}
      style={style}
      id={id}
      onChange={(e) => {
        const form = e.target.closest("form") as HTMLFormElement;
        form?.submit();
      }}
    >
      {children}
    </select>
  );
}

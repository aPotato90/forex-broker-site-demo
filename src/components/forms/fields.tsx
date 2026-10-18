import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FieldShellProps {
  id: string;
  /** Omit when the control renders its own label (e.g. a checkbox). */
  label?: string;
  error?: string;
  hint?: ReactNode;
  children: (describedBy: string | undefined) => ReactNode;
  className?: string;
}

/** Label, control, hint and error wired together with aria-describedby. */
export function FieldShell({ id, label, error, hint, children, className }: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {children(describedBy)}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = Omit<ComponentProps<typeof Input>, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  suffix?: string;
};

export function TextField({ id, label, error, hint, suffix, className, ...props }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      {(describedBy) => (
        <div className="relative">
          <Input
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn("h-11 text-base", suffix && "pr-14")}
            {...props}
          />
          {suffix && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground"
            >
              {suffix}
            </span>
          )}
        </div>
      )}
    </FieldShell>
  );
}

type SelectFieldProps = Omit<ComponentProps<"select">, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  options: readonly { value: string; label: string }[];
};

/** Native select: fully accessible and needs no extra JavaScript. */
export function SelectField({
  id,
  label,
  error,
  hint,
  options,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      {(describedBy) => (
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm dark:bg-input/30"
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number;
  onValueChange: (n: number) => void;
}

const fmt = (n: number) => (n > 0 ? new Intl.NumberFormat("id-ID").format(n) : "");

export const CurrencyInput = React.forwardRef<HTMLInputElement, Props>(
  ({ value, onValueChange, className, ...rest }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={fmt(value)}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          onValueChange(digits ? Number(digits) : 0);
        }}
        className={cn("tabular-nums", className)}
        {...rest}
      />
    );
  },
);
CurrencyInput.displayName = "CurrencyInput";

import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-surface px-3 py-2 text-base shadow-xs transition-[border-color,box-shadow,background-color] duration-150 ease-out placeholder:text-muted-foreground hover:border-accent/60 focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };

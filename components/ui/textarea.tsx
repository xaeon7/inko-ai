import * as React from "react";

import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { type TextareaAutosizeProps } from "react-textarea-autosize";

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        className={cn(
          "flex h-10 w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm ring-offset-neutral-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

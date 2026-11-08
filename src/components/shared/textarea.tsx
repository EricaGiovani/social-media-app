import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "h-32 w-full resize-none overflow-y-auto rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
});
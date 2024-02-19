"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

type SeparatorProps = {
  pageId?: string | undefined;
  isAdmin?: boolean;
};

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps &
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      pageId,
      isAdmin,
      ...props
    },
    ref
  ) =>
    pageId || isAdmin ? (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border bg-orange-700 mt-4",
          orientation === "horizontal" ? "h-[2px] w-full" : "h-full w-[1px] ",
          className
        )}
        {...props}
      />
    ) : null
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

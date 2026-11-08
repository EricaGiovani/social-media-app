"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function SafeImage({ className, alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return (
      <div
        role="img"
        aria-label={alt || "Image not available"}
        className="flex h-full w-full items-center justify-center bg-gray-900 text-xs text-muted-foreground"
      >
        Image not available
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={cn(className)}
      onError={() => setFailed(true)}
    />
  );
}
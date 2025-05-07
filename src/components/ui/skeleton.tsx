
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Helper component for lazy loaded images
function LazyImage({
  src, 
  alt, 
  className,
  loadingPriority = "lazy"
}: {
  src: string;
  alt: string;
  className?: string;
  loadingPriority?: "lazy" | "eager";
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="relative w-full h-full">
      {!isLoaded && !error && <Skeleton className="absolute inset-0 w-full h-full" />}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <span>Failed to load image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loadingPriority}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

import { useState } from "react";
export { Skeleton, LazyImage };

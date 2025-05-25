"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PlaceholderImage } from "./PlaceholderImage";

interface SmartImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  showLoadingState?: boolean;
  blurhash?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholderType?: "profile" | "project" | "certificate";
  placeholderText?: string;
}

export function SmartImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  showLoadingState = true,
  blurhash,
  onLoad,
  onError,
  placeholderType,
  placeholderText,
}: SmartImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();

    // Fallback para placeholder
    setImageSrc(`/api/placeholder/${width}/${height}?type=${placeholderType ?? "default"}&text=${encodeURIComponent(placeholderText ?? alt)}`);
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence>
        {isLoading && showLoadingState && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-800 animate-pulse"
          >
            {blurhash && (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${blurhash})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(20px)",
                  transform: "scale(1.2)",
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {hasError ? (
        <PlaceholderImage
          width={width}
          height={height}
          text={placeholderText ?? alt}
          type={placeholderType}
          className={className}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${className}`}
          priority={priority}
          onLoadingComplete={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

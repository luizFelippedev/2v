"use client";
import React, { useState } from "react";
import Image from "next/image";
import { User, Image as ImageIcon } from "lucide-react"; // Corrija aqui

interface PlaceholderImageProps {
  width: number;
  height: number;
  className?: string;
  alt?: string;
  type?: "profile" | "project" | "certificate" | "general";
  text?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  showDimensions?: boolean;
  bgColor?: string;
  textColor?: string;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width,
  height,
  className = "",
  alt = "Placeholder",
  type = "general",
  text,
  borderRadius = "md",
  showDimensions = true,
  bgColor = "#1e293b",
  textColor = "#94a3b8",
}) => {
  const [useExternal, setUseExternal] = useState(true);
  const [imageError, setImageError] = useState(false);

  const borderRadiusClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const getGradientColors = () => {
    switch (type) {
      case "profile":
        return "from-blue-500 to-purple-500";
      case "project":
        return "from-green-500 to-blue-500";
      case "certificate":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "profile":
        return <User className="w-8 h-8 text-white" />;
      case "project":
      case "certificate":
      case "general":
      default:
        return <ImageIcon className="w-8 h-8 text-white" />;
    }
  };

  const displayText = text || (showDimensions ? `${width} × ${height}` : "");

  // Tentar usar serviço externo primeiro
  if (useExternal && !imageError) {
    const externalUrl =
      type === "profile"
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
            displayText,
          )}&size=${width}&background=60a5fa&color=ffffff&rounded=${
            borderRadius === "full"
          }`
        : `https://picsum.photos/${width}/${height}?random=${type}`;

    return (
      <img
        src={externalUrl}
        alt={alt}
        width={width}
        height={height}
        className={`${borderRadiusClasses[borderRadius]} ${className}`}
        onError={() => {
          setImageError(true);
          setUseExternal(false);
        }}
        loading="lazy"
      />
    );
  }

  // Fallback para SVG gerado
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="${textColor}" stroke-width="2"/>
      <text x="50%" y="50%" font-family="ui-sans-serif, system-ui" font-size="16" fill="${textColor}" text-anchor="middle" dy=".3em">
        ${displayText}
      </text>
    </svg>
  `;

  const svgUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return (
    <Image
      src={svgUrl}
      alt={displayText}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};

// Hook para gerar URL de placeholder
export const usePlaceholderImage = (
  width: number,
  height: number,
  type: "profile" | "project" | "general" = "general",
) => {
  const getPlaceholderUrl = () => {
    switch (type) {
      case "profile":
        return `https://ui-avatars.com/api/?name=User&size=${width}&background=60a5fa&color=ffffff&rounded=true`;
      case "project":
        return `https://picsum.photos/${width}/${height}?random=project`;
      default:
        return `https://picsum.photos/${width}/${height}?random=general`;
    }
  };

  return {
    src: getPlaceholderUrl(),
    fallback: `/api/placeholder/${width}/${height}`,
  };
};

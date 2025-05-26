// src/components/common/NoSSR.tsx
"use client";
import dynamic from 'next/dynamic';
import React from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const NoSSRWrapper: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
  return <>{children}</>;
};

export const NoSSR = dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
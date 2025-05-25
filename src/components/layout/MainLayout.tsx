"use client";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Analytics, PWAManager, SEO } from "@/components/common";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  noIndex?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  description,
  noIndex,
}) => {
  return (
    <>
      <SEO title={title} description={description} noindex={noIndex} />
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <Footer />
      <Analytics />
      <PWAManager />
    </>
  );
};

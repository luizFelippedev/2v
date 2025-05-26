// src/components/layout/Navbar.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Award,
  Mail,
  Code,
  Shield,
  LogIn,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { state: authState } = useAuth();

  const navItems = [
    { name: "Início", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Sobre", href: "/about", icon: <User className="w-4 h-4" /> },
    { name: "Projetos", href: "/projects", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Skills", href: "/skills", icon: <Code className="w-4 h-4" /> },
    { name: "Certificados", href: "/certificates", icon: <Award className="w-4 h-4" /> },
    { name: "Contato", href: "/contact", icon: <Mail className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-white font-bold text-xl">
                Luiz Felippe
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-primary-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-500/20 border border-primary-500/30 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Admin Access */}
            {authState.isAuthenticated ? (
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg text-white font-medium hover:from-primary-700 hover:to-secondary-700 transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 border border-primary-500 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg text-white font-medium hover:from-primary-700 hover:to-secondary-700 transition-all"
              >
                Fale Comigo
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pb-4 border-t border-white/10"
            >
              <div className="pt-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.href)
                        ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Mobile Admin Link */}
                <div className="pt-4 border-t border-white/10">
                  {authState.isAuthenticated ? (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg text-white"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Painel Admin</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-4 py-3 border border-primary-500 rounded-lg text-primary-400"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login Admin</span>
                    </Link>
                  )}
                </div>

                {/* Mobile CTA */}
                <div className="pt-2">
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg text-white font-medium"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Fale Comigo
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};
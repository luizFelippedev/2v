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
  LogIn,
  Settings,
  Search,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts";
import { ThemeSelector } from "@/components/common";
import { GlobalSearch } from "@/components/common";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { state: authState } = useAuth();

  const navItems = [
    { 
      name: "Início", 
      href: "/", 
      icon: <Home className="w-4 h-4" />,
      description: "Página inicial"
    },
    { 
      name: "Sobre", 
      href: "/about", 
      icon: <User className="w-4 h-4" />,
      description: "Minha história"
    },
    { 
      name: "Projetos", 
      href: "/projects", 
      icon: <Briefcase className="w-4 h-4" />,
      description: "Meus trabalhos"
    },
    { 
      name: "Skills", 
      href: "/skills", 
      icon: <Code className="w-4 h-4" />,
      description: "Habilidades técnicas"
    },
    { 
      name: "Certificados", 
      href: "/certificates", 
      icon: <Award className="w-4 h-4" />,
      description: "Certificações"
    },
    { 
      name: "Contato", 
      href: "/contact", 
      icon: <Mail className="w-4 h-4" />,
      description: "Entre em contato"
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
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
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <Link href="/" className="flex items-center space-x-3">
                <motion.div 
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-50 -z-10" />
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-white font-bold text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    Luiz Felippe
                  </span>
                  <div className="text-gray-400 text-sm">Full Stack Developer</div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                      isActive(item.href)
                        ? "text-primary-400"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      {item.icon}
                      <span>{item.name}</span>
                    </span>
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-500/20 border border-primary-500/30 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                  
                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                  >
                    {item.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/10" />
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Global Search */}
              <GlobalSearch />

              {/* Admin Access */}
              {authState.isAuthenticated ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 px-4 py-2 border border-primary-500 rounded-xl text-primary-400 hover:bg-primary-500/10 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                </motion.div>
              )}

              {/* CTA Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg"
                >
                  Fale Comigo
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3 lg:hidden">
              {/* Search Button Mobile */}
              <GlobalSearch />
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
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
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                          isActive(item.href)
                            ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.icon}
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-400">{item.description}</div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile Admin Link */}
                  <div className="pt-4 border-t border-white/10">
                    {authState.isAuthenticated ? (
                      <Link
                        href="/admin"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Painel Admin</span>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 px-4 py-3 border border-primary-500 rounded-xl text-primary-400"
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
                      className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium"
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

      {/* ThemeSelector - Posicionado fixo */}
      <ThemeSelector />
    </>
  );
};
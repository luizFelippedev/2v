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
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts";
import { ThemeSelector } from "@/components/common";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { state: authState } = useAuth();

  const navItems = [
    { name: "Início", href: "/", icon: Home, description: "Página inicial" },
    { name: "Sobre", href: "/about", icon: User, description: "Minha história" },
    { name: "Projetos", href: "/projects", icon: Briefcase, description: "Meus trabalhos" },
    { name: "Skills", href: "/skills", icon: Code, description: "Habilidades técnicas" },
    { name: "Certificados", href: "/certificates", icon: Award, description: "Certificações" },
    { name: "Contato", href: "/contact", icon: Mail, description: "Entre em contato" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMenu = () => setIsOpen(false);

  // Variantes para animações do Framer Motion
  const menuVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <motion.div
                className="relative flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full blur opacity-40 -z-10 group-hover:opacity-60 transition-opacity duration-300" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-white font-extrabold text-lg sm:text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Luiz Felippe
                </span>
                <div className="text-gray-400 text-xs sm:text-sm">Eng. Software</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={`relative px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium ${
                        isActive(item.href)
                          ? "text-primary-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center space-x-2 relative z-10">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </span>
                      {isActive(item.href) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary-500/20 border border-primary-500/30 rounded-lg"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>

                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                      <div className="px-3 py-2 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg border border-white/10 relative shadow-lg">
                        {item.description}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/10" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ações Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {authState.isAuthenticated ? (
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white text-sm hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 border border-primary-500 rounded-xl text-primary-400 text-sm hover:bg-primary-500/10 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/contact"
                className="px-5 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium text-sm hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md hover:shadow-lg"
              >
                Fale Comigo
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-3 lg:hidden">
              <ThemeSelector /> {/* Moved ThemeSelector here for mobile */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
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

          {/* Mobile Nav */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                className="lg:hidden mt-4 pb-4 border-t border-white/10 bg-black/80 backdrop-blur-md rounded-b-lg shadow-xl"
              >
                <div className="pt-4 space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.name}
                        variants={itemVariants}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-base font-medium ${
                            isActive(item.href)
                              ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <div>{item.name}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}

                  <div className="pt-4 border-t border-white/10 mx-4">
                    {authState.isAuthenticated ? (
                      <Link
                        href="/admin"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white text-base font-medium transition-all hover:from-green-700 hover:to-emerald-700"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Painel Admin</span>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 px-4 py-3 border border-primary-500 rounded-lg text-primary-400 text-base font-medium transition-all hover:bg-primary-500/10"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Login Admin</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-2 mx-4">
                    <Link
                      href="/contact"
                      onClick={closeMenu}
                      className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg text-white font-medium text-base transition-all hover:from-primary-700 hover:to-secondary-700"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Fale Comigo
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      <div className="hidden lg:block"> {/* ThemeSelector for desktop */}
        <ThemeSelector />
      </div>
    </>
  );
};
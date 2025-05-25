"use client";
import React from "react";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Termos e Condições
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">
              Última atualização: {new Date().toLocaleDateString()}
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">1. Termos</h2>
              <p className="text-gray-300">
                Ao acessar este website, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
              </p>
            </section>

            {/* Adicione mais seções conforme necessário */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

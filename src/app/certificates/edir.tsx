"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CertificateForm {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
}

export default function EditCertificatePage() {
  const [form, setForm] = useState<CertificateForm>({
    title: "",
    issuer: "",
    date: "",
    credentialId: "",
    url: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simular envio
    await new Promise((res) => setTimeout(res, 1000));
    setIsSaving(false);
    alert("Certificado salvo!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl"
      >
        <div className="flex items-center mb-8">
          <Link href="/certificates" className="mr-4 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Award className="w-8 h-8 text-primary-400 mr-2" />
          <h1 className="text-2xl font-bold text-white">Editar Certificado</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: AWS Certified Solutions Architect"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Emissor
            </label>
            <input
              type="text"
              name="issuer"
              value={form.issuer}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Amazon Web Services"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data de Emissão
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ID do Certificado
            </label>
            <input
              type="text"
              name="credentialId"
              value={form.credentialId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: ABCD-1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL de Verificação
            </label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://..."
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl font-semibold text-white text-lg mt-4 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Salvando..." : "Salvar"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCertificatePage() {
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    credentialId: "",
    issueDate: "",
    expiryDate: "",
    category: "",
    description: "",
    credentialUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de salvamento
    console.log(formData);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/certificates"
          className="inline-flex items-center text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Certificados
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Novo Certificado</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campos do formulário */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título do Certificado
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emissor
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID da Credencial
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL da Credencial
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.credentialUrl}
                onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de Emissão
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de Expiração
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/admin/certificates">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex items-center px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Certificado
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

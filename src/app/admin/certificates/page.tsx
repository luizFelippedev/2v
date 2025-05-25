"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Award, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data
  const certificates = [
    {
      id: "1",
      title: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "2024-01-15",
      expiryDate: "2027-01-15",
      status: "active",
      credentialId: "ABC123",
      category: "cloud",
    },
    // ...more certificates
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Certificados</h1>
        <Link href="/admin/certificates/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Certificado
          </motion.button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar certificados..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Certificates List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="min-w-full divide-y divide-gray-700">
          <div className="bg-gray-900 px-6 py-3">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-2">Certificado</div>
              <div>Emissor</div>
              <div>Data de Emissão</div>
              <div>Status</div>
              <div className="text-right">Ações</div>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-4 hover:bg-gray-700/50"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-2 flex items-center">
                    <Award className="w-5 h-5 text-primary-400 mr-3" />
                    <div>
                      <div className="font-medium text-white">{cert.title}</div>
                      <div className="text-sm text-gray-400">ID: {cert.credentialId}</div>
                    </div>
                  </div>
                  <div className="text-gray-300">{cert.issuer}</div>
                  <div className="text-gray-300">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                      {cert.status}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

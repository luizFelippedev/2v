import { Loader } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-16 h-16 animate-spin text-primary-500 mx-auto mb-4" />
        <p className="text-white text-lg animate-pulse">Carregando...</p>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, Clock, AlertTriangle } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";

function formatTime(value?: number) {
  if (value === undefined) return "--";
  if (value > 1000) return `${(value / 1000).toFixed(2)}s`;
  return `${Math.round(value)}ms`;
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Excelente";
  if (score >= 70) return "Bom";
  return "Atenção";
}

export const PerformanceMonitor: React.FC = () => {
  const metrics = usePerformance();
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Exibir apenas em desenvolvimento ou se explicitamente habilitado
  const shouldShow =
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" &&
      localStorage.getItem("performance-monitor") === "true");

  if (!shouldShow) return null;

  // Score simples baseado em métricas
  const performanceScore =
    100 -
    ((metrics.lcp && metrics.lcp > 2500 ? 20 : 0) +
      (metrics.fid && metrics.fid > 100 ? 20 : 0) +
      (metrics.cls && metrics.cls > 0.1 ? 20 : 0));

  return (
    <>
      {/* Performance Badge */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowDebugInfo(!showDebugInfo)}
        className="fixed bottom-4 left-4 z-50 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 p-3 text-white hover:bg-white/10 transition-all"
        title="Performance Monitor"
      >
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span className={`text-xs font-bold ${getScoreColor(performanceScore)}`}>
            {performanceScore}
          </span>
        </div>
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {showDebugInfo && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed bottom-20 left-4 z-50 w-80 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Performance Monitor
              </h3>
              <button
                onClick={() => setShowDebugInfo(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Core Web Vitals */}
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-gray-300">
                Core Web Vitals
              </h4>
              {metrics.lcp !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-2 text-blue-400" />
                    <span>LCP</span>
                  </div>
                  <span
                    className={
                      metrics.lcp > 2500 ? "text-red-400" : "text-green-400"
                    }
                  >
                    {formatTime(metrics.lcp)}
                  </span>
                </div>
              )}
              {metrics.fid !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-2 text-yellow-400" />
                    <span>FID</span>
                  </div>
                  <span
                    className={
                      metrics.fid > 100 ? "text-red-400" : "text-green-400"
                    }
                  >
                    {formatTime(metrics.fid)}
                  </span>
                </div>
              )}
              {metrics.cls !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-2 text-purple-400" />
                    <span>CLS</span>
                  </div>
                  <span
                    className={
                      metrics.cls > 0.1 ? "text-red-400" : "text-green-400"
                    }
                  >
                    {metrics.cls.toFixed(3)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

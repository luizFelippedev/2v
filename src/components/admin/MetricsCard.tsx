import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricData {
  value: number;
  previousValue: number;
  label: string;
  type: 'currency' | 'number' | 'percentage';
  color?: string;
}

export const MetricsCard: React.FC<{ data: MetricData }> = ({ data }) => {
  const [currentValue, setCurrentValue] = useState(data.value);
  const percentageChange = ((data.value - data.previousValue) / data.previousValue) * 100;
  const isPositive = percentageChange > 0;

  useEffect(() => {
    // Animação suave do valor
    const duration = 1000;
    const steps = 60;
    const stepValue = (data.value - currentValue) / steps;
    let current = currentValue;

    const interval = setInterval(() => {
      if (Math.abs(current - data.value) < Math.abs(stepValue)) {
        setCurrentValue(data.value);
        clearInterval(interval);
      } else {
        current += stepValue;
        setCurrentValue(current);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [data.value]);

  const formatValue = (value: number) => {
    switch (data.type) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('pt-BR');
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative overflow-hidden"
    >
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentValue}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-3xl font-bold mb-2"
            style={{ color: data.color || 'white' }}
          >
            {formatValue(currentValue)}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{data.label}</span>
          <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span className="text-sm">{Math.abs(percentageChange).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(45deg, ${data.color || '#3b82f6'}, transparent)`,
          filter: 'blur(40px)'
        }}
      />
    </motion.div>
  );
};

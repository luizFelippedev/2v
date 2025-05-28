"use client";

import React from 'react';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  register,
  errors,
  disabled = false
}) => {
  const error = errors?.[name];
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 bg-white/5 border rounded-xl 
              text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : 'border-white/10'}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
            rows={4}
          />
        ) : (
          <input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 bg-white/5 border rounded-xl 
              text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : 'border-white/10'}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
          />
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-1 mt-1 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error?.message as string}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FormField;

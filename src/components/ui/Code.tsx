import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface CodeProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const Code: React.FC<CodeProps> = ({
  code,
  language = 'typescript',
  showLineNumbers = true,
  className = '',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre
        className={clsx(
          'p-4 rounded-xl bg-black/20 backdrop-blur-xl border border-white/10',
          showLineNumbers && 'pl-12',
          className
        )}
      >
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center pt-4 text-gray-500 text-sm border-r border-white/10 select-none">
            {code.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <code className="text-gray-300 text-sm font-mono">{code}</code>
      </pre>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </motion.button>
    </div>
  );
};

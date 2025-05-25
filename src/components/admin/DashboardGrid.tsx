import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Settings, Maximize2, Minimize2 } from 'lucide-react';

interface GridItem {
  id: string;
  title: string;
  type: "metric" | "chart" | "list" | "custom";
  size: "small" | "medium" | "large";
  component: React.ReactNode;
}

export const DashboardGrid: React.FC<{ initialItems: GridItem[] }> = ({ initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-4">
      <Reorder.Group 
        axis="y" 
        values={items} 
        onReorder={setItems}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {items.map((item) => (
          <Reorder.Item 
            key={item.id} 
            value={item}
            className={`
              relative 
              ${expandedId === item.id ? 'col-span-full' : ''}
              ${item.size === 'large' ? 'col-span-2' : ''}
            `}
          >
            <motion.div
              layout
              className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full"
              animate={{
                scale: expandedId === item.id ? 1 : 0.95,
                zIndex: expandedId === item.id ? 10 : 0
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleExpand(item.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {expandedId === item.id ? (
                      <Minimize2 className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <motion.div
                layout
                className="relative"
                animate={{
                  height: expandedId === item.id ? 'auto' : '100%'
                }}
              >
                {item.component}
              </motion.div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

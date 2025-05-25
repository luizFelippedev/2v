import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Star, Edit, Trash, Eye } from 'lucide-react';

interface Activity {
  id: string;
  type: 'view' | 'edit' | 'delete' | 'create' | 'like';
  user: {
    name: string;
    avatar: string;
  };
  target: string;
  timestamp: Date;
}

export const ActivityStream: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Simulação de atividades em tempo real
  useEffect(() => {
    const types = ['view', 'edit', 'delete', 'create', 'like'] as const;
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        type: types[Math.floor(Math.random() * types.length)],
        user: {
          name: 'Usuário ' + Math.floor(Math.random() * 100),
          avatar: '/api/placeholder/40/40'
        },
        target: 'Item ' + Math.floor(Math.random() * 100),
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'edit': return <Edit className="w-4 h-4" />;
      case 'delete': return <Trash className="w-4 h-4" />;
      case 'create': return <User className="w-4 h-4" />;
      case 'like': return <Star className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'view': return 'bg-blue-500/20 text-blue-400';
      case 'edit': return 'bg-yellow-500/20 text-yellow-400';
      case 'delete': return 'bg-red-500/20 text-red-400';
      case 'create': return 'bg-green-500/20 text-green-400';
      case 'like': return 'bg-purple-500/20 text-purple-400';
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Atividades Recentes</h3>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center space-x-4"
            >
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-8 h-8 rounded-full"
              />
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-white">
                    {activity.user.name}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                    <span>{activity.type}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {activity.target}
                </p>
              </div>

              <time className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </time>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

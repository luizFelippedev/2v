// src/components/admin/DashboardGrid.tsx
"use client";
import React from "react";

interface DashboardItem {
  id: string;
  title: string;
  type: "metric" | "list";
  size: "small" | "large";
  component: React.ReactNode;
}

interface DashboardGridProps {
  initialItems: DashboardItem[];
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ initialItems }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {initialItems.map((item) => (
        <div
          key={item.id}
          className={`bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 ${
            item.size === "large" ? "lg:col-span-2" : "lg:col-span-1"
          }`}
        >
          <h3 className="text-lg font-semibold text-white mb-4">{item.title}</h3>
          {item.component}
        </div>
      ))}
    </div>
  );
};

// src/components/admin/MetricsCard.tsx
interface MetricsData {
  value: number;
  previousValue: number;
  label: string;
  type: "number";
  color: string;
}

interface MetricsCardProps {
  data: MetricsData;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ data }) => {
  const change = ((data.value - data.previousValue) / data.previousValue) * 100;
  const isPositive = change >= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">
          {data.value.toLocaleString()}
        </span>
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}{change.toFixed(1)}%
        </span>
      </div>
      <p className="text-gray-400 text-sm">{data.label}</p>
    </div>
  );
};

// src/components/admin/ActivityStream.tsx
export const ActivityStream: React.FC = () => {
  const activities = [
    {
      type: "project",
      title: "Novo projeto criado",
      time: "2 horas atrás",
      user: "Admin",
    },
    {
      type: "certificate",
      title: "Certificado adicionado",
      time: "1 dia atrás",
      user: "Admin",
    },
    {
      type: "view",
      title: "50 novas visualizações",
      time: "2 dias atrás",
      user: "Sistema",
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl">
          <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{activity.title}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
              <span>{activity.user}</span>
              <span>•</span>
              <span>{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
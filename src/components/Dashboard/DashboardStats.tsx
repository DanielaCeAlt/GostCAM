// =============================================
// COMPONENTE: TARJETAS DE ESTADÍSTICAS REUTILIZABLES
// =============================================

'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  iconBgColor: string;
  iconColor?: string;
}

export function StatCard({ title, value, icon, iconBgColor, iconColor = 'text-white' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${iconBgColor} rounded-md flex items-center justify-center`}>
            <i className={`fas ${icon} ${iconColor} text-sm`}></i>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: number | string;
  icon: string;
  iconColor: string;
}

export function InfoCard({ title, value, icon, iconColor }: InfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
        </div>
        <i className={`fas ${icon} ${iconColor} text-2xl`}></i>
      </div>
    </div>
  );
}

interface DetailCardProps {
  icon: string;
  iconColor: string;
  value: string;
  label: string;
}

export function DetailCard({ icon, iconColor, value, label }: DetailCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
        <i className={`fas ${icon} ${iconColor} text-xl`}></i>
      </div>
    </div>
  );
}

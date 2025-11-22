// Stub temporal para MultiStepForm
'use client';
import React from 'react';

export interface MultiStepFormProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function MultiStepForm(props: MultiStepFormProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center py-8">
        <p className="text-gray-600">MultiStepForm temporalmente deshabilitado</p>
      </div>
    </div>
  );
}
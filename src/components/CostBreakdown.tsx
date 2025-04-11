import React from 'react';
import { CostBreakdown as CostBreakdownType } from '../types';
import { MATERIALS, LABOR } from '../data/constants';

interface CostBreakdownProps {
  breakdown: CostBreakdownType;
}

export default function CostBreakdown({ breakdown }: CostBreakdownProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Materials Breakdown</h3>
        <div className="bg-gray-700/50 overflow-hidden rounded-lg border border-gray-600">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Unit Cost</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {Object.entries(breakdown.materials).map(([materialId, details]) => {
                const material = MATERIALS.find(m => m.id === materialId);
                return (
                  <tr key={materialId} className="hover:bg-gray-700/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{material?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      {details.quantity} {material?.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      ${details.unitCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 text-right font-medium">
                      ${details.totalCost.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Labor Breakdown</h3>
        <div className="bg-gray-700/50 overflow-hidden rounded-lg border border-gray-600">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Rate/Hour</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {Object.entries(breakdown.labor).map(([laborId, details]) => {
                const labor = LABOR.find(l => l.id === laborId);
                return (
                  <tr key={laborId} className="hover:bg-gray-700/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{labor?.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">{details.hours}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      ${details.hourlyRate.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 text-right font-medium">
                      ${details.totalCost.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Total Materials Cost:</span>
            <span className="font-medium text-gray-100">${breakdown.totalMaterialCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total Labor Cost:</span>
            <span className="font-medium text-gray-100">${breakdown.totalLaborCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Overhead (15%):</span>
            <span className="font-medium text-gray-100">${breakdown.overhead.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-600">
            <span className="text-lg font-medium text-gray-100">Total Project Cost:</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ${breakdown.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
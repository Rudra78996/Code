import React, { useState, useEffect } from 'react';
import { Building2, Clock, Ruler } from 'lucide-react';
import { MATERIALS, LABOR } from '../data/constants';
import { ProjectDetails } from '../types';

interface ProjectFormProps {
  onSubmit: (data: ProjectDetails) => void;
  initialValues?: ProjectDetails;
}

export default function ProjectForm({ onSubmit, initialValues }: ProjectFormProps) {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    projectName: '',
    length: 0,
    width: 0,
    height: 0,
    materials: [],
    labor: [],
  });

  useEffect(() => {
    if (initialValues) {
      setProjectDetails(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(projectDetails);
  };

  const handleMaterialChange = (materialId: string, quantity: number) => {
    setProjectDetails(prev => ({
      ...prev,
      materials: [
        ...prev.materials.filter(m => m.materialId !== materialId),
        { materialId, quantity },
      ],
    }));
  };

  const handleLaborChange = (laborId: string, hours: number) => {
    setProjectDetails(prev => ({
      ...prev,
      labor: [
        ...prev.labor.filter(l => l.laborId !== laborId),
        { laborId, hours },
      ],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Project Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
            value={projectDetails.projectName}
            onChange={e => setProjectDetails(prev => ({ ...prev, projectName: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              <span className="flex items-center gap-2">
                <Ruler size={16} className="text-blue-400" />
                Length (m)
              </span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
              value={projectDetails.length || ''}
              onChange={e => setProjectDetails(prev => ({ ...prev, length: parseFloat(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              <span className="flex items-center gap-2">
                <Ruler size={16} className="text-blue-400" />
                Width (m)
              </span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
              value={projectDetails.width || ''}
              onChange={e => setProjectDetails(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              <span className="flex items-center gap-2">
                <Building2 size={16} className="text-blue-400" />
                Height (m)
              </span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
              value={projectDetails.height || ''}
              onChange={e => setProjectDetails(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-100 mb-4">Materials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MATERIALS.map(material => (
              <div key={material.id} className="flex items-center space-x-4 bg-gray-700/50 p-4 rounded-lg">
                <label className="flex-1 text-sm font-medium text-gray-300">{material.name} ({material.unit})</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-32 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  value={projectDetails.materials.find(m => m.materialId === material.id)?.quantity || ''}
                  onChange={e => handleMaterialChange(material.id, parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-100 mb-4">
            <span className="flex items-center gap-2">
              <Clock size={20} className="text-blue-400" />
              Labor Hours
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LABOR.map(labor => (
              <div key={labor.id} className="flex items-center space-x-4 bg-gray-700/50 p-4 rounded-lg">
                <label className="flex-1 text-sm font-medium text-gray-300">{labor.role}</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="w-32 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  value={projectDetails.labor.find(l => l.laborId === labor.id)?.hours || ''}
                  onChange={e => handleLaborChange(labor.id, parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transform transition-all duration-200 hover:scale-105"
        >
          Calculate Costs
        </button>
      </div>
    </form>
  );
}
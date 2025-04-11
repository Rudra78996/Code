import React, { useState, useEffect } from 'react';
import { Building2, Clock, Ruler, Plus, Trash2 } from 'lucide-react';
import { MATERIALS, LABOR } from '../data/constants';
import { ProjectDetails, ProjectMaterial, ProjectLabor } from '../types';

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

  const addMaterial = () => {
    setProjectDetails(prev => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          id: crypto.randomUUID(),
          name: '',
          unit: '',
          costPerUnit: 0,
          quantity: 0,
          description: '',
        },
      ],
    }));
  };

  const removeMaterial = (id: string) => {
    setProjectDetails(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== id),
    }));
  };

  const updateMaterial = (id: string, field: keyof ProjectMaterial, value: any) => {
    setProjectDetails(prev => ({
      ...prev,
      materials: prev.materials.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  const addLabor = () => {
    setProjectDetails(prev => ({
      ...prev,
      labor: [
        ...prev.labor,
        {
          id: crypto.randomUUID(),
          role: '',
          costPerHour: 0,
          hours: 0,
          description: '',
        },
      ],
    }));
  };

  const removeLabor = (id: string) => {
    setProjectDetails(prev => ({
      ...prev,
      labor: prev.labor.filter(l => l.id !== id),
    }));
  };

  const updateLabor = (id: string, field: keyof ProjectLabor, value: any) => {
    setProjectDetails(prev => ({
      ...prev,
      labor: prev.labor.map(l =>
        l.id === id ? { ...l, [field]: value } : l
      ),
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-100">Materials</h3>
            <button
              type="button"
              onClick={addMaterial}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Material
            </button>
          </div>
          <div className="space-y-4">
            {projectDetails.materials.map(material => (
              <div key={material.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-700/50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    value={material.name}
                    onChange={e => updateMaterial(material.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Unit</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    value={material.unit}
                    onChange={e => updateMaterial(material.id, 'unit', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Cost/Unit</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    value={material.costPerUnit || ''}
                    onChange={e => updateMaterial(material.id, 'costPerUnit', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    value={material.quantity || ''}
                    onChange={e => updateMaterial(material.id, 'quantity', parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                      value={material.description || ''}
                      onChange={e => updateMaterial(material.id, 'description', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMaterial(material.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-100">
              <span className="flex items-center gap-2">
                <Clock size={20} className="text-blue-400" />
                Labor
              </span>
            </h3>
            <button
              type="button"
              onClick={addLabor}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Labor
            </button>
          </div>
          <div className="space-y-4">
            {projectDetails.labor.map(labor => (
              <div key={labor.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-700/50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Role</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    value={labor.role}
                    onChange={e => updateLabor(labor.id, 'role', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Cost/Hour</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    value={labor.costPerHour || ''}
                    onChange={e => updateLabor(labor.id, 'costPerHour', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Hours</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    value={labor.hours || ''}
                    onChange={e => updateLabor(labor.id, 'hours', parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                      value={labor.description || ''}
                      onChange={e => updateLabor(labor.id, 'description', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLabor(labor.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
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
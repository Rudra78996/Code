import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SavedProject } from '../types';
import { Clock, Building2 } from 'lucide-react';

interface ProjectHistoryProps {
  onProjectSelect: (project: SavedProject) => void;
}

export default function ProjectHistory({ onProjectSelect }: ProjectHistoryProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400">
        No previous projects found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => onProjectSelect(project)}
        >
          <h3 className="text-lg font-medium text-gray-100 mb-2">{project.name}</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Building2 size={16} />
              <span>
                {project.dimensions.length}m × {project.dimensions.width}m × {project.dimensions.height}m
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="text-blue-400 font-medium">
              Total Cost: ${project.total_cost.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
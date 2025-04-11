import React, { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { ProjectDetails } from '../types';
import { MATERIALS, LABOR } from '../data/constants';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AICostEstimatorProps {
  onEstimationComplete: (details: ProjectDetails) => void;
}

export default function AICostEstimator({ onEstimationComplete }: AICostEstimatorProps) {
  const [projectDescription, setProjectDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeProject = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Initialize Gemini API with the correct environment variable access
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key not found');
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Create the prompt with context about available materials and labor
      const prompt = `
        As a construction cost estimation expert, analyze this project description and provide estimates.
        Available materials: ${MATERIALS.map(m => `${m.name} (${m.unit})`).join(', ')}
        Available labor roles: ${LABOR.map(l => l.role).join(', ')}

        Project description: ${projectDescription}

        Provide a JSON response in this exact format:
        {
          "projectName": "string",
          "length": number,
          "width": number,
          "height": number,
          "materials": [{ "materialId": "string", "quantity": number }],
          "labor": [{ "laborId": "string", "hours": number }]
        }
      `;

      // Generate response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const estimation = JSON.parse(text);

      // Validate the estimation data
      if (!validateEstimation(estimation)) {
        throw new Error('Invalid estimation format received');
      }

      onEstimationComplete(estimation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze project. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate the estimation data matches our ProjectDetails type
  const validateEstimation = (data: any): data is ProjectDetails => {
    return (
      typeof data.projectName === 'string' &&
      typeof data.length === 'number' &&
      typeof data.width === 'number' &&
      typeof data.height === 'number' &&
      Array.isArray(data.materials) &&
      data.materials.every((m: any) => 
        typeof m.materialId === 'string' && 
        typeof m.quantity === 'number' &&
        MATERIALS.some(mat => mat.id === m.materialId)
      ) &&
      Array.isArray(data.labor) &&
      data.labor.every((l: any) => 
        typeof l.laborId === 'string' && 
        typeof l.hours === 'number' &&
        LABOR.some(lab => lab.id === l.laborId)
      )
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Describe Your Project
        </label>
        <textarea
          className="w-full h-32 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
          placeholder="Describe your construction project in detail (e.g., I want to build a two-story house with 3 bedrooms, 2 bathrooms, a kitchen, and a living room...)"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      <button
        onClick={analyzeProject}
        disabled={isLoading || !projectDescription.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Analyzing Project...
          </>
        ) : (
          <>
            <MessageSquare size={20} />
            Get AI Estimation
          </>
        )}
      </button>
    </div>
  );
} 
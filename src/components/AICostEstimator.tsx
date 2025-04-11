import React, { useState } from 'react';
import { MessageSquare, Loader2, Building2, Ruler, Package, Users } from 'lucide-react';
import { ProjectDetails } from '../types';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AICostEstimatorProps {
  onEstimationComplete: (details: ProjectDetails) => void;
}
function extractAndParseJSON(str: string) {
  // Match the JSON block between the first '{' and the last '}'
  const jsonMatch = str.match(/{[\s\S]*}/);
  if (!jsonMatch) {
    throw new Error("JSON object not found.");
  }

  // Clean up the JSON string:
  let cleaned = jsonMatch[0]
    .replace(/\/\/.*$/gm, '') // Remove inline comments
    .replace(/,\s*}/g, '}')   // Remove trailing commas before }
    .replace(/,\s*]/g, ']');  // Remove trailing commas before ]

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parsing failed:", err instanceof Error ? err.message : 'Unknown error');
    return null;
  }
}
export default function AICostEstimator({ onEstimationComplete }: AICostEstimatorProps) {
  const [projectDescription, setProjectDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimation, setEstimation] = useState<ProjectDetails | null>(null);

  const analyzeProject = async () => {
    setIsLoading(true);
    setError('');
    setEstimation(null);

    try {
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI("AIzaSyC7KtD_jo0yC1n8tKw0DFiCSL0fm-S75yA");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create the prompt with context about construction estimation
      const prompt = `
        As a construction cost estimation expert, analyze this project description and provide estimates.
        Consider the following aspects:
        1. Materials needed (name, unit, cost per unit, quantity)
        2. Labor required (role, cost per hour, hours)
        3. Project dimensions (length, width, height in meters)

        Project description: ${projectDescription}

        Provide a JSON response in this exact format:
        {
          "projectName": "string",
          "length": number,
          "width": number,
          "height": number,
          "materials": [
            {
              "id": "string",
              "name": "string",
              "unit": "string",
              "costPerUnit": number,
              "quantity": number,
              "description": "string"
            }
          ],
          "labor": [
            {
              "id": "string",
              "role": "string",
              "costPerHour": number,
              "hours": number,
              "description": "string"
            }
          ]
        }

        Make sure to:
        1. Use realistic material costs and quantities
        2. Consider standard construction practices
        3. Include all necessary materials and labor roles
        4. Provide reasonable estimates based on the project description
      `;

      // Generate response
      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      // Parse the JSON response
     // console.log(text);
      
      const parsedEstimation = extractAndParseJSON(text);
      //console.log(parsedEstimation);
      

      // Transform the parsed data to match our ProjectDetails type
      const transformedEstimation: ProjectDetails = {
        projectName: parsedEstimation.projectName,
        length: parsedEstimation.length,
        width: parsedEstimation.width,
        height: parsedEstimation.height,
        materials: parsedEstimation.materials.map((m: any) => ({
          id: m.materialId || crypto.randomUUID(),
          name: m.name || 'Material',
          unit: m.unit || 'unit',
          costPerUnit: m.costPerUnit || 0,
          quantity: m.quantity,
          description: m.description || ''
        })),
        labor: parsedEstimation.labor.map((l: any) => ({
          id: l.laborId || crypto.randomUUID(),
          role: l.role || 'Labor',
          costPerHour: l.costPerHour || 0,
          hours: l.hours,
          description: l.description || ''
        }))
      };

      setEstimation(transformedEstimation);
      onEstimationComplete(transformedEstimation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze project. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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

      {estimation && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-4">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Ruler size={20} className="text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Length</p>
                  <p className="text-gray-100">{estimation.length}m</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ruler size={20} className="text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Width</p>
                  <p className="text-gray-100">{estimation.width}m</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Height</p>
                  <p className="text-gray-100">{estimation.height}m</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-400" />
              Materials
            </h3>
            <div className="space-y-4">
              {estimation.materials.map((material) => (
                <div key={material.id} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-gray-100 font-medium">{material.name}</h4>
                      <p className="text-sm text-gray-400">{material.description || 'No description provided'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-100">${material.costPerUnit.toFixed(2)}/{material.unit}</p>
                      <p className="text-sm text-gray-400">Quantity: {material.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-400" />
              Labor
            </h3>
            <div className="space-y-4">
              {estimation.labor.map((labor) => (
                <div key={labor.id} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-gray-100 font-medium">{labor.role}</h4>
                      <p className="text-sm text-gray-400">{labor.description || 'No description provided'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-100">${labor.costPerHour.toFixed(2)}/hour</p>
                      <p className="text-sm text-gray-400">Hours: {labor.hours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
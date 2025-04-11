import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import CostBreakdown from './components/CostBreakdown';
import ProjectHistory from './components/ProjectHistory';
import AICostEstimator from './components/AICostEstimator';
import { calculateCosts } from './utils/calculations';
import { CostBreakdown as CostBreakdownType, ProjectDetails, SavedProject } from './types';

function App() {
  const [session, setSession] = useState<any>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownType | null>(null);
  const [currentProject, setCurrentProject] = useState<ProjectDetails>({
    projectName: '',
    length: 0,
    width: 0,
    height: 0,
    materials: [],
    labor: [],
  });
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProjectSubmit = async (details: ProjectDetails) => {
    const breakdown = calculateCosts(details);
    setCostBreakdown(breakdown);

    // Save project to Supabase
    if (session?.user) {
      try {
        const { error } = await supabase.from('projects').insert({
          user_id: session.user.id,
          name: details.projectName,
          dimensions: {
            length: details.length,
            width: details.width,
            height: details.height,
          },
          materials: details.materials,
          labor: details.labor,
          total_cost: breakdown.total,
        });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving project:', error);
      }
    }
  };

  const handleProjectSelect = (project: SavedProject) => {
    setCurrentProject({
      projectName: project.name,
      length: project.dimensions.length,
      width: project.dimensions.width,
      height: project.dimensions.height,
      materials: project.materials,
      labor: project.labor,
    });

    const breakdown = calculateCosts({
      projectName: project.name,
      length: project.dimensions.length,
      width: project.dimensions.width,
      height: project.dimensions.height,
      materials: project.materials,
      labor: project.labor,
    });
    setCostBreakdown(breakdown);
  };

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header userEmail={session.user?.email} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <ul className="flex space-x-4 text-sm md:text-base">
            <li>
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/' 
                    ? 'bg-gray-800 shadow-lg shadow-blue-500/20 border border-gray-700' 
                    : 'hover:bg-gray-800/50'
                }`}
              >
                Manual Estimation
              </Link>
            </li>
            <li>
              <Link 
                to="/ai-estimator" 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/ai-estimator' 
                    ? 'bg-gray-800 shadow-lg shadow-purple-500/20 border border-gray-700' 
                    : 'hover:bg-gray-800/50'
                }`}
              >
                AI Estimator
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg md:rounded-xl shadow-xl md:shadow-2xl p-4 md:p-6 border border-gray-700">
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-medium text-gray-100">Project Details</h2>
                    <p className="mt-1 text-sm md:text-base text-gray-400">
                      Enter your project specifications to get an accurate cost estimation.
                    </p>
                  </div>
                  
                  <ProjectForm onSubmit={handleProjectSubmit} initialValues={currentProject} />

                  {costBreakdown && (
                    <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700">
                      <h2 className="text-xl md:text-2xl font-medium text-gray-100 mb-4 md:mb-6">Cost Breakdown</h2>
                      <CostBreakdown breakdown={costBreakdown} />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg md:rounded-xl shadow-xl md:shadow-2xl p-4 md:p-6 border border-gray-700">
                <h2 className="text-xl md:text-2xl font-medium text-gray-100 mb-3 md:mb-4">Previous Projects</h2>
                <ProjectHistory onProjectSelect={handleProjectSelect} />
              </div>
            </div>
          } />

          <Route path="/ai-estimator" element={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg md:rounded-xl shadow-xl md:shadow-2xl p-4 md:p-6 border border-gray-700">
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-medium text-gray-100">AI Cost Estimator</h2>
                    <p className="mt-1 text-sm md:text-base text-gray-400">
                      Describe your project and let AI generate a cost estimation for you.
                    </p>
                  </div>

                  <AICostEstimator 
                    onEstimationComplete={(details) => {
                      setCurrentProject(details);
                      const breakdown = calculateCosts(details);
                      setCostBreakdown(breakdown);
                    }} 
                  />

                  {costBreakdown && (
                    <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700">
                      <h2 className="text-xl md:text-2xl font-medium text-gray-100 mb-4 md:mb-6">Cost Breakdown</h2>
                      <CostBreakdown breakdown={costBreakdown} />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg md:rounded-xl shadow-xl md:shadow-2xl p-4 md:p-6 border border-gray-700">
                <h2 className="text-xl md:text-2xl font-medium text-gray-100 mb-3 md:mb-4">Previous Projects</h2>
                <ProjectHistory onProjectSelect={handleProjectSelect} />
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
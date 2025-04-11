import React from 'react';
import { HardHat, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  userEmail: string | undefined;
}

export default function Header({ userEmail }: HeaderProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto py-4 md:py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <Link 
            to="/" 
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
          >
            <HardHat size={28} className="text-blue-400 md:size-32" />
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Construction Cost Estimator
            </h1>
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-sm md:text-base text-gray-300">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm text-gray-300 hover:text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
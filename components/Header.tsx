
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-xl font-bold text-violet-600 dark:text-violet-400">Recipe Extractor Pro</h1>
      </div>
    </header>
  );
};

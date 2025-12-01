
import React, { useEffect } from 'react';
import { type Recipe } from '../types';
import { X, Link } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50 p-4 pt-16"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[calc(100vh-8rem)] overflow-y-auto animate-fade-in"
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <div className="p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close recipe details"
          >
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 pr-10">{recipe.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-3 text-violet-600 dark:text-violet-400 border-b-2 border-violet-200 dark:border-violet-700 pb-2">Ingredients</h3>
              <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-3 text-violet-600 dark:text-violet-400 border-b-2 border-violet-200 dark:border-violet-700 pb-2">Instructions</h3>
              <ol className="space-y-3 text-slate-600 dark:text-slate-300">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 bg-violet-500 text-white h-6 w-6 flex items-center justify-center rounded-full font-bold text-sm">{index + 1}</span>
                    <p className="break-words">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {recipe.sources && recipe.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Link className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                Sources
              </h3>
              <ul className="space-y-2 list-disc list-inside text-sm">
                {recipe.sources.map((source, index) => (
                  <li key={index}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors underline break-all"
                    >
                      {source.title || source.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

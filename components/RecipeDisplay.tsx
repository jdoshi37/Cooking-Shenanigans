import React from 'react';
import { type Recipe } from '../types';
import { Save, Link } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe;
  onSave: () => void;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, onSave }) => {
  return (
    <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 md:mb-0">{recipe.name}</h2>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Save className="h-5 w-5" />
          <span>Save Recipe</span>
        </button>
      </div>

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
                <p>{step}</p>
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
  );
};

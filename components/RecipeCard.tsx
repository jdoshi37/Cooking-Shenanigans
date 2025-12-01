
import React from 'react';
import { type Recipe } from '../types';
import { Trash2, BookOpen } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: () => void;
  onView: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete, onView }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
      <button 
        onClick={onView} 
        className="p-5 text-left flex-grow w-full hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500"
        aria-label={`View recipe for ${recipe.name}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-5 w-5 text-violet-500 dark:text-violet-400 flex-shrink-0" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">{recipe.name}</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
            {recipe.ingredients.length} ingredients | {recipe.instructions.length} steps
        </p>
      </button>
      <div className="px-5 pb-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center">
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold transition-colors"
          aria-label={`Delete recipe for ${recipe.name}`}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

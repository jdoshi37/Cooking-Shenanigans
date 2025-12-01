
import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';

interface UrlInputFormProps {
  onExtract: (url: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onExtract, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExtract(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://your-favorite-recipe-website.com/..."
        className="flex-grow px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
        required
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-md shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Extracting...</span>
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5" />
            <span>Extract Recipe</span>
          </>
        )}
      </button>
    </form>
  );
};

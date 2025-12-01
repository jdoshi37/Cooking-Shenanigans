import React, { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';

interface UrlInputFormProps {
  onExtract: (url: string) => void;
  onLucky: (query: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onExtract, onLucky, isLoading }) => {
  const [input, setInput] = useState('');

  const isUrl = (str: string) => {
    const s = str.trim();
    // URLs generally don't have spaces.
    // We check for protocol or at least one dot to distinguish from single word searches like "pizza"
    if (s.includes(' ')) return false;
    return s.includes('.') || s.startsWith('http://') || s.startsWith('https://');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    if (isUrl(trimmedInput)) {
      onExtract(trimmedInput);
    } else {
      onLucky(trimmedInput);
    }
  };

  const handleExtractClick = () => {
    if (!input.trim()) return;
    onExtract(input);
  };

  const handleLuckyClick = () => {
    // We allow empty input for "I'm Feeling Lucky" to trigger the cat gif
    onLucky(input.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a URL or type ingredients (e.g., 'chicken, rice')..."
        className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
        required={false}
        disabled={isLoading}
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleExtractClick}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-md shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              <span>Extract from URL</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleLuckyClick}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white font-semibold rounded-md shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>I'm Feeling Lucky</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
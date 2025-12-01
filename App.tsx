import React, { useState, useCallback } from 'react';
import { type Recipe } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { extractRecipeFromUrl, findRecipe } from './services/geminiService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UrlInputForm } from './components/UrlInputForm';
import { RecipeDisplay } from './components/RecipeDisplay';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { AlertTriangle, ChefHat, Salad } from 'lucide-react';

const App: React.FC = () => {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>('savedRecipes', []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [showCatGif, setShowCatGif] = useState<boolean>(false);

  const handleExtractRecipe = useCallback(async (url: string) => {
    if (!url) {
      setError('Please enter a valid URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentRecipe(null);
    setShowCatGif(false);

    try {
      const recipe = await extractRecipeFromUrl(url);
      setCurrentRecipe({ ...recipe, id: Date.now().toString() });
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to extract recipe. The URL might be invalid, or the page may not contain a recipe.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLuckySearch = useCallback(async (query: string) => {
    // If the user clicks "I'm Feeling Lucky" without input, show the cat GIF
    if (!query) {
      setShowCatGif(true);
      setCurrentRecipe(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentRecipe(null);
    setShowCatGif(false);

    try {
      const recipe = await findRecipe(query);
      setCurrentRecipe({ ...recipe, id: Date.now().toString() });
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to find a recipe. Please try being more specific with your ingredients or request.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveRecipe = useCallback(() => {
    if (currentRecipe) {
      if (!savedRecipes.some(r => r.name === currentRecipe.name)) {
        setSavedRecipes(prev => [currentRecipe, ...prev]);
      }
      setCurrentRecipe(null);
    }
  }, [currentRecipe, savedRecipes, setSavedRecipes]);

  const handleDeleteRecipe = useCallback((id: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  }, [setSavedRecipes]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12 text-center">
            <div className="inline-block p-4 bg-violet-100 dark:bg-violet-900/50 rounded-full mb-4">
              <ChefHat className="h-10 w-10 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Be the Masterchef</h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">What do you want to cook today?</p>
          </section>

          <UrlInputForm 
            onExtract={handleExtractRecipe} 
            onLucky={handleLuckySearch}
            isLoading={isLoading} 
          />

          {error && (
            <div className="mt-6 flex items-center justify-center gap-3 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg animate-fade-in">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="mt-6 flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 dark:border-violet-400"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Cooking up some magic, please wait...</p>
            </div>
          )}

          {showCatGif && !isLoading && !currentRecipe && (
             <div className="mt-10 flex flex-col items-center justify-center animate-fade-in text-center">
               <div className="rounded-xl overflow-hidden shadow-xl">
                 <img 
                   src="https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif" 
                   alt="Cute cat" 
                   className="w-full max-w-sm h-auto"
                 />
               </div>
               <p className="mt-6 text-xl font-medium text-slate-700 dark:text-slate-300">
                 You didn't ask for anything...<br />so here is a cute cat instead! 🐱
               </p>
             </div>
          )}

          {currentRecipe && !isLoading && (
            <RecipeDisplay recipe={currentRecipe} onSave={handleSaveRecipe} />
          )}

          {savedRecipes.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-3 mb-6">
                <Salad className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Saved Recipes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onView={() => setViewingRecipe(recipe)}
                    onDelete={() => handleDeleteRecipe(recipe.id)} 
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      {viewingRecipe && (
        <RecipeModal recipe={viewingRecipe} onClose={() => setViewingRecipe(null)} />
      )}
    </div>
  );
};

export default App;
import { GoogleGenAI } from "@google/genai";
import { type Recipe, type GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractRecipeFromUrl = async (url: string): Promise<Omit<Recipe, 'id'>> => {
  const prompt = `You are an expert recipe extractor. Using Google Search to access the provided URL, find and extract the recipe details. The URL is: ${url}.
You MUST format your response as a single, valid JSON object with the following keys:
- "name": The name of the recipe (string).
- "ingredients": An array of strings, where each string is a single ingredient with its quantity.
- "instructions": An array of strings, where each string is a single step in the cooking instructions.

IMPORTANT: Do not add any text, explanations, or markdown formatting (like \`\`\`json) around the JSON output. Your entire response must be only the raw JSON object.
If you cannot find a clear recipe on the page, return a JSON object with an empty string for "name", and empty arrays for "ingredients" and "instructions".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text.trim();
    
    // In case the model still adds markdown, try to clean it.
    const cleanedText = text.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    
    let recipeData;
    try {
        recipeData = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", cleanedText);
        throw new Error("The AI returned an invalid format. Please try again.");
    }


    if (!recipeData.name || !recipeData.ingredients || recipeData.ingredients.length === 0 || !recipeData.instructions || recipeData.instructions.length === 0) {
      throw new Error("Could not find a valid recipe at the provided URL. The page might not contain a recipe, or it's in a format that could not be understood.");
    }
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingSource[] = groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web)
        .filter((web: any) => web?.uri && web?.uri.trim() !== '')
        .map((web: any) => ({ uri: web.uri, title: web.title || web.uri })) ?? [];
    
    const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());

    return { ...recipeData, sources: uniqueSources };

  } catch (error) {
    console.error("Error extracting recipe:", error);
    if (error instanceof Error) {
        throw error; // Re-throw specific errors
    }
    throw new Error("An unknown error occurred while communicating with the AI service.");
  }
};

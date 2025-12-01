import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { type Recipe, type GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseRecipeResponse = (response: GenerateContentResponse): Omit<Recipe, 'id'> => {
  let text = response.text?.trim() || '';
  
  // 1. Extract JSON from Markdown code blocks if present
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch) {
    text = jsonBlockMatch[1];
  }

  // 2. Find the JSON object boundary (first '{' to last '}')
  // This helps if there is conversational filler text outside the code block
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
     console.error("No JSON brackets found in response:", text);
     throw new Error("The AI response did not contain a valid JSON object.");
  }

  const jsonString = text.substring(startIndex, endIndex + 1);

  let recipeData: any;
  try {
      recipeData = JSON.parse(jsonString);
  } catch (e) {
      console.error("Failed to parse JSON response from AI:", jsonString);
      throw new Error("The AI returned an invalid format. Please try again.");
  }

  // Validate required fields
  if (!recipeData.name || typeof recipeData.name !== 'string') {
      throw new Error("Recipe name is missing or invalid.");
  }
  
  if (!Array.isArray(recipeData.ingredients)) {
      throw new Error("Recipe ingredients format is invalid.");
  }
  
  if (!Array.isArray(recipeData.instructions)) {
      throw new Error("Recipe instructions format is invalid.");
  }

  // Handle empty recipe case (model couldn't find one)
  if (recipeData.name.trim() === '' && recipeData.ingredients.length === 0) {
      throw new Error("No recipe found.");
  }

  // Extract grounding metadata for sources if available
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const sources: GroundingSource[] = groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web?.uri && web?.uri.trim() !== '')
      .map((web: any) => ({ uri: web.uri, title: web.title || web.uri })) ?? [];
  
  // Deduplicate sources based on URI
  const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());

  return { 
      name: recipeData.name,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      sources: uniqueSources 
  };
};

export const extractRecipeFromUrl = async (url: string): Promise<Omit<Recipe, 'id'>> => {
  const prompt = `You are an expert recipe extractor. I need you to visit the following URL and extract the recipe details into a structured JSON format.
  
URL: ${url}

Requirements:
1. **Name**: The name of the dish.
2. **Ingredients**: An array of strings, listing each ingredient with quantity.
3. **Instructions**: An array of strings, listing the cooking steps in order.

Output Format:
Provide ONLY a valid JSON object. Do not include any conversational text, preambles, or markdown formatting outside the JSON.

Example JSON Structure:
{
  "name": "Spaghetti Carbonara",
  "ingredients": ["400g spaghetti", "150g pancetta", "4 large eggs", "50g pecorino cheese"],
  "instructions": ["Boil pasta.", "Fry pancetta.", "Mix eggs and cheese.", "Combine all."]
}

If the URL does not contain a recipe, return a JSON object with empty values for all fields.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return parseRecipeResponse(response);

  } catch (error) {
    console.error("Error extracting recipe:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown error occurred while communicating with the AI service.");
  }
};

export const findRecipe = async (query: string): Promise<Omit<Recipe, 'id'>> => {
  const prompt = `You are a helpful cooking assistant. The user is "Feeling Lucky" and wants a recipe based on this input: "${query}".

Task:
1. Use Google Search to find a *single*, specific, high-quality recipe that matches the user's input.
2. Extract the full details of that recipe.

Requirements:
- **Name**: The name of the dish.
- **Ingredients**: A comprehensive list of ingredients with quantities.
- **Instructions**: Step-by-step cooking instructions.

Output Format:
Provide ONLY a valid JSON object. Do not include any conversational text.

Example JSON Structure:
{
  "name": "Recipe Name",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "instructions": ["Step 1", "Step 2"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return parseRecipeResponse(response);

  } catch (error) {
    console.error("Error finding recipe:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown error occurred while searching for a recipe.");
  }
};
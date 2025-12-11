import { GoogleGenAI } from "@google/genai";

export const generateWebPage = async (query: string): Promise<string> => {
  try {
    // Initialize inside the function to prevent app crash if process.env is missing on load
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are the rendering engine for "Meow Browser". 
      The user has entered the following query or URL: "${query}".
      
      Your task is to generate the HTML <body> content for a webpage that matches this query.
      
      Rules:
      1. Use purely valid HTML5 tags.
      2. Style everything using standard Tailwind CSS classes. Make it look modern, clean, and professional.
      3. Do NOT include <html>, <head>, or <body> tags. Just return the inner content of the body.
      4. Do NOT use markdown code blocks (like \`\`\`html). Just return the raw string.
      5. Include images using https://picsum.photos/seed/{random_number}/400/300 where appropriate.
      6. If the query is a question, generate a blog post or article answering it.
      7. If the query looks like a domain (e.g., apple.com), generate a parody or similar looking landing page for that concept.
      8. Add a "Meow Browser AI" footer to the content.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text;
    if (!text) return '<div class="p-4 text-red-500">Failed to load content. The tubes are clogged.</div>';
    
    // Cleanup simple markdown if Gemini adds it despite instructions
    const cleanText = text.replace(/```html/g, '').replace(/```/g, '');
    
    return cleanText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `<div class="flex flex-col items-center justify-center h-full text-gray-500 p-8">
      <h1 class="text-4xl font-bold mb-4">😿</h1>
      <h2 class="text-xl">Opps! The cat tripped over the ethernet cable.</h2>
      <p>Error details: ${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>`;
  }
};
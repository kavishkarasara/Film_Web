import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `Provide the following details for the movie "${title}" in strict JSON format: 
    {
      "title": "Exact Movie Title",
      "description_full": "A detailed 3-4 sentence exciting synopsis of the movie.",
      "year": "YYYY",
      "rating": "8.5",
      "genres": ["Action", "Sci-Fi"]
    }
    Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up markdown if Gemini includes it
    let jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const movieInfo = JSON.parse(jsonText);
      
      // Return in the exact format the frontend expects
      return NextResponse.json({
        data: {
          movies: [{
            title: movieInfo.title || title,
            description_full: movieInfo.description_full,
            year: movieInfo.year,
            rating: movieInfo.rating,
            genres: movieInfo.genres
          }]
        }
      });
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", jsonText);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to fetch from Gemini API' }, { status: 500 });
  }
}

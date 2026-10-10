import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const prompt = `Provide the following details for the movie "${title}" in strict JSON format: 
    {
      "title": "Exact Movie Title",
      "description_full": "A detailed 3-4 sentence exciting synopsis of the movie.",
      "year": "YYYY",
      "rating": "8.5",
      "genres": ["Action", "Sci-Fi"]
    }
    Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      let jsonText = data.candidates[0].content.parts[0].text;
      // Clean up markdown if Gemini includes it
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      
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
    }

    console.error("Gemini Response:", data);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: 'Failed to fetch from Gemini API' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { reply: 'Gemini API key not set.' },
      { status: 500 }
    );
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const requestBody = {
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    };

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return NextResponse.json(
        { reply: `Gemini API error: ${geminiResponse.statusText}. Details: ${JSON.stringify(data)}` },
        { status: 500 }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'Sorry, I could not process your request.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { reply: `Error contacting Gemini: ${error.message}` },
      { status: 500 }
    );
  }
}
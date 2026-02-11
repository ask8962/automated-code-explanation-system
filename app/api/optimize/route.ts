import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const prompt = `You are an expert algorithm optimization engineer.
Your goal is to rewrite the provided ${language} code to be more efficient in terms of Time and/or Space Complexity.

### Input Code:
${code}

### Instructions:
1. Analyze the Time and Space Complexity of the input code.
2. Write an OPTIMIZED version of the code that achieves the same result but faster or with less memory.
3. Compare the complexities.
4. Explain the specific improvements made.

### Response Format (Strict JSON Only):
You must output valid JSON. No markdown backticks.
{
  "optimizedCode": "The full optimized code string",
  "originalComplexity": {
    "time": "O(...)",
    "space": "O(...)"
  },
  "newComplexity": {
    "time": "O(...)",
    "space": "O(...)"
  },
  "improvements": [
    "improvement 1",
    "improvement 2"
  ],
  "overview": "Brief summary of changes."
}`;

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.3, // Low temp for precision
    });

    let data;
    try {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      data = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse optimization JSON:', e);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error optimizing code:', error);
    return NextResponse.json({ error: 'Failed to optimize code' }, { status: 500 });
  }
}

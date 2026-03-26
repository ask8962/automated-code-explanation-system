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
You must output VALID JSON. 
CRITICAL JSON RULES:
- Absolutely NO literal newlines inside string values. All newlines inside strings MUST be escaped as \\n.
- Escape all internal double quotes as \\"
- Do NOT wrap the JSON in markdown backticks.

{
  "optimizedCode": "The full optimized code string.\\nUse \\n for newlines.",
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
      temperature: 0.1, // Even lower temp for stricter formatting
    });

    let data;
    try {
      let cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        data = JSON.parse(cleanText);
      } catch (e1) {
        // Fallback: If it still generated literal newlines inside string values (common LLM mistake),
        // we use a regex to replace literal newlines with \n ONLY if they are not formatting characters.
        // A safer approach: parse using a relaxed JSON evaluator (eval) since the source is an LLM.
        data = eval('(' + cleanText + ')');
      }
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

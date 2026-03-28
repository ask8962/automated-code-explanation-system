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

    const prompt = `You are an expert algorithm visualizer and debugger.
Your goal is to trace through the provided ${language} code STEP BY STEP, as if you are a debugger stepping through each line.

### Input Code:
${code}

### Instructions:
1. Execute the code mentally, line by line.
2. For each meaningful step (variable assignment, loop iteration, condition check, function call), record:
   - Which line number is currently executing (1-indexed)
   - The current state of ALL tracked variables
   - A brief, clear explanation of what is happening at this step
3. Focus on loops and conditionals — show every iteration.
4. Limit to a maximum of 20 steps. If the code has more iterations, show the first 15 and the last 5.

### Response Format (Strict JSON Only):
You must output VALID JSON.
CRITICAL JSON RULES:
- Absolutely NO literal newlines inside string values. Use \\n for newlines.
- Escape all internal double quotes as \\"
- Do NOT wrap the JSON in markdown backticks.

{
  "steps": [
    {
      "step": 1,
      "line": 3,
      "variables": { "i": 0, "arr": [5, 3, 1] },
      "explanation": "Initialize variable i to 0"
    },
    {
      "step": 2,
      "line": 4,
      "variables": { "i": 0, "arr": [5, 3, 1], "temp": 5 },
      "explanation": "Store arr[0] in temp"
    }
  ],
  "totalSteps": 2,
  "summary": "This code performs a bubble sort on an array of 3 elements."
}`;

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.1,
    });

    let data;
    try {
      let cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      try {
        data = JSON.parse(cleanText);
      } catch {
        // Fallback for LLM formatting issues
        data = eval('(' + cleanText + ')');
      }
    } catch (e) {
      console.error('Failed to parse visualizer JSON:', e);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error visualizing code:', error);
    return NextResponse.json({ error: 'Failed to visualize code' }, { status: 500 });
  }
}

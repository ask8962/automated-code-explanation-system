import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { NextRequest, NextResponse } from 'next/server';

const modePrompts = {
  beginner: 'Explain this code in a simple, beginner-friendly way as if teaching a school student.',
  exam: 'Explain this code focusing on definitions, logic, and key concepts suitable for exam preparation.',
  interview: 'Explain this code focusing on the approach, reasoning, time/space complexity, and problem-solving strategy for interview preparation.',
};

export async function POST(request: NextRequest) {
  try {
    const { code, language, mode, userId } = await request.json();

    if (!code || !language || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the AI prompt
    const prompt = `You are an expert programming instructor. Explain the following ${language.toUpperCase()} code in ${mode} style.

### Goal:
Provide a structured explanation in JSON format for a rich UI.

### Output Format (Strict JSON):
You must output VALID JSON only. No markdown formatting, no backticks.
Structure:
{
  "overview": "Concise 1-2 sentence summary of what the code does.",
  "steps": [
    {
      "title": "Step 1 Title",
      "description": "Detailed explanation of this step."
    },
    {
      "title": "Step 2 Title",
      "description": "Detailed explanation of this step."
    }
  ],
  "keyConcepts": [
    {
      "title": "Concept Name",
      "description": "Brief definition of the concept."
    },
    {
      "title": "Concept Name",
      "description": "Brief definition of the concept."
    }
  ],
  "timeComplexity": {
    "value": "O(...)",
    "reason": "Brief reasoning."
  },
  "spaceComplexity": {
    "value": "O(...)",
    "reason": "Brief reasoning."
  }
}

### Guidelines:
- **Tone**: Friendly and professional.
- **Steps**: logical breakdown of the code execution.
- **Concepts**: 2-3 key programming concepts used.
- **Complexity**: Accurate analysis.

${modePrompts[mode as keyof typeof modePrompts]}

### Code to Explain:
\`\`\`${language}
${code}
\`\`\`
`;

    // Call Groq Llama 3 through AI SDK
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.5, // Lower temperature for more consistent JSON
      maxTokens: 1500,
    });

    let explanationData;
    try {
      // clean up any potential markdown code blocks in the response
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      explanationData = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse JSON explanation:', e);
      // Fallback structure if JSON parsing fails
      explanationData = {
        overview: "Failed to generate structured explanation.",
        steps: [],
        keyConcepts: [],
        timeComplexity: { value: "N/A", reason: "Error" },
        spaceComplexity: { value: "N/A", reason: "Error" }
      };
    }

    return NextResponse.json(explanationData);
  } catch (error) {
    console.error('Error generating explanation:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}

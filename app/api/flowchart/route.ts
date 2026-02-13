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

        const prompt = `You are an expert programmer and diagram specialist.
Your task is to convert the following ${language} code into a Mermaid.js flowchart diagram.

### Input Code:
${code}

### Instructions:
1. Analyze the code logic: loops, conditionals, function calls, returns.
2. Create a valid Mermaid flowchart using the "graph TD" (top-down) syntax.
3. Use descriptive labels inside nodes. Keep labels SHORT (max 6 words).
4. Use proper Mermaid syntax:
   - Rounded boxes for start/end: id(["Label"])
   - Rectangles for processes: id["Label"]  
   - Diamond for decisions: id{"Label"}
   - Use --> for arrows, and |Yes| / |No| for decision branches.
5. Make sure every node ID is unique (use A, B, C, D... pattern).
6. Do NOT use any special characters inside labels that would break Mermaid parsing.
7. Do NOT wrap response in markdown code blocks. Output ONLY the raw Mermaid code.

### Example Output:
graph TD
    A(["Start"]) --> B["Initialize variables"]
    B --> C{"Is n <= 1?"}
    C -->|Yes| D["Return n"]
    C -->|No| E["Call fib(n-1) + fib(n-2)"]
    E --> F(["Return result"])

### Code to Diagram:
\`\`\`${language}
${code}
\`\`\`

Output ONLY valid Mermaid syntax. No explanations, no markdown fences.`;

        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt,
            temperature: 0.2,
        });

        // Clean up: remove any markdown fences the AI might add
        const cleanMermaid = text
            .replace(/```mermaid\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return NextResponse.json({ mermaidCode: cleanMermaid });
    } catch (error) {
        console.error('Error generating flowchart:', error);
        return NextResponse.json({ error: 'Failed to generate flowchart' }, { status: 500 });
    }
}

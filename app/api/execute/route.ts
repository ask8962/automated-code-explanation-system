import { NextResponse } from 'next/server';

// Map our app's language IDs to Piston-compatible names and versions
const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
};

export async function POST(req: Request) {
  try {
    const { code, language, stdin = '' } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const langConfig = LANGUAGE_MAP[language] || LANGUAGE_MAP['python'];

    const startTime = Date.now();

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            content: code,
          },
        ],
        stdin,
        run_timeout: 10000,    // 10 second max
        compile_timeout: 10000,
      }),
    });

    const executionTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Piston API error:', errorText);
      return NextResponse.json(
        { error: 'Code execution service unavailable. Try again.' },
        { status: 502 }
      );
    }

    const result = await response.json();

    // Extract relevant fields from Piston response
    const runResult = result.run || {};
    const compileResult = result.compile || null;

    return NextResponse.json({
      stdout: runResult.stdout || '',
      stderr: runResult.stderr || '',
      output: runResult.output || '',
      exitCode: runResult.code ?? -1,
      signal: runResult.signal || null,
      compile: compileResult
        ? {
            stdout: compileResult.stdout || '',
            stderr: compileResult.stderr || '',
            exitCode: compileResult.code ?? 0,
          }
        : null,
      language: result.language,
      version: result.version,
      executionTime,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}

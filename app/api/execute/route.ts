import { NextResponse } from 'next/server';

// JDoodle language identifiers and version indices
// Docs: https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/compiler-api
const LANGUAGE_MAP: Record<string, { language: string; versionIndex: string }> = {
  python: { language: 'python3', versionIndex: '5' },
  javascript: { language: 'nodejs', versionIndex: '4' },
  typescript: { language: 'typescript', versionIndex: '0' },
  java: { language: 'java', versionIndex: '4' },
  cpp: { language: 'cpp17', versionIndex: '1' },
  c: { language: 'c', versionIndex: '5' },
  go: { language: 'go', versionIndex: '4' },
  rust: { language: 'rust', versionIndex: '4' },
};

export async function POST(req: Request) {
  try {
    const { code, language, stdin = '' } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const clientId = process.env.JDOODLE_CLIENT_ID;
    const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'JDoodle API not configured. Add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to .env.local' },
        { status: 500 }
      );
    }

    const langConfig = LANGUAGE_MAP[language] || LANGUAGE_MAP['python'];
    const startTime = Date.now();

    const response = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script: code,
        stdin,
        language: langConfig.language,
        versionIndex: langConfig.versionIndex,
      }),
    });

    const executionTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('JDoodle API error:', errorText);
      return NextResponse.json(
        { error: 'Code execution service unavailable. Try again.' },
        { status: 502 }
      );
    }

    const result = await response.json();

    // JDoodle returns { output, statusCode, memory, cpuTime }
    const hasError = result.statusCode !== 200 || (result.output && result.output.includes('JDoodle - Pair not found'));
    const isCompileError = result.output && (
      result.output.includes('error:') ||
      result.output.includes('Error:') ||
      result.output.includes('SyntaxError') ||
      result.output.includes('Traceback')
    );

    // Separate stdout and stderr heuristically
    let stdout = '';
    let stderr = '';

    if (hasError) {
      stderr = result.output || 'Execution failed';
    } else if (isCompileError) {
      stderr = result.output || '';
    } else {
      stdout = result.output || '';
    }

    return NextResponse.json({
      stdout,
      stderr,
      output: result.output || '',
      exitCode: hasError ? 1 : 0,
      signal: null,
      compile: isCompileError ? { stdout: '', stderr: result.output || '', exitCode: 1 } : null,
      language,
      version: '',
      executionTime,
      memory: result.memory ? `${result.memory} KB` : null,
      cpuTime: result.cpuTime ? `${result.cpuTime}s` : null,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}

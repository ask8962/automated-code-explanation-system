'use client';

import { useState } from 'react';

interface ExecutionResult {
  stdout: string;
  stderr: string;
  output: string;
  exitCode: number;
  signal: string | null;
  compile: {
    stdout: string;
    stderr: string;
    exitCode: number;
  } | null;
  language: string;
  version: string;
  executionTime: number;
}

export function useExecuteCode() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  const executeCode = async (code: string, language: string, stdin: string = '') => {
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, stdin }),
      });

      const data = await response.json();

      if (!response.ok) {
        setExecutionResult({
          stdout: '',
          stderr: data.error || 'Execution failed',
          output: data.error || 'Execution failed',
          exitCode: 1,
          signal: null,
          compile: null,
          language,
          version: '',
          executionTime: 0,
        });
        return;
      }

      setExecutionResult(data);
    } catch (error) {
      setExecutionResult({
        stdout: '',
        stderr: 'Network error: Could not reach the execution server.',
        output: 'Network error: Could not reach the execution server.',
        exitCode: 1,
        signal: null,
        compile: null,
        language,
        version: '',
        executionTime: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const clearResult = () => setExecutionResult(null);

  return { executeCode, isExecuting, executionResult, clearResult };
}

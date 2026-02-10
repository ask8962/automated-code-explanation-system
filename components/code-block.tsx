'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
    language: string;
    code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
    const { theme } = useTheme();

    return (
        <div className="rounded-md overflow-hidden border border-border">
            <SyntaxHighlighter
                language={language}
                style={theme === 'dark' ? vscDarkPlus : prism}
                customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'transparent',
                }}
                wrapLongLines={true}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

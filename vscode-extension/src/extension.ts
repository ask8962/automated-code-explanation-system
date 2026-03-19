import * as vscode from 'vscode';
import * as https from 'https';

export function activate(context: vscode.ExtensionContext) {
    console.log('Automated Code Explanation System extension is now active!');

    let explainDisposable = vscode.commands.registerCommand('automated-code-explanation-system.explainCode', async () => {
        await processCode('explain');
    });

    let optimizeDisposable = vscode.commands.registerCommand('automated-code-explanation-system.optimizeCode', async () => {
        await processCode('optimize');
    });

    context.subscriptions.push(explainDisposable, optimizeDisposable);
}

async function processCode(mode: 'explain' | 'optimize') {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showInformationMessage(`Open a file first to ${mode} code.`);
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const text = document.getText(selection);

    if (!text) {
        vscode.window.showInformationMessage(`Please highlight some code to ${mode}.`);
        return;
    }

    const panelTitle = mode === 'explain' ? '✨ AI Code Explanation' : '🚀 AI Code Optimization';

    // Create and show a new webview right beside the code they are looking at
    const panel = vscode.window.createWebviewPanel(
        'codeExplanation',
        panelTitle,
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

    panel.webview.html = getLoadingHtml(mode);

    try {
        const responseJson = await fetchExplanationFromAPI(text, document.languageId, mode);
        panel.webview.html = getResultHtml(responseJson, mode);
    } catch (error: any) {
        panel.webview.html = getErrorHtml(error.message || 'Failed to fetch explanation.');
        vscode.window.showErrorMessage('Failed to connect to the explanation server.');
    }
}

// Function to call the Next.js backend API via HTTPS
function fetchExplanationFromAPI(code: string, language: string, mode: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            code: code,
            language: language,
            mode: mode,
        });

        const req = https.request(
            {
                hostname: 'gla-code-aa.vercel.app',
                port: 443,
                path: '/api/explain',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            }
        );

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

// The exact premium CSS matching the Next.js Dashboard and Chrome Extension
function getBaseStyles() {
    return `
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            padding: 24px; 
            background-color: #0f172a; /* Slate 900 overriding VS Code defaults for true brand match */
            color: #f1f5f9;
            line-height: 1.6;
        }
        h2 { color: #818cf8; margin-top: 0; margin-bottom: 24px; padding-bottom: 15px; border-bottom: 1px solid #334155; }
        
        .ai-overview-card {
            background: #1e293b;
            border: 1px solid #334155;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        .ai-overview-card h4 { margin: 0 0 8px 0; color: #f8fafc; font-size: 16px; }
        .ai-overview-card p { margin: 0; color: #cbd5e1; font-size: 14px; }

        .ai-steps-container h4, .ai-concepts-container h4, .ai-complexity-header {
            margin: 0 0 16px 0;
            color: #e2e8f0;
            font-size: 16px;
        }

        .ai-step-card {
            background: #1e293b;
            border-left: 4px solid #6366f1;
            padding: 12px 16px;
            margin-bottom: 12px;
            border-radius: 4px 8px 8px 4px;
        }
        .ai-step-header {
            font-weight: 600;
            color: #f1f5f9;
            margin-bottom: 4px;
            font-size: 14px;
        }
        .ai-step-body {
            color: #94a3b8;
            font-size: 13px;
        }

        .ai-concepts-container { margin-bottom: 24px; }
        .ai-concept-item {
            background: #1e293b;
            border: 1px solid #334155;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #cbd5e1;
        }
        .ai-concept-item strong { color: #818cf8; }

        .ai-complexity-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 8px;
            margin-bottom: 24px;
        }

        .ai-complexity-card {
            background: #1e293b;
            border: 1px solid #334155;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
        }
        .ai-complexity-card.time { border-top: 3px solid #f59e0b; }
        .ai-complexity-card.space { border-top: 3px solid #10b981; }

        .ai-comp-title { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; margin-bottom: 8px; }
        .ai-comp-value { font-size: 22px; font-weight: 800; color: #f8fafc; margin-bottom: 4px; font-family: monospace; }
        .ai-comp-desc { font-size: 12px; color: #64748b; }
    `;
}

function getLoadingHtml(mode: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thinking...</title>
    <style>
        ${getBaseStyles()}
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #818cf8;
            animation: spin 1s ease infinite;
            margin: 40px auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-text { text-align: center; color: #94a3b8; font-size: 15px; }
    </style>
</head>
<body>
    <div class="spinner"></div>
    <p class="loading-text">⚡ AI is ${mode === 'explain' ? 'analyzing' : 'optimizing'} your code...</p>
</body>
</html>`;
}

function getResultHtml(jsonString: string, mode: string) {
    let data;
    try {
        // Parse the raw JSON mapping returned by Next.js API
        const cleanText = jsonString.replace(/```json\n?|\n?```/g, '').trim();
        data = JSON.parse(cleanText);
    } catch (e) {
        return getErrorHtml("Failed to parse AI response. Did you highlight valid code? Raw API output received:<br><pre>" + escapeHtml(jsonString.substring(0, 200)) + "</pre>");
    }

    let htmlOutput = `
        <div class="ai-overview-card">
            <h4>${mode === 'explain' ? '🎯 Overview' : '🚀 Optimization Strategy'}</h4>
            <p>${data.overview || 'No overview provided.'}</p>
        </div>
    `;

    if (data.steps && data.steps.length > 0) {
        htmlOutput += `<div class="ai-steps-container"><h4>🪜 ${mode === 'explain' ? 'Execution Steps' : 'Refactoring Steps'}</h4>`;
        data.steps.forEach((step: any, index: number) => {
            htmlOutput += `
                <div class="ai-step-card">
                    <div class="ai-step-header">Step ${index + 1}: ${step.title}</div>
                    <div class="ai-step-body">${step.description}</div>
                </div>
            `;
        });
        htmlOutput += `</div>`;
    }

    if (data.keyConcepts && data.keyConcepts.length > 0) {
        htmlOutput += `<div class="ai-concepts-container"><h4>💡 Key Concepts</h4>`;
        data.keyConcepts.forEach((concept: any) => {
            htmlOutput += `
                <div class="ai-concept-item">
                    <strong>${concept.title}:</strong> ${concept.description}
                </div>
            `;
        });
        htmlOutput += `</div>`;
    }

    if (data.timeComplexity || data.spaceComplexity) {
        htmlOutput += `
            <h4 class="ai-complexity-header">⚡ Complexity</h4>
            <div class="ai-complexity-grid">
                <div class="ai-complexity-card time">
                    <div class="ai-comp-title">⏱️ Time</div>
                    <div class="ai-comp-value">${data.timeComplexity?.value || 'N/A'}</div>
                    <div class="ai-comp-desc">${data.timeComplexity?.reason || ''}</div>
                </div>
                <div class="ai-complexity-card space">
                    <div class="ai-comp-title">💾 Space</div>
                    <div class="ai-comp-value">${data.spaceComplexity?.value || 'N/A'}</div>
                    <div class="ai-comp-desc">${data.spaceComplexity?.reason || ''}</div>
                </div>
            </div>
        `;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explanation</title>
    <style>${getBaseStyles()}</style>
</head>
<body>
    <h2>${mode === 'explain' ? '✨ Code Explanation' : '🚀 Code Optimization'}</h2>
    ${htmlOutput}
</body>
</html>`;
}

function getErrorHtml(errorMessage: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <style>${getBaseStyles()} body { color: #ef4444; }</style>
</head>
<body>
    <h2>❌ Error Fetching Explanation</h2>
    <p>${errorMessage}</p>
    <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Ensure your Next.js backend is running correctly at https://gla-code-aa.vercel.app</p>
</body>
</html>`;
}

function escapeHtml(unsafe: string) {
    return (unsafe || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export function deactivate() { }

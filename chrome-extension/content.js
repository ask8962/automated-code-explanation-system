// content.js
// This script runs whenever you visit *://github.com/* and other specified domains

function injectExplainButtons() {
    // Target GitHub code blocks AND LeetCode code blocks (.monaco-editor instead of .view-lines to survive DOM rewrites)
    // Removed .react-code-text because it matches every single line in GitHub's latest UI.
    const codeBlocks = document.querySelectorAll(`
        pre, .highlight, div[data-snippet-clipboard-copy-content], .monaco-editor, 
        table[data-tag="table"], .react-code-lines, textarea[id="read-only-cursor-text-area"]
    `);

    codeBlocks.forEach(block => {
        // Prevent duplicate buttons OR buttons on tiny inline code
        if (block.querySelector('.ai-explain-btn') || (block.innerText && block.innerText.length < 10)) return;

        // Skip child elements that might accidentally get selected
        if (block.closest('.ai-explain-btn')) return;

        block.style.position = 'relative';

        const btn = document.createElement('button');
        btn.innerHTML = '✨ <span class="ai-btn-text">Explain Code</span>';
        btn.className = 'ai-explain-btn';

        // Ensure the button floats above LeetCode's transparent click-capture overlays
        btn.style.zIndex = '999999';
        btn.style.pointerEvents = 'auto';

        // Fix positioning for GitHub's table layout (don't break table flow)
        if (block.tagName === 'TABLE' || block.classList.contains('react-code-lines')) {
            btn.style.position = 'absolute';
            btn.style.top = '10px';
            btn.style.right = '20px';
        }

        // Monaco editor uses aggressive event capturing. We trap mousedown to prevent it from stealing focus.
        btn.onmousedown = (e) => {
            e.stopPropagation();
        };

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            let codeToExplain = "";

            if (block.classList.contains('monaco-editor')) {
                // It's a LeetCode Monaco editor.
                const hiddenTextarea = block.querySelector('.inputarea');
                if (hiddenTextarea && hiddenTextarea.value) {
                    codeToExplain = hiddenTextarea.value;
                } else {
                    const lines = block.querySelectorAll('.view-line');
                    if (lines.length > 0) {
                        let extractedText = [];
                        lines.forEach(line => {
                            extractedText.push(line.textContent || '');
                        });
                        codeToExplain = extractedText.join('\n');
                    }
                }
            } else if (block.tagName === 'TABLE' || block.classList.contains('react-code-lines')) {
                // GitHub's new React file viewer table
                const lines = block.querySelectorAll('.react-file-line');
                if (lines.length > 0) {
                    let extractedText = [];
                    lines.forEach(line => {
                        extractedText.push(line.textContent || '');
                    });
                    codeToExplain = extractedText.join('\n');
                } else {
                    codeToExplain = block.innerText;
                }
            } else if (block.id === 'read-only-cursor-text-area') {
                codeToExplain = block.value;
            } else {
                // Standard GitHub/StackOverflow pre block
                codeToExplain = block.getAttribute('data-snippet-clipboard-copy-content') || block.innerText;
            }

            // Ultimate fallback for tricky DOMs
            if (!codeToExplain || codeToExplain.trim() === '' || codeToExplain.trim().length < 5) {
                codeToExplain = window.getSelection().toString();
            }

            if (!codeToExplain || codeToExplain.trim() === '') {
                alert("Could not extract code. Please highlight the code with your mouse first, then click ✨ Explain Code.");
                return;
            }

            const btnText = btn.querySelector('.ai-btn-text');
            btnText.innerText = 'Thinking...';
            btn.disabled = true;

            // Send message to background script to call Next.js API
            chrome.runtime.sendMessage({
                action: "explainCode",
                code: codeToExplain
            }, (response) => {
                btnText.innerText = 'Explain Code';
                btn.disabled = false;

                if (response && response.success) {
                    showExplanationModal(response.explanation, response.isHtml);
                } else {
                    alert('Error: ' + (response ? response.error : 'Unknown error'));
                }
            });
        };

        block.appendChild(btn);
    });
}

// Helper to show the explanation floating above the page
function showExplanationModal(content, isHtml) {
    let modal = document.getElementById('ai-explain-modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ai-explain-modal';
        document.body.appendChild(modal);
    }

    // Inject Custom HTML Layout
    modal.innerHTML = `
        <div class="ai-modal-content">
            <span class="ai-close-btn">&times;</span>
            <div class="ai-modal-header">
                <h3 style="margin-top: 0; display: flex; align-items: center; gap: 8px; color: #818cf8;">✨ AI Code Explanation</h3>
            </div>
            <div class="ai-modal-body">
                ${isHtml ? content : `<pre><code>${escapeHtml(content)}</code></pre>`}
            </div>
        </div>
    `;

    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.ai-close-btn');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

function escapeHtml(unsafe) {
    return (unsafe || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Run when the page loads
injectExplainButtons();

// Since GitHub uses a lot of dynamic page loads (Turbo), listen for changes
const observer = new MutationObserver(injectExplainButtons);
observer.observe(document.body, { childList: true, subtree: true });

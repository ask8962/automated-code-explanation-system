// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const explainBtn = document.getElementById('explainBtn');
    const codeInput = document.getElementById('codeInput');
    const resultDiv = document.getElementById('result');

    // Automatically grab highlighted text from the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && !tabs[0].url.startsWith('chrome://')) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    func: () => window.getSelection().toString()
                },
                (injectionResults) => {
                    if (injectionResults && injectionResults[0]) {
                        const selectedText = injectionResults[0].result;
                        if (selectedText) {
                            codeInput.value = selectedText;
                        }
                    }
                }
            );
        }
    });

    explainBtn.addEventListener('click', () => {
        const code = codeInput.value.trim();

        if (!code) {
            alert('Please paste some code first!');
            return;
        }

        // Show loading state
        explainBtn.textContent = '⏳ Thinking...';
        explainBtn.disabled = true;
        resultDiv.style.display = 'block';
        resultDiv.textContent = 'Analyzing your code...';

        // Send to background script
        chrome.runtime.sendMessage({
            action: "explainCode",
            code: code
        }, (response) => {
            // Reset button
            explainBtn.textContent = 'Explain Code';
            explainBtn.disabled = false;

            if (response && response.success) {
                // Display result
                if (response.isHtml) {
                    resultDiv.innerHTML = response.explanation;
                } else {
                    resultDiv.textContent = response.explanation;
                }
            } else {
                resultDiv.textContent = 'Error: ' + (response ? response.error : 'Unknown error occurred.');
                resultDiv.style.color = '#ef4444'; // Red-500
            }
        });
    });
});

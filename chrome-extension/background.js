// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "explainCode") {

        console.log("Background Script received code:", request.code);

        // Use the live production Next.js API URL
        const apiUrl = 'https://gla-code-aa.vercel.app/api/explain';
        // const apiUrl = 'http://localhost:3000/api/explain'; // Uncomment this line if you want to test locally again

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: request.code,
                language: request.language || "python", // Best guess or passed down
                mode: "explain"
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Generate Rich HTML matching the Next.js UI aesthetic
                let htmlOutput = `
                    <div class="ai-overview-card">
                        <h4>🎯 Overview</h4>
                        <p>${data.overview || 'No overview provided.'}</p>
                    </div>
                `;

                if (data.steps && data.steps.length > 0) {
                    htmlOutput += `<div class="ai-steps-container"><h4>🪜 Execution Steps</h4>`;
                    data.steps.forEach((step, index) => {
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
                    data.keyConcepts.forEach(concept => {
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
                        <h4>⚡ Complexity</h4>
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

                // Send the HTML explanation back
                sendResponse({ success: true, explanation: htmlOutput, isHtml: true });
            })
            .catch(error => {
                console.error('Error fetching from Next.js backend:', error);
                sendResponse({ success: false, error: error.message });
            });

        // Return true to indicate we will send a response asynchronously
        return true;
    }
});

// Immediately inject both styles
const immediateStyle = document.createElement('style');
immediateStyle.textContent = `
    body { filter: blur(5px) !important; }
    .content-blur { 
        filter: blur(5px) !important;
        display: inline-block;
    }
`;
(document.head || document.documentElement).appendChild(immediateStyle);

let isInitialized = false;

// Simplified blur function with case insensitive comparison
function blurContent(words) {
    if (!words?.length || !document.body) return;
    
    const elements = document.body.getElementsByTagName('*');
    for (const element of elements) {
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
            const text = element.textContent.toLowerCase();
            if (words.some(word => text.includes(word.toLowerCase()))) {
                const span = document.createElement('span');
                span.textContent = element.textContent;
                span.className = 'content-blur';
                element.replaceWith(span);
            }
        }
    }
    
    // Remove only the body blur, keep element-specific blurs
    immediateStyle.textContent = `
        .content-blur { 
            filter: blur(5px) !important;
            display: inline-block;
        }
    `;
}

// Initialize
async function initialize() {
    if (isInitialized) return;
    
    try {
        const result = await chrome.storage.sync.get('blurWords');
        const words = result.blurWords || [];
        
        // Initial blur
        blurContent(words);
        
        // Observer for dynamic content
        const observer = new MutationObserver(() => blurContent(words));
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        isInitialized = true;
    } catch (error) {
        console.error('Blur initialization error:', error);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Listen for updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateBlurs') {
        blurContent(request.words);
    }
}); 
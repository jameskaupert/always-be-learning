// Check storage and manage blur immediately
(async function() {
    try {
        const result = await chrome.storage.sync.get('blurWords');
        const words = result.blurWords || [];
        if (words.length === 0) {
            const style = document.createElement('style');
            style.textContent = `
                body { filter: none !important; }
                .content-blur { 
                    filter: blur(5px) !important;
                    display: inline-block;
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        }
    } catch (error) {
        console.error('Initial blur check error:', error);
    }
})();

let isInitialized = false;
let debounceTimeout;
let patterns = []; // Store compiled RegExp patterns

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compilePatterns(words) {
    return words.map(word => {
        const escapedWord = escapeRegExp(word);
        return new RegExp(`\\b${escapedWord}\\b`, 'i');
    });
}

function blurContent(words) {
    if (!words?.length) {
        const style = document.createElement('style');
        style.textContent = `
            body { filter: none !important; }
        `;
        (document.head || document.documentElement).appendChild(style);
        return;
    }
    
    // Only compile patterns if words have changed
    if (patterns.length !== words.length) {
        patterns = compilePatterns(words);
    }
    
    const elements = document.body.getElementsByTagName('*');
    for (const element of elements) {
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
            const text = element.textContent;
            if (patterns.some(pattern => pattern.test(text))) {
                const span = document.createElement('span');
                span.textContent = element.textContent;
                span.className = 'content-blur';
                element.replaceWith(span);
            }
        }
    }
    
    const style = document.createElement('style');
    style.textContent = `
        body { filter: none !important; }
    `;
    (document.head || document.documentElement).appendChild(style);
}

async function initialize() {
    if (isInitialized) return;
    
    try {
        const result = await chrome.storage.sync.get('blurWords');
        const words = result.blurWords || [];
        
        // Compile patterns once at initialization
        patterns = compilePatterns(words);
        
        // Initial blur
        blurContent(words);
        
        // Debounced observer
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => blurContent(words), 100);
        });

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
        // Recompile patterns when words are updated
        patterns = compilePatterns(request.words);
        blurContent(request.words);
    }
}); 
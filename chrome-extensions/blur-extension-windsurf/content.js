console.log('[BLUR-EXTENSION] Content script starting...');

// Add style to hide content initially
const style = document.createElement('style');
style.id = 'blur-extension-initial-hide';
style.textContent = `
    body {
        visibility: hidden !important;
    }
    body.blur-extension-ready {
        visibility: visible !important;
    }
`;
document.documentElement.appendChild(style);

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    console.log('[BLUR-EXTENSION] Document still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', initializeBlurrer);
} else {
    console.log('[BLUR-EXTENSION] Document already loaded, initializing immediately');
    initializeBlurrer();
}

async function initializeBlurrer() {
    console.log('[BLUR-EXTENSION] Starting initialization');
    
    try {
        // Initialize the blurrer
        window.blurrer = new TextBlurrer();
        console.log('[BLUR-EXTENSION] TextBlurrer instance created');
        
        // Initialize and process page
        await window.blurrer.initialize();
        console.log('[BLUR-EXTENSION] TextBlurrer initialization complete');

        // Show the page now that initial processing is done
        document.body.classList.add('blur-extension-ready');
        const initialHideStyle = document.getElementById('blur-extension-initial-hide');
        if (initialHideStyle) {
            initialHideStyle.remove();
        }

        // Listen for updates to the sensitive words list
        chrome.storage.onChanged.addListener(async (changes, namespace) => {
            if (!changes.sensitiveWords) return;
            
            console.log('[BLUR-EXTENSION] Storage changes detected:', changes);
            const oldWords = changes.sensitiveWords.oldValue || [];
            const newWords = changes.sensitiveWords.newValue || [];
            
            console.log('[BLUR-EXTENSION] Words changed:', {
                removed: oldWords.filter(w => !newWords.includes(w)),
                added: newWords.filter(w => !oldWords.includes(w)),
                total: newWords.length
            });

            try {
                if (window.blurrer) {
                    console.log('[BLUR-EXTENSION] Updating words and reprocessing page');
                    window.blurrer.sensitiveWords = new Set(newWords);
                    await window.blurrer.processExistingContent();
                    console.log('[BLUR-EXTENSION] Page reprocessing complete');
                } else {
                    console.error('[BLUR-EXTENSION] Blurrer instance not found!');
                }
            } catch (error) {
                console.error('[BLUR-EXTENSION] Error handling storage change:', error);
            }
        });
    } catch (error) {
        console.error('[BLUR-EXTENSION] Error during initialization:', error);
        // Show the page even if there's an error to prevent permanent hiding
        document.body.classList.add('blur-extension-ready');
    }
}
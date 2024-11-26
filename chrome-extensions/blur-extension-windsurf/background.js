// Initialize storage with empty array if not exists
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Extension installed/updated');
    const result = await chrome.storage.local.get('sensitiveWords');
    console.log('Initial storage state:', result);
    if (!result.sensitiveWords) {
        console.log('Initializing sensitiveWords array');
        await chrome.storage.local.set({ sensitiveWords: [] });
        const verify = await chrome.storage.local.get('sensitiveWords');
        console.log('Storage initialized with:', verify);
    }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    if (request.type === 'ADD_WORD') {
        handleAddWord(request.word).then(response => {
            console.log('Add word response:', response);
            sendResponse(response);
        });
        return true;
    } else if (request.type === 'REMOVE_WORD') {
        handleRemoveWord(request.hash).then(response => {
            console.log('Remove word response:', response);
            sendResponse(response);
        });
        return true;
    } else if (request.type === 'GET_WORD_HASHES') {
        handleGetWordHashes().then(response => {
            console.log('Get word hashes response:', response);
            sendResponse(response);
        });
        return true;
    }
});

async function handleAddWord(word) {
    console.log('Adding word:', word);
    try {
        const result = await chrome.storage.local.get('sensitiveWords');
        const words = result.sensitiveWords || [];
        console.log('Current words in storage:', words);
        
        // Don't add if word already exists
        if (!words.includes(word)) {
            words.push(word);
            await chrome.storage.local.set({ sensitiveWords: words });
            const verify = await chrome.storage.local.get('sensitiveWords');
            console.log('Updated storage with words:', verify.sensitiveWords);
        } else {
            console.log('Word already exists in storage');
        }
        
        // Return only the hash of the word
        const hash = await hashWord(word);
        return { success: true, hash };
    } catch (error) {
        console.error('Error adding word:', error);
        return { success: false, error: error.message };
    }
}

async function handleRemoveWord(hash) {
    console.log('Removing word with hash:', hash);
    try {
        const result = await chrome.storage.local.get('sensitiveWords');
        const words = result.sensitiveWords || [];
        console.log('Current words:', words);
        
        // Find and remove the word that matches the hash
        const updatedWords = [];
        for (const word of words) {
            const wordHash = await hashWord(word);
            if (wordHash !== hash) {
                updatedWords.push(word);
            }
        }
        
        await chrome.storage.local.set({ sensitiveWords: updatedWords });
        console.log('Updated words:', updatedWords);
        return { success: true };
    } catch (error) {
        console.error('Error removing word:', error);
        return { success: false, error: error.message };
    }
}

async function handleGetWordHashes() {
    console.log('Getting word hashes');
    try {
        const result = await chrome.storage.local.get('sensitiveWords');
        const words = result.sensitiveWords || [];
        console.log('Current words:', words);
        
        // Return only the hashes of the words
        const hashes = await Promise.all(words.map(word => hashWord(word)));
        console.log('Word hashes:', hashes);
        return { success: true, hashes };
    } catch (error) {
        console.error('Error getting word hashes:', error);
        return { success: false, error: error.message };
    }
}

async function hashWord(word) {
    const encoder = new TextEncoder();
    const data = encoder.encode(word);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

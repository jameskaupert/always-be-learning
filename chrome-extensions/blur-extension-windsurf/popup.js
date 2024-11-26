document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const addButton = document.getElementById('addWord');
    const wordList = document.getElementById('wordList');
    const status = document.getElementById('status');

    // Load existing word hashes
    loadWordHashes();

    // Add word handler
    addButton.addEventListener('click', async () => {
        const word = wordInput.value.trim();
        if (!word) {
            updateStatus('Please enter a word');
            return;
        }

        console.log('Adding word:', word);
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'ADD_WORD',
                word: word
            });
            console.log('Add word response:', response);

            if (response.success) {
                wordInput.value = '';
                await loadWordHashes();
                updateStatus('Word added successfully');
            } else {
                updateStatus('Error adding word: ' + response.error);
            }
        } catch (error) {
            console.error('Error adding word:', error);
            updateStatus('Error adding word: ' + error.message);
        }
    });

    // Handle enter key in input
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });

    // Clear input on focus
    wordInput.addEventListener('focus', () => {
        wordInput.value = '';
    });
});

async function loadWordHashes() {
    console.log('Loading word hashes');
    try {
        const response = await chrome.runtime.sendMessage({
            type: 'GET_WORD_HASHES'
        });
        console.log('Get word hashes response:', response);

        if (response.success) {
            displayWordHashes(response.hashes);
        } else {
            updateStatus('Error loading word hashes: ' + response.error);
        }
    } catch (error) {
        console.error('Error loading word hashes:', error);
        updateStatus('Error loading word hashes: ' + error.message);
    }
}

function displayWordHashes(hashes) {
    console.log('Displaying hashes:', hashes);
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';

    hashes.forEach(hash => {
        const item = document.createElement('div');
        item.className = 'word-item';
        
        const hashDisplay = document.createElement('span');
        // Only show first and last 4 characters of the hash
        hashDisplay.textContent = `${hash.substring(0, 4)}...${hash.substring(hash.length - 4)}`;
        
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-btn';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeWord(hash));
        
        item.appendChild(hashDisplay);
        item.appendChild(removeButton);
        wordList.appendChild(item);
    });
}

async function removeWord(hash) {
    console.log('Removing word with hash:', hash);
    try {
        const response = await chrome.runtime.sendMessage({
            type: 'REMOVE_WORD',
            hash
        });
        console.log('Remove word response:', response);

        if (response.success) {
            await loadWordHashes();
            updateStatus('Word removed successfully');
        } else {
            updateStatus('Error removing word: ' + response.error);
        }
    } catch (error) {
        console.error('Error removing word:', error);
        updateStatus('Error removing word: ' + error.message);
    }
}

function updateStatus(message) {
    console.log('Status update:', message);
    const status = document.getElementById('status');
    status.textContent = message;
    setTimeout(() => {
        status.textContent = '';
    }, 3000);
}

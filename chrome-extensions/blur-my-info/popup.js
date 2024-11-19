document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('blurForm');
  const blurList = document.getElementById('blurList');
  const clearAll = document.getElementById('clearAll');

  // Load and display existing blur words
  async function loadBlurWords() {
    const result = await chrome.storage.sync.get('blurWords');
    const words = result.blurWords || [];
    
    blurList.innerHTML = words.map(word => `
      <div class="blur-item">
        <span>${word}</span>
        <button class="remove" data-word="${word}">Remove</button>
      </div>
    `).join('');
  }

  // Safely send message to active tab
  async function updateActiveTab(words) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        // Wrap in try/catch as the tab might not be ready for messages
        try {
          await chrome.tabs.sendMessage(tab.id, { 
            action: 'updateBlurs',
            words: words
          });
        } catch (e) {
          console.log('Tab not ready for messages, but storage was updated');
        }
      }
    } catch (e) {
      console.error('Error updating active tab:', e);
    }
  }

  // Initial load
  await loadBlurWords();

  // Add new word
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('textToBlur');
    const word = input.value.trim();
    
    if (!word) return;

    const result = await chrome.storage.sync.get('blurWords');
    const words = result.blurWords || [];
    
    if (!words.includes(word)) {
      words.push(word);
      await chrome.storage.sync.set({ blurWords: words });
      await updateActiveTab(words);
      
      input.value = '';
      await loadBlurWords();
    }
  });

  // Remove word
  blurList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('remove')) {
      const wordToRemove = e.target.dataset.word;
      const result = await chrome.storage.sync.get('blurWords');
      const words = result.blurWords.filter(w => w !== wordToRemove);
      
      await chrome.storage.sync.set({ blurWords: words });
      await updateActiveTab(words);
      await loadBlurWords();
    }
  });

  // Clear all
  clearAll.addEventListener('click', async () => {
    await chrome.storage.sync.set({ blurWords: [] });
    await updateActiveTab([]);
    await loadBlurWords();
  });
}); 
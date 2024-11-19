document.addEventListener('DOMContentLoaded', async () => {
	const form = document.getElementById('blurForm');
	const blurList = document.getElementById('blurList');
	const toggleList = document.getElementById('toggleList');
	const hideList = document.getElementById('hideList');
	const listSection = document.getElementById('listSection');
	const exportList = document.getElementById('exportList');
	const importList = document.getElementById('importList');
	
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
			
			// Update content script
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			if (tab?.id) {
				chrome.tabs.sendMessage(tab.id, { 
					action: 'updateBlurs',
					words: words
				});
			}
			
			input.value = '';
			
			// Only update list if it's visible
			if (!listSection.classList.contains('hidden')) {
				await loadBlurWords();
			}
		}
	});

	// Toggle list visibility
	toggleList.addEventListener('click', async () => {
		listSection.classList.remove('hidden');
		toggleList.classList.add('hidden');
		await loadBlurWords();
	});

	hideList.addEventListener('click', () => {
		listSection.classList.add('hidden');
		toggleList.classList.remove('hidden');
	});

	// Load and display words
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

	// Remove word
	blurList.addEventListener('click', async (e) => {
		if (e.target.classList.contains('remove')) {
			const wordToRemove = e.target.dataset.word;
			const result = await chrome.storage.sync.get('blurWords');
			const words = result.blurWords.filter(w => w !== wordToRemove);
			
			await chrome.storage.sync.set({ blurWords: words });
			
			// Update content script
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			if (tab?.id) {
				chrome.tabs.sendMessage(tab.id, { 
					action: 'updateBlurs',
					words: words
				});
			}
			
			await loadBlurWords();
		}
	});

	// Export functionality
	exportList.addEventListener('click', async () => {
		try {
			const result = await chrome.storage.sync.get('blurWords');
			const words = result.blurWords || [];
			
			// Create blob and download
			const blob = new Blob([JSON.stringify({ blurWords: words }, null, 2)], 
				{ type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'blur-words.json';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error exporting words:', error);
		}
	});

	// Import functionality
	importList.addEventListener('click', () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		
		input.onchange = async (e) => {
			try {
				const file = e.target.files[0];
				const text = await file.text();
				const data = JSON.parse(text);
				
				if (!data.blurWords || !Array.isArray(data.blurWords)) {
					throw new Error('Invalid file format');
				}

				// Update storage
				await chrome.storage.sync.set({ blurWords: data.blurWords });
				
				// Update content script
				const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
				if (tab?.id) {
					chrome.tabs.sendMessage(tab.id, { 
						action: 'updateBlurs',
						words: data.blurWords
					});
				}
				
				// Update list if visible
				if (!listSection.classList.contains('hidden')) {
					await loadBlurWords();
				}
			} catch (error) {
				console.error('Error importing words:', error);
				alert('Error importing file. Please ensure it\'s a valid blur-words.json file.');
			}
		};
		
		input.click();
	});
}); 
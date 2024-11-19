document.getElementById('apply-blur').addEventListener('click', () => {
    const textToBlur = document.getElementById('blur-text').value
        .split('\n')
        .filter(line => line.trim() !== '');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'blur-text',
            texts: textToBlur
        });
    });
});

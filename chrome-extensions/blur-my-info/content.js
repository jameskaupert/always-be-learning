chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'blur-text') {
        request.texts.forEach(text => {
            const xpath = `//*[contains(text(), "${text}")]`;
            const matchingElements = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null
            );

            for (let i = 0; i < matchingElements.snapshotLength; i++) {
                const element = matchingElements.snapshotItem(i);
                const parent = element.parentNode;
                const textContent = element.textContent;

                // Replace text with blurred version
                const blurredSpan = document.createElement('span');
                blurredSpan.style.filter = 'blur(5px)';
                blurredSpan.textContent = textContent;

                parent.replaceChild(blurredSpan, element);
            }
        });
    }
});

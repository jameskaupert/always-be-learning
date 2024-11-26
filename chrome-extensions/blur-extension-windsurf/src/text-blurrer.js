class TextBlurrer {
    constructor() {
        this._sensitiveWords = new Set();
        this._wordRegexes = new Map(); // Cache for compiled regexes
        this.observer = null;
        this.isProcessing = false;
        console.log('[BLUR-EXTENSION] TextBlurrer constructed');
    }

    // Getter/setter for sensitiveWords to maintain regex cache
    get sensitiveWords() {
        return this._sensitiveWords;
    }

    set sensitiveWords(words) {
        this._sensitiveWords = new Set(words);
        this._wordRegexes.clear();
        // Pre-compile regexes for all words
        for (const word of this._sensitiveWords) {
            if (!word) continue;
            this._wordRegexes.set(word, new RegExp(`\\b${this.escapeRegExp(word)}\\b`, 'gi'));
        }
    }

    async initialize() {
        console.log('[BLUR-EXTENSION] TextBlurrer initializing');
        await this.loadSensitiveWords();
        await this.processExistingContent();
        this.setupObserver();
        console.log('[BLUR-EXTENSION] TextBlurrer initialization complete');
    }

    async loadSensitiveWords() {
        console.log('[BLUR-EXTENSION] Loading sensitive words');
        try {
            const result = await chrome.storage.local.get('sensitiveWords');
            console.log('[BLUR-EXTENSION] Storage get result:', result);
            
            if (result.sensitiveWords) {
                this.sensitiveWords = new Set(result.sensitiveWords);
                console.log('[BLUR-EXTENSION] Loaded sensitive words:', Array.from(this._sensitiveWords));
            } else {
                console.log('[BLUR-EXTENSION] No sensitive words found in storage');
                this.sensitiveWords = new Set();
            }
        } catch (error) {
            console.error('[BLUR-EXTENSION] Error loading sensitive words:', error);
            this.sensitiveWords = new Set();
        }
    }

    setupObserver() {
        if (this.observer) {
            this.observer.disconnect();
        }

        // Create a throttled version of processExistingContent
        let timeout = null;
        const throttledProcess = () => {
            if (timeout) return;
            timeout = setTimeout(() => {
                this.processExistingContent();
                timeout = null;
            }, 100);
        };

        this.observer = new MutationObserver((mutations) => {
            if (this.isProcessing) return;

            let shouldProcess = false;
            for (const mutation of mutations) {
                // Skip our own changes
                if (mutation.target.classList?.contains('secure-blur') ||
                    mutation.target.closest?.('.secure-blur')) {
                    continue;
                }
                
                // Check if this is a relevant change
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                    break;
                }
            }

            if (shouldProcess) {
                throttledProcess();
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('[BLUR-EXTENSION] MutationObserver setup complete');
    }

    async processExistingContent() {
        if (this.isProcessing || !this._sensitiveWords.size) return;
        
        console.log('[BLUR-EXTENSION] Processing page content');
        this.isProcessing = true;

        try {
            const nodes = [];
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                        
                        const parent = node.parentNode;
                        if (!parent) return NodeFilter.FILTER_REJECT;

                        // Skip nodes that are already blurred or inside script/style
                        if (parent.classList?.contains('secure-blur') ||
                            parent.closest?.('.secure-blur') ||
                            parent.tagName === 'SCRIPT' ||
                            parent.tagName === 'STYLE' ||
                            parent.tagName === 'NOSCRIPT') {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // Skip if text looks like HTML
                        if (/<[^>]*>/g.test(node.textContent)) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            // Collect all nodes first
            let node;
            while (node = walker.nextNode()) {
                nodes.push(node);
            }

            console.log(`[BLUR-EXTENSION] Found ${nodes.length} text nodes to process`);

            // Process nodes in chunks to avoid blocking the UI
            const chunkSize = 100;
            for (let i = 0; i < nodes.length; i += chunkSize) {
                const chunk = nodes.slice(i, i + chunkSize);
                await Promise.all(chunk.map(node => this.processTextNode(node)));
                
                // Small delay to allow UI updates
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            console.log('[BLUR-EXTENSION] Finished processing all text nodes');
        } catch (error) {
            console.error('[BLUR-EXTENSION] Error processing content:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    processTextNode(node) {
        if (!node || !node.textContent || !node.parentNode) return;
        
        const text = node.textContent;
        if (!text.trim()) return;

        // Find all matches for all words at once using pre-compiled regexes
        let matches = [];
        for (const [word, regex] of this._wordRegexes) {
            regex.lastIndex = 0; // Reset regex state
            let match;
            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    word,
                    start: match.index,
                    end: match.index + match[0].length,
                    matchedText: match[0]
                });
            }
        }

        if (matches.length > 0) {
            matches.sort((a, b) => a.start - b.start);
            
            try {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                matches.forEach(match => {
                    // Add text before match
                    if (match.start > lastIndex) {
                        fragment.appendChild(
                            document.createTextNode(text.slice(lastIndex, match.start))
                        );
                    }

                    // Create blur span
                    const span = document.createElement('span');
                    span.textContent = match.matchedText;
                    span.className = 'secure-blur';
                    span.setAttribute('data-word', match.word);
                    fragment.appendChild(span);

                    lastIndex = match.end;
                });

                // Add remaining text
                if (lastIndex < text.length) {
                    fragment.appendChild(
                        document.createTextNode(text.slice(lastIndex))
                    );
                }

                node.parentNode.replaceChild(fragment, node);
            } catch (error) {
                console.error('[BLUR-EXTENSION] Error processing text node:', error);
            }
        }
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Make TextBlurrer available globally
window.TextBlurrer = TextBlurrer;

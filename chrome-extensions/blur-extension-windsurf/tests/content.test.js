const TextBlurrer = require('../src/text-blurrer');

// Mock chrome.storage.local
const mockStorage = {
    sensitiveWords: []
};

global.chrome = {
    storage: {
        local: {
            get: jest.fn((key) => Promise.resolve({ [key]: mockStorage[key] })),
            set: jest.fn((obj) => {
                Object.assign(mockStorage, obj);
                return Promise.resolve();
            })
        }
    }
};

// Mock DOM APIs
global.Node = {
    TEXT_NODE: 3,
    ELEMENT_NODE: 1
};

global.NodeFilter = {
    SHOW_TEXT: 4
};

describe('TextBlurrer', () => {
    let blurrer;
    
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Setup DOM environment
        document.body = document.createElement('body');
        
        // Reset storage
        mockStorage.sensitiveWords = [];
        
        // Create new blurrer instance
        blurrer = new TextBlurrer();
    });
    
    afterEach(() => {
        if (blurrer.observer) {
            blurrer.disconnect();
        }
    });
    
    test('initialize loads sensitive words from storage', async () => {
        // Arrange
        mockStorage.sensitiveWords = ['test', 'secret'];
        
        // Act
        await blurrer.initialize();
        
        // Assert
        expect(chrome.storage.local.get).toHaveBeenCalledWith('sensitiveWords');
        expect(blurrer.sensitiveWords.size).toBe(2);
        expect(blurrer.sensitiveWords.has('test')).toBe(true);
        expect(blurrer.sensitiveWords.has('secret')).toBe(true);
    });
    
    test('processTextNode blurs sensitive content', () => {
        // Arrange
        const span = document.createElement('span');
        const textNode = document.createTextNode('This is a secret message');
        span.appendChild(textNode);
        document.body.appendChild(span);
        blurrer.sensitiveWords.add('secret');
        
        // Act
        blurrer.processTextNode(textNode);
        
        // Assert
        const blurredSpan = document.body.querySelector('.secure-blur');
        expect(blurredSpan).not.toBeNull();
        expect(blurredSpan.textContent).toBe('This is a secret message');
    });
    
    test('processTextNode does not blur non-sensitive content', () => {
        // Arrange
        const span = document.createElement('span');
        const textNode = document.createTextNode('This is a normal message');
        span.appendChild(textNode);
        document.body.appendChild(span);
        blurrer.sensitiveWords.add('secret');
        
        // Act
        blurrer.processTextNode(textNode);
        
        // Assert
        const blurredSpan = document.body.querySelector('.secure-blur');
        expect(blurredSpan).toBeNull();
    });
    
    test('processTextNode matches whole words only', () => {
        // Arrange
        const span = document.createElement('span');
        const textNode = document.createTextNode('secretive');
        span.appendChild(textNode);
        document.body.appendChild(span);
        blurrer.sensitiveWords.add('secret');
        
        // Act
        blurrer.processTextNode(textNode);
        
        // Assert
        const blurredSpan = document.body.querySelector('.secure-blur');
        expect(blurredSpan).toBeNull();
    });
    
    test('mutation observer catches dynamic content', () => {
        // Arrange
        blurrer.sensitiveWords.add('secret');
        blurrer.setupMutationObserver();
        
        // Create a text node with sensitive content
        const div = document.createElement('div');
        const textNode = document.createTextNode('This is a secret message');
        div.appendChild(textNode);
        document.body.appendChild(div);
        
        // Act - Simulate mutation
        blurrer.observer._trigger([{
            type: 'childList',
            target: div,
            addedNodes: [div],
            removedNodes: []
        }]);
        
        // Assert
        const blurredSpan = document.body.querySelector('.secure-blur');
        expect(blurredSpan).not.toBeNull();
        expect(blurredSpan.textContent).toBe('This is a secret message');
    });
});

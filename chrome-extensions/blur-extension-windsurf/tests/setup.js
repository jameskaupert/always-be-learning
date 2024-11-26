// Mock MutationObserver
global.MutationObserver = class {
    constructor(callback) {
        this.callback = callback;
    }

    observe(element, options) {
        this.element = element;
        this.options = options;
    }

    disconnect() {}

    // Helper method for tests to trigger mutations
    _trigger(mutations) {
        this.callback(mutations);
    }
};

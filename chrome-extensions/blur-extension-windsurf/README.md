# Secure Text Blur Chrome Extension

A Chrome extension that securely blurs sensitive words on web pages before they are rendered. Perfect for live streaming or screen sharing while protecting sensitive information.

## Features

- Blur sensitive words before they are rendered in the browser
- Secure management of sensitive words using cryptographic hashes
- Real-time updates when adding or removing words
- Works with dynamically loaded content
- Password-protected input for adding new words
- No plaintext storage of sensitive words in the UI

## Security Features

1. Words are never displayed in the extension popup
2. Input field is password-protected to prevent shoulder surfing
3. Only cryptographic hashes are shown in the UI
4. Words are blurred before rendering using CSS
5. Mutation observers catch dynamically loaded content
6. Whole-word matching prevents partial matches

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open Chrome and navigate to `chrome://extensions`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extension directory

## Development

### Running Tests
```bash
npm test
```

### Building for Production
1. Make sure all tests pass
2. Zip the contents of the extension directory
3. Submit to Chrome Web Store

## How it Works

1. The extension maintains a list of sensitive words in Chrome's local storage
2. When a word is added:
   - It's immediately stored in the background
   - The content script is notified to update its word list
   - Only a hash of the word is displayed in the UI
3. The content script:
   - Scans all text nodes for sensitive words
   - Uses mutation observers to catch dynamic content
   - Applies CSS blur effect to matching text
4. When removing a word:
   - The hash is used to identify the word
   - The word is removed from storage
   - All pages are updated to remove the blur effect

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT

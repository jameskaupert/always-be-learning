# TV Show Explorer

A lightweight web application that lets users discover TV series at a glance and dive deep when curiosity strikes. Features a sleek hero search bar and two dynamic, scroll-snappable carousels showcasing trending and popular shows.

## Features

- **Hero Search Bar**: Real-time search with instant results
- **Dynamic Carousels**: Trending Today and Most Popular shows with smooth scroll-snap behavior
- **Rich Detail Views**: Comprehensive show information including:
  - Ratings and synopsis
  - Cast information with photos
  - Seasons and episode counts
  - Streaming provider availability
  - Similar show recommendations
- **TV-Friendly Design**: Large fonts and high contrast for optimal viewing on large screens
- **Responsive Layout**: Works on desktop, tablet, and mobile devices

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

## Environment Setup

The application uses environment variables for secure configuration:

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables** in `.env`:
   ```bash
   # TMDb API Configuration
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_USE_MOCK_DATA=false
   ```

## Switching to Real TMDb Data

1. **Get a TMDb API key**:
   - Visit [The Movie Database (TMDb)](https://www.themoviedb.org/settings/api)
   - Sign up for an account and request an API key

2. **Update your `.env` file**:
   ```bash
   VITE_TMDB_API_KEY=your_actual_api_key_here
   VITE_USE_MOCK_DATA=false
   ```

3. **Restart the development server**:
   ```bash
   npm run dev
   ```

4. **That's it!** The application will now fetch real data from TMDb.

### Security Features

- ✅ **Environment Variables**: API keys are never committed to version control
- ✅ **Build-time Injection**: Variables are securely injected during the build process
- ✅ **Automatic Fallback**: Uses mock data when no API key is provided
- ✅ **Template File**: `.env.example` shows required variables without exposing secrets

## Project Structure

```
tv-joy/
├── index.html          # Main HTML structure
├── styles.css          # TV-friendly CSS with large fonts and high contrast
├── main.js             # Main application logic and UI interactions
├── api.js              # TMDb API integration with mock data fallback
├── package.json        # Project dependencies and scripts
├── vite.config.js      # Vite build configuration
└── README.md           # This file
```

## Key Components

### Search Functionality
- Real-time search with debouncing
- Displays results in a scrollable carousel format
- Handles empty search results gracefully

### Carousel Navigation
- Smooth scroll-snap behavior
- Mouse wheel support for horizontal scrolling
- Touch-friendly drag scrolling
- Responsive grid layout

### Show Details
- Full-screen overlay with comprehensive information
- Back navigation to return to main view
- Cast grid with actor photos and character names
- Season breakdown with episode counts
- Similar shows recommendations

### Error Handling
- Loading states with animated spinners
- Error messages for failed API calls
- Graceful fallbacks for missing data

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see the LICENSE file for details.
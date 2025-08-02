import TMDbAPI from './api.js';

class TVShowExplorer {
  constructor() {
    this.api = new TMDbAPI();
    this.currentShow = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadCarousels();
  }

  bindEvents() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const backBtn = document.getElementById('back-btn');

    searchBtn.addEventListener('click', () => this.handleSearch());
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });

    searchInput.addEventListener('input', (e) => {
      if (e.target.value.length > 2) {
        this.debounce(() => this.handleSearch(), 300);
      }
    });

    backBtn.addEventListener('click', () => this.showLandingPage());
  }

  debounce(func, wait) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, wait);
  }

  async loadCarousels() {
    try {
      this.showLoadingState();
      
      const [trendingData, popularData] = await Promise.all([
        this.api.getTrending(),
        this.api.getPopular()
      ]);

      this.renderCarousel('trending-carousel', trendingData.results, 'Trending Today');
      this.renderCarousel('popular-carousel', popularData.results, 'Most Popular');
      
      this.hideLoadingState();
    } catch (error) {
      console.error('Error loading carousels:', error);
      this.showErrorState();
    }
  }

  renderCarousel(carouselId, shows, title) {
    const carousel = document.getElementById(carouselId);
    const track = carousel.querySelector('.carousel-track');
    
    track.innerHTML = '';
    
    shows.forEach(show => {
      const card = this.createShowCard(show);
      track.appendChild(card);
    });

    this.addCarouselScrollFunctionality(carousel);
  }

  createShowCard(show) {
    const card = document.createElement('div');
    card.className = 'show-card';
    card.dataset.showId = show.id;
    
    card.innerHTML = `
      <img class="show-poster" src="${show.poster_path}" alt="${show.name}" loading="lazy">
      <div class="show-info">
        <h3 class="show-title">${show.name}</h3>
        <div class="show-rating">★ ${show.vote_average}</div>
      </div>
    `;

    card.addEventListener('click', () => this.showDetails(show.id));
    
    return card;
  }

  addCarouselScrollFunctionality(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.querySelector('.carousel-nav.prev');
    const nextBtn = carousel.querySelector('.carousel-nav.next');
    
    // Calculate scroll amount (width of one card + gap)
    const cardWidth = 300 + 32; // card width + gap
    const scrollAmount = cardWidth * 3; // Scroll 3 cards at a time
    
    // Navigation button functionality
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    // Update button states based on scroll position
    const updateButtonStates = () => {
      const isAtStart = track.scrollLeft <= 0;
      const isAtEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 10;
      
      prevBtn.disabled = isAtStart;
      nextBtn.disabled = isAtEnd;
    };
    
    // Initial button state
    updateButtonStates();
    
    // Update button states on scroll
    track.addEventListener('scroll', updateButtonStates);
    
    // Existing drag functionality
    let isScrolling = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isScrolling = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('mouseleave', () => {
      isScrolling = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', () => {
      isScrolling = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isScrolling) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2;
      track.scrollLeft = scrollLeft - walk;
    });

    track.addEventListener('wheel', (e) => {
      e.preventDefault();
      track.scrollLeft += e.deltaY;
      updateButtonStates();
    });
  }

  async handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (!query) return;

    try {
      this.showLoadingState();
      const searchResults = await this.api.searchShows(query);
      
      if (searchResults.results.length > 0) {
        this.renderSearchResults(searchResults.results, query);
      } else {
        this.showNoResults(query);
      }
      
      this.hideLoadingState();
    } catch (error) {
      console.error('Search error:', error);
      this.showErrorState();
    }
  }

  renderSearchResults(results, query) {
    const trendingSection = document.querySelector('.carousel-section');
    const popularSection = document.querySelectorAll('.carousel-section')[1];
    
    trendingSection.style.display = 'none';
    popularSection.style.display = 'none';

    let searchSection = document.getElementById('search-results');
    if (!searchSection) {
      searchSection = document.createElement('section');
      searchSection.id = 'search-results';
      searchSection.className = 'carousel-section';
      document.querySelector('.main-content').appendChild(searchSection);
    }

    searchSection.innerHTML = `
      <h2 class="section-title">Search Results for "${query}"</h2>
      <div class="carousel">
        <button class="carousel-nav prev" data-direction="prev">‹</button>
        <div class="carousel-track"></div>
        <button class="carousel-nav next" data-direction="next">›</button>
      </div>
    `;

    const track = searchSection.querySelector('.carousel-track');
    results.forEach(show => {
      const card = this.createShowCard(show);
      track.appendChild(card);
    });

    this.addCarouselScrollFunctionality(searchSection.querySelector('.carousel'));
    searchSection.style.display = 'block';
  }

  showNoResults(query) {
    this.renderSearchResults([], query);
    const searchSection = document.getElementById('search-results');
    searchSection.querySelector('.carousel').innerHTML = `
      <div style="text-align: center; padding: 3rem; font-size: 1.5rem; color: rgba(255,255,255,0.7);">
        No shows found for "${query}". Try a different search term.
      </div>
    `;
  }

  async showDetails(showId) {
    try {
      this.showLoadingState();
      
      const [showDetails, similarShows] = await Promise.all([
        this.api.getShowDetails(showId),
        this.api.getSimilarShows(showId)
      ]);

      if (showDetails) {
        this.currentShow = showDetails;
        this.renderShowDetails(showDetails, similarShows.results);
        this.showDetailPage();
      }
      
      this.hideLoadingState();
    } catch (error) {
      console.error('Error loading show details:', error);
      this.showErrorState();
    }
  }

  renderShowDetails(show, similarShows) {
    const detailView = document.getElementById('show-detail');
    
    document.querySelector('.detail-poster').src = show.poster_path;
    document.querySelector('.detail-poster').alt = show.name;
    document.querySelector('.detail-title').textContent = show.name;
    document.querySelector('.detail-rating').innerHTML = `★ ${show.vote_average}`;
    document.querySelector('.detail-overview').textContent = show.overview;
    document.querySelector('.detail-first-air').textContent = `First aired: ${new Date(show.first_air_date).getFullYear()}`;
    document.querySelector('.detail-genres').textContent = show.genres ? (
      Array.isArray(show.genres) && typeof show.genres[0] === 'object' 
        ? show.genres.map(g => g.name).join(', ')
        : show.genres.join(', ')
    ) : '';
    document.querySelector('.detail-streaming').textContent = show.streaming_providers ? `Available on: ${show.streaming_providers.join(', ')}` : '';

    this.renderCast(show.cast);
    this.renderSeasons(show.seasons);
    this.renderSimilarShows(similarShows);
  }

  renderCast(cast) {
    const castGrid = document.querySelector('.cast-grid');
    castGrid.innerHTML = '';
    
    cast.slice(0, 6).forEach(actor => {
      const castMember = document.createElement('div');
      castMember.className = 'cast-member';
      castMember.innerHTML = `
        <img class="cast-photo" src="${actor.profile_path}" alt="${actor.name}">
        <div class="cast-name">${actor.name}</div>
        <div class="cast-character">${actor.character}</div>
      `;
      castGrid.appendChild(castMember);
    });
  }

  renderSeasons(seasons) {
    const seasonsList = document.querySelector('.seasons-list');
    seasonsList.innerHTML = '';
    
    seasons.forEach(season => {
      const seasonItem = document.createElement('div');
      seasonItem.className = 'season-item';
      seasonItem.innerHTML = `
        <div class="season-title">${season.name}</div>
        <div class="season-info">
          ${season.episode_count} episodes • Aired ${new Date(season.air_date).getFullYear()}
        </div>
      `;
      seasonsList.appendChild(seasonItem);
    });
  }

  renderSimilarShows(similarShows) {
    const similarGrid = document.querySelector('.similar-grid');
    similarGrid.innerHTML = '';
    
    similarShows.slice(0, 6).forEach(show => {
      const similarCard = document.createElement('div');
      similarCard.className = 'show-card';
      similarCard.style.flex = 'none';
      similarCard.innerHTML = `
        <img class="show-poster" src="${show.poster_path}" alt="${show.name}">
        <div class="show-info">
          <h3 class="show-title">${show.name}</h3>
          <div class="show-rating">★ ${show.vote_average}</div>
        </div>
      `;
      similarCard.addEventListener('click', () => this.showDetails(show.id));
      similarGrid.appendChild(similarCard);
    });
  }

  showDetailPage() {
    document.querySelector('.hero-section').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
    document.getElementById('show-detail').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  showLandingPage() {
    document.querySelector('.hero-section').style.display = 'block';
    document.querySelector('.main-content').style.display = 'block';
    document.getElementById('show-detail').classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    const searchSection = document.getElementById('search-results');
    if (searchSection) {
      searchSection.style.display = 'none';
      document.querySelector('.carousel-section').style.display = 'block';
      document.querySelectorAll('.carousel-section')[1].style.display = 'block';
    }
    
    document.getElementById('search-input').value = '';
  }

  showLoadingState() {
    const existingLoader = document.querySelector('.loading-overlay');
    if (!existingLoader) {
      const loader = document.createElement('div');
      loader.className = 'loading-overlay';
      loader.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <div>Loading...</div>
        </div>
      `;
      document.body.appendChild(loader);
      
      const style = document.createElement('style');
      style.textContent = `
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 15, 35, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          backdrop-filter: blur(5px);
        }
        
        .loading-spinner {
          text-align: center;
          color: #4ecdc4;
          font-size: 1.5rem;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(78, 205, 196, 0.3);
          border-top: 4px solid #4ecdc4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  hideLoadingState() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
      loader.remove();
    }
  }

  showErrorState() {
    this.hideLoadingState();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: rgba(255,107,107,0.1); border: 2px solid #ff6b6b; border-radius: 15px; margin: 2rem; backdrop-filter: blur(10px);">
        <h3 style="color: #ff6b6b; font-size: 1.8rem; margin-bottom: 1rem;">Oops! Something went wrong</h3>
        <p style="font-size: 1.2rem; color: rgba(255,255,255,0.8);">Please try again in a moment.</p>
      </div>
    `;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TVShowExplorer();
});
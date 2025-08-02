// Environment variables - these are injected at build time by Vite
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || !import.meta.env.VITE_TMDB_API_KEY;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MOCK_SHOWS = {
  trending: [
    {
      id: 1,
      name: "The Last of Us",
      poster_path: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      vote_average: 8.7,
      first_air_date: "2023-01-15",
      overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.",
      genres: ["Drama", "Action & Adventure", "Sci-Fi & Fantasy"],
      number_of_seasons: 1,
      number_of_episodes: 9,
      cast: [
        { name: "Pedro Pascal", character: "Joel Miller", profile_path: "/9VYqrjUcbYrZkufIqTB9J1fDbFB.jpg" },
        { name: "Bella Ramsey", character: "Ellie Williams", profile_path: "/aD8MaONIFvV3FuHuqjuQHaUhehJ.jpg" },
        { name: "Anna Torv", character: "Tess Servopoulos", profile_path: "/3FUYl1z4j1K9BRDQ4QfUbjHzIwH.jpg" }
      ],
      streaming_providers: ["HBO Max", "Amazon Prime Video"],
      seasons: [
        { season_number: 1, name: "Season 1", episode_count: 9, air_date: "2023-01-15" }
      ]
    },
    {
      id: 2,
      name: "Wednesday",
      poster_path: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
      backdrop_path: "/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
      vote_average: 8.1,
      first_air_date: "2022-11-23",
      overview: "Wednesday Addams is sent to Nevermore Academy, a supernatural boarding school where she attempts to master her psychic powers, stop a monstrous killing spree of the town citizens, and solve the supernatural mystery that embroiled her parents 25 years ago.",
      genres: ["Comedy", "Mystery", "Supernatural"],
      number_of_seasons: 1,
      number_of_episodes: 8,
      cast: [
        { name: "Jenna Ortega", character: "Wednesday Addams", profile_path: "/q1NRzyZQlYkxLY07GO9NVPkQnu8.jpg" },
        { name: "Emma Myers", character: "Enid Sinclair", profile_path: "/xYJOq9FuGfNPBi2DPUYJrbmG6yx.jpg" },
        { name: "Hunter Doohan", character: "Tyler Galpin", profile_path: "/rA9bVFjPD7klZqRG7hOzpSbGzSU.jpg" }
      ],
      streaming_providers: ["Netflix"],
      seasons: [
        { season_number: 1, name: "Season 1", episode_count: 8, air_date: "2022-11-23" }
      ]
    },
    {
      id: 3,
      name: "House of the Dragon",
      poster_path: "/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
      backdrop_path: "/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg",
      vote_average: 8.4,
      first_air_date: "2022-08-21",
      overview: "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne.",
      genres: ["Drama", "Action & Adventure", "Fantasy"],
      number_of_seasons: 2,
      number_of_episodes: 18,
      cast: [
        { name: "Paddy Considine", character: "King Viserys I Targaryen", profile_path: "/cOzDRNiEqJgE7zkVbcJQg9fZBJD.jpg" },
        { name: "Emma D'Arcy", character: "Princess Rhaenyra Targaryen", profile_path: "/xUeCbHJlYKlFeEHC9tG3jPGTkx2.jpg" },
        { name: "Matt Smith", character: "Prince Daemon Targaryen", profile_path: "/1KSVIsBphjSVNQiUVwT1CxqHAZ6.jpg" }
      ],
      streaming_providers: ["HBO Max", "Amazon Prime Video"],
      seasons: [
        { season_number: 1, name: "Season 1", episode_count: 10, air_date: "2022-08-21" },
        { season_number: 2, name: "Season 2", episode_count: 8, air_date: "2024-06-16" }
      ]
    },
    {
      id: 4,
      name: "Stranger Things",
      poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      vote_average: 8.7,
      first_air_date: "2016-07-15",
      overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
      genres: ["Drama", "Sci-Fi & Fantasy", "Horror"],
      number_of_seasons: 4,
      number_of_episodes: 42,
      cast: [
        { name: "Millie Bobby Brown", character: "Eleven", profile_path: "/A33BILnqj4HjZcWeCwK0RLpGPz.jpg" },
        { name: "Finn Wolfhard", character: "Mike Wheeler", profile_path: "/cyCN1OuBxzKUOcrpJYfX7B1epTg.jpg" },
        { name: "David Harbour", character: "Jim Hopper", profile_path: "/djHyQGhPP8TKtM2Xrt6LLxBLs8x.jpg" }
      ],
      streaming_providers: ["Netflix"],
      seasons: [
        { season_number: 1, name: "Season 1", episode_count: 8, air_date: "2016-07-15" },
        { season_number: 2, name: "Season 2", episode_count: 9, air_date: "2017-10-27" },
        { season_number: 3, name: "Season 3", episode_count: 8, air_date: "2019-07-04" },
        { season_number: 4, name: "Season 4", episode_count: 9, air_date: "2022-05-27" }
      ]
    },
    {
      id: 5,
      name: "The Bear",
      poster_path: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
      backdrop_path: "/mgOUJOQ6Oqmvr5jy2q3k8Yq5qHR.jpg",
      vote_average: 8.3,
      first_air_date: "2022-06-23",
      overview: "Carmen 'Carmy' Berzatto, a young chef from the fine dining world, comes home to Chicago to run his family's Italian beef sandwich shop after a heartbreaking death in his family.",
      genres: ["Comedy", "Drama"],
      number_of_seasons: 3,
      number_of_episodes: 28,
      cast: [
        { name: "Jeremy Allen White", character: "Carmen 'Carmy' Berzatto", profile_path: "/7NFnJlvs2oSdWyHU4MKyTNyn0od.jpg" },
        { name: "Ebon Moss-Bachrach", character: "Richard 'Richie' Jerimovich", profile_path: "/yYBjOPFqpYNHlA4MKyTNyn0od.jpg" },
        { name: "Ayo Edebiri", character: "Sydney Adamu", profile_path: "/n7eCqGm5J8lHGJBZYCCG6wGaJ6B.jpg" }
      ],
      streaming_providers: ["Hulu", "Disney+"],
      seasons: [
        { season_number: 1, name: "Season 1", episode_count: 8, air_date: "2022-06-23" },
        { season_number: 2, name: "Season 2", episode_count: 10, air_date: "2023-06-22" },
        { season_number: 3, name: "Season 3", episode_count: 10, air_date: "2024-06-27" }
      ]
    }
  ],
  popular: [
    {
      id: 6,
      name: "Breaking Bad",
      poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      vote_average: 9.5,
      first_air_date: "2008-01-20",
      overview: "When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live, he becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost.",
      genres: ["Drama", "Crime"],
      number_of_seasons: 5,
      number_of_episodes: 62,
      cast: [
        { name: "Bryan Cranston", character: "Walter White", profile_path: "/7Jahy5LZX2Fo8fGJltMreAI49hC.jpg" },
        { name: "Aaron Paul", character: "Jesse Pinkman", profile_path: "/oeb1rYYOdEr5R2b1cJCfEzVLCX.jpg" },
        { name: "Anna Gunn", character: "Skyler White", profile_path: "/6yLKtfYFWbJp5HAqvGva1MVFtQH.jpg" }
      ],
      seasons: [
        { season_number: 1, name: "Season 1", episode_count: 7, air_date: "2008-01-20" },
        { season_number: 2, name: "Season 2", episode_count: 13, air_date: "2009-03-08" },
        { season_number: 3, name: "Season 3", episode_count: 13, air_date: "2010-03-21" },
        { season_number: 4, name: "Season 4", episode_count: 13, air_date: "2011-07-17" },
        { season_number: 5, name: "Season 5", episode_count: 16, air_date: "2012-07-15" }
      ]
    },
    {
      id: 7,
      name: "Game of Thrones",
      poster_path: "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
      backdrop_path: "/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
      vote_average: 9.2,
      first_air_date: "2011-04-17",
      overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
      genres: ["Drama", "Action & Adventure", "Fantasy"],
      number_of_seasons: 8,
      number_of_episodes: 73,
      cast: [
        { name: "Peter Dinklage", character: "Tyrion Lannister", profile_path: "/dlM3JqRe4NnwfgOKgfylt8VLqjx.jpg" },
        { name: "Kit Harington", character: "Jon Snow", profile_path: "/4NW3UKHhPzRKLGRAEfQnDlSLU6m.jpg" },
        { name: "Emilia Clarke", character: "Daenerys Targaryen", profile_path: "/r6y4R0Qy1qoDmfgFBZ2aOCShA6I.jpg" }
      ],
      seasons: [
        { season_number: 1, name: "Season 1", episode_count: 10, air_date: "2011-04-17" },
        { season_number: 2, name: "Season 2", episode_count: 10, air_date: "2012-04-01" },
        { season_number: 3, name: "Season 3", episode_count: 10, air_date: "2013-03-31" },
        { season_number: 4, name: "Season 4", episode_count: 10, air_date: "2014-04-06" },
        { season_number: 5, name: "Season 5", episode_count: 10, air_date: "2015-04-12" },
        { season_number: 6, name: "Season 6", episode_count: 10, air_date: "2016-04-24" },
        { season_number: 7, name: "Season 7", episode_count: 7, air_date: "2017-07-16" },
        { season_number: 8, name: "Season 8", episode_count: 6, air_date: "2019-04-14" }
      ]
    },
    {
      id: 8,
      name: "The Office",
      poster_path: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
      backdrop_path: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
      vote_average: 8.9,
      first_air_date: "2005-03-24",
      overview: "The everyday lives of office employees in the Scranton, Pennsylvania branch of the fictional Dunder Mifflin Paper Company.",
      genres: ["Comedy"],
      number_of_seasons: 9,
      number_of_episodes: 201,
      cast: [
        { name: "Steve Carell", character: "Michael Scott", profile_path: "/dzJtsLspH5Bf8Tvw7OQC47ETNfJ.jpg" },
        { name: "John Krasinski", character: "Jim Halpert", profile_path: "/8y2pYlusNKqxM7bq5NlYTTRz5bb.jpg" },
        { name: "Jenna Fischer", character: "Pam Beesly", profile_path: "/fLtxqtWjcQnkqaOF9nrWeJ8xJNV.jpg" }
      ],
      seasons: [
        { season_number: 1, name: "Season 1", episode_count: 6, air_date: "2005-03-24" },
        { season_number: 2, name: "Season 2", episode_count: 22, air_date: "2005-09-20" },
        { season_number: 3, name: "Season 3", episode_count: 25, air_date: "2006-09-21" },
        { season_number: 4, name: "Season 4", episode_count: 19, air_date: "2007-09-27" },
        { season_number: 5, name: "Season 5", episode_count: 28, air_date: "2008-09-25" },
        { season_number: 6, name: "Season 6", episode_count: 26, air_date: "2009-09-17" },
        { season_number: 7, name: "Season 7", episode_count: 26, air_date: "2010-09-23" },
        { season_number: 8, name: "Season 8", episode_count: 24, air_date: "2011-09-22" },
        { season_number: 9, name: "Season 9", episode_count: 25, air_date: "2012-09-20" }
      ]
    }
  ]
};

function getMockPosterUrl(posterPath) {
  return `https://via.placeholder.com/300x450/2a2a3e/ffffff?text=${encodeURIComponent(posterPath || 'No Image')}`;
}

function getMockProfileUrl(profilePath) {
  return `https://via.placeholder.com/120x120/4ecdc4/ffffff?text=${encodeURIComponent(profilePath || 'Actor')}`;
}

class TMDbAPI {
  constructor() {
    this.baseUrl = TMDB_BASE_URL;
    this.apiKey = TMDB_API_KEY;
    this.imageBaseUrl = TMDB_IMAGE_BASE_URL;
  }

  async getTrending() {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            results: MOCK_SHOWS.trending.map(show => ({
              ...show,
              poster_path: getMockPosterUrl(show.name),
              backdrop_path: getMockPosterUrl(show.name)
            }))
          });
        }, 500);
      });
    }

    const response = await fetch(`${this.baseUrl}/trending/tv/day?api_key=${this.apiKey}`);
    const data = await response.json();
    
    // Process the results to ensure proper image URLs
    data.results = data.results.map(show => ({
      ...show,
      poster_path: show.poster_path ? this.getImageUrl(show.poster_path) : getMockPosterUrl(show.name),
      backdrop_path: show.backdrop_path ? this.getImageUrl(show.backdrop_path) : getMockPosterUrl(show.name)
    }));
    
    return data;
  }

  async getPopular() {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            results: MOCK_SHOWS.popular.map(show => ({
              ...show,
              poster_path: getMockPosterUrl(show.name),
              backdrop_path: getMockPosterUrl(show.name)
            }))
          });
        }, 500);
      });
    }

    const response = await fetch(`${this.baseUrl}/tv/popular?api_key=${this.apiKey}`);
    const data = await response.json();
    
    // Process the results to ensure proper image URLs
    data.results = data.results.map(show => ({
      ...show,
      poster_path: show.poster_path ? this.getImageUrl(show.poster_path) : getMockPosterUrl(show.name),
      backdrop_path: show.backdrop_path ? this.getImageUrl(show.backdrop_path) : getMockPosterUrl(show.name)
    }));
    
    return data;
  }

  async getShowDetails(showId) {
    if (USE_MOCK_DATA) {
      const allShows = [...MOCK_SHOWS.trending, ...MOCK_SHOWS.popular];
      const show = allShows.find(s => s.id === parseInt(showId));
      
      return new Promise(resolve => {
        setTimeout(() => {
          if (show) {
            resolve({
              ...show,
              poster_path: getMockPosterUrl(show.name),
              backdrop_path: getMockPosterUrl(show.name),
              cast: show.cast.map(actor => ({
                ...actor,
                profile_path: getMockProfileUrl(actor.name)
              }))
            });
          } else {
            resolve(null);
          }
        }, 300);
      });
    }

    const response = await fetch(`${this.baseUrl}/tv/${showId}?api_key=${this.apiKey}&append_to_response=credits`);
    const data = await response.json();
    
    // Process the show details to ensure proper image URLs
    return {
      ...data,
      poster_path: data.poster_path ? this.getImageUrl(data.poster_path) : getMockPosterUrl(data.name),
      backdrop_path: data.backdrop_path ? this.getImageUrl(data.backdrop_path) : getMockPosterUrl(data.name),
      cast: data.credits?.cast?.slice(0, 6).map(actor => ({
        ...actor,
        profile_path: actor.profile_path ? this.getImageUrl(actor.profile_path) : getMockProfileUrl(actor.name)
      })) || []
    };
  }

  async searchShows(query) {
    if (USE_MOCK_DATA) {
      const allShows = [...MOCK_SHOWS.trending, ...MOCK_SHOWS.popular];
      const filtered = allShows.filter(show => 
        show.name.toLowerCase().includes(query.toLowerCase())
      );
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            results: filtered.map(show => ({
              ...show,
              poster_path: getMockPosterUrl(show.name),
              backdrop_path: getMockPosterUrl(show.name)
            }))
          });
        }, 300);
      });
    }

    const response = await fetch(`${this.baseUrl}/search/tv?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    // Process the search results to ensure proper image URLs
    data.results = data.results.map(show => ({
      ...show,
      poster_path: show.poster_path ? this.getImageUrl(show.poster_path) : getMockPosterUrl(show.name),
      backdrop_path: show.backdrop_path ? this.getImageUrl(show.backdrop_path) : getMockPosterUrl(show.name)
    }));
    
    return data;
  }

  async getSimilarShows(showId) {
    if (USE_MOCK_DATA) {
      const allShows = [...MOCK_SHOWS.trending, ...MOCK_SHOWS.popular];
      const otherShows = allShows.filter(s => s.id !== parseInt(showId)).slice(0, 4);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            results: otherShows.map(show => ({
              ...show,
              poster_path: getMockPosterUrl(show.name),
              backdrop_path: getMockPosterUrl(show.name)
            }))
          });
        }, 400);
      });
    }

    const response = await fetch(`${this.baseUrl}/tv/${showId}/similar?api_key=${this.apiKey}`);
    const data = await response.json();
    
    // Process the similar shows to ensure proper image URLs
    data.results = data.results.map(show => ({
      ...show,
      poster_path: show.poster_path ? this.getImageUrl(show.poster_path) : getMockPosterUrl(show.name),
      backdrop_path: show.backdrop_path ? this.getImageUrl(show.backdrop_path) : getMockPosterUrl(show.name)
    }));
    
    return data;
  }

  getImageUrl(path) {
    if (USE_MOCK_DATA) {
      return path;
    }
    return `${this.imageBaseUrl}${path}`;
  }
}

export default TMDbAPI;
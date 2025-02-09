const OMDB_API_KEY = "dd176e1c";
const GOOGLE_BOOKS_API_KEY = "AIzaSyAJxdMuWwe559_J8Mo3Dfmo9LWaN7Qtvm8";

let googleBooksLoaded = false;
window.onGoogleBooksLoad = () => {
  googleBooksLoaded = true;
};


const themeToggle = document.getElementById("themeToggle");
let currentTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  themeToggle.innerHTML = `<i class="fas fa-${
    currentTheme === "dark" ? "moon" : "sun"
  }"></i>`;
});

const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const movieDetails = document.getElementById("movieDetails");
const bookDetails = document.getElementById("bookDetails");

const sampleMovies = [
  "The Matrix",
  "Inception",
  "The Lord of the Rings",
  "Harry Potter",
  "The Shawshank Redemption",
  "Pulp Fiction",
  "The Dark Knight",
  "Forrest Gump",
  "The Godfather",
  "Fight Club",
  "Interstellar",
  "Gladiator",
  "The Silence of the Lambs",
  "Goodfellas",
  "The Green Mile",
  "Saving Private Ryan",
  "Jurassic Park",
  "The Lion King",
  "Back to the Future",
  "Titanic",
  "Avatar",
  "Star Wars",
  "Indiana Jones",
  "The Avengers",
  "The Departed",
];

const popularMoviesPool = [
  // Hollywood Latest
  "Dune: Part Two",
  "Madame Web",
  "Anyone But You",
  "Mean Girls",
  "The Beekeeper",
  "Bob Marley: One Love",
  "Drive-Away Dolls",
  "Lisa Frankenstein",
  "Land of Bad",
  "Oppenheimer",
  "Barbie",
  "Poor Things",
  "Killers of the Flower Moon",
  "Napoleon",
  "Wonka",
  "Migration",
  "The Iron Claw",
  "Priscilla",
  "The Zone of Interest",


  "Fighter",
  "Dunki",
  "Animal",
  "12th Fail",
  "Salaar",
  "Sam Bahadur",
  "Tiger 3",
  "Jawan",
  "Pathaan",
  "Rocky Aur Rani Kii Prem Kahaani",
  "OMG 2",
  "Dream Girl 2",
  "Gadar 2",
  "Zara Hatke Zara Bachke",
  "Tu Jhoothi Main Makkaar",

  "Guntur Kaaram",
  "Eagle",
  "Ooru Peru Bhairavakona",
  "Saindhav",
  "Extra Ordinary Man",
  "Salaar: Part 1 – Ceasefire",
  "Hi Nanna",
  "Tiger Nageswara Rao",
  "Baby",
  "Custody",
  "Dasara",
  "Waltair Veerayya",
  "Veera Simha Reddy",
  "RRR",
  "Pushpa: The Rise",
  "Bro",
  "Miss Shetty Mr Polishetty",
  "MAD",
  "Kushi",
  "Bhagavanth Kesari",
  "Skanda",
  "Game Changer",
  "Devara: Part 1",
  "OG",
  "Pushpa 2: The Rule",


  "Captain Miller",
  "Ayalaan",
  "Merry Christmas",
  "Leo",
  "Jailer",
  "KGF: Chapter 2",
  "Kantara",
  "Ponniyin Selvan: II",
  "Varisu",
  "Thunivu",
  "Jigarthanda DoubleX",
  "Japan",


  "Perfect Days",
  "Society of the Snow",
  "The Teachers Lounge",
  "Past Lives",
  "The Boy and the Heron",
  "Monster",
  "Anatomy of a Fall",


  "Godzilla x Kong: The New Empire",
  "Deadpool 3",
  "Kung Fu Panda 4",
  "Civil War",
  "The Fall Guy",
  "Kingdom of the Planet of the Apes",
  "Furiosa: A Mad Max Saga",
  "Inside Out 2",
  "Joker: Folie à Deux",
];

async function getPopularMovies() {
  try {

    const shuffledMovies = [...popularMoviesPool].sort(
      () => Math.random() - 0.5
    );
    const selectedMovies = shuffledMovies.slice(0, 15); // Take 15 random movies


    const moviesPromises = selectedMovies.map(async (title) => {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(
          title
        )}&apikey=${OMDB_API_KEY}`
      );
      const data = await response.json();
      if (data.Response === "True") {
        return {
          title: data.Title,
          poster: data.Poster,
          year: data.Year,
          rating: data.imdbRating,
          id: data.imdbID,
          boxOffice: data.BoxOffice,
          released: data.Released,
        };
      }
      return null;
    });

    const movies = await Promise.all(moviesPromises);


    return movies
      .filter((movie) => movie !== null)
      .sort((a, b) => {

        const getRelevanceScore = (movie) => {
          let score = 0;


          score += parseFloat(movie.rating) * 10;


          const yearDiff = 2024 - parseInt(movie.year);
          score += yearDiff <= 1 ? 30 : yearDiff <= 2 ? 20 : 10;


          const releaseDate = new Date(movie.released);
          const daysSinceRelease =
            (new Date() - releaseDate) / (1000 * 60 * 60 * 24);
          if (daysSinceRelease <= 30) {
            score += 25;
          }

          return score;
        };

        return getRelevanceScore(b) - getRelevanceScore(a);
      });
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

async function displayTrendingMovies() {
  const trendingSection = document.getElementById("trendingMovies");
  const loadingHTML = `
        <div class="trending-loading">
            <div class="spinner"></div>
            <p>Loading trending movies...</p>
        </div>
    `;
  trendingSection.innerHTML = loadingHTML;

  try {
    const popularMovies = await getPopularMovies();

    trendingSection.innerHTML = popularMovies
      .slice(0, 8)
      .map(
        (movie) => `
            <div class="trending-item" onclick="selectMovie('${movie.title.replace(
              /'/g,
              "\\'"
            )}')">
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="trending-info">
                    <div class="trending-overlay"></div>
                    <div class="trending-content">
                        <span class="trending-title">${movie.title}</span>
                        <div class="trending-details">
                            <span class="trending-year">${movie.year}</span>
                            <span class="trending-rating">⭐ ${
                              movie.rating
                            }</span>
                            ${
                              movie.language
                                ? `<span class="trending-language">${
                                    movie.language.split(",")[0]
                                  }</span>`
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        `
      )
      .join("");


    const trendingItems = document.querySelectorAll(".trending-item");
    trendingItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.querySelector(".trending-info").style.opacity = "1";
        item.querySelector(".trending-overlay").style.opacity = "1";
      });
      item.addEventListener("mouseleave", () => {
        item.querySelector(".trending-info").style.opacity = "0";
        item.querySelector(".trending-overlay").style.opacity = "0";
      });
    });
  } catch (error) {
    trendingSection.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load trending movies</p>
            </div>
        `;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  displayTrendingMovies();
  // Add default messages
  movieDetails.innerHTML = `
        <div class="default-message">
            <i class="fas fa-search"></i>
            <p>Enter a movie name to see details</p>
        </div>
    `;
  bookDetails.innerHTML = `
        <div class="default-message">
            <i class="fas fa-book"></i>
            <p>Search for a movie to get book recommendations</p>
        </div>
    `;

  const shareFacebook = document.getElementById("shareFacebook");
  const shareTwitter = document.getElementById("shareTwitter");
  const shareWhatsApp = document.getElementById("shareWhatsApp");

  const currentUrl = window.location.href;
  const shareText = "Check out CineRead - Movie & Book Explorer!";

  if (shareFacebook) {
    shareFacebook.href =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(currentUrl);
  }
  if (shareTwitter) {
    shareTwitter.href =
      "https://twitter.com/intent/tweet?url=" +
      encodeURIComponent(currentUrl) +
      "&text=" +
      encodeURIComponent(shareText);
  }
  if (shareWhatsApp) {
    shareWhatsApp.href =
      "https://api.whatsapp.com/send?text=" +
      encodeURIComponent(shareText + " " + currentUrl);
  }

  movieInput.addEventListener("keydown", function(event) {
    // Check if the Enter key is pressed
    if (event.key === "Enter") {
      // Prevent any default action (like form submission)
      event.preventDefault();

      // Get the trimmed movie name from the input
      const movieName = movieInput.value.trim();

      // If the input is not empty, perform the search and hide suggestions
      if (movieName !== "") {
        searchMovie(movieName);
        hideSuggestions();
      }
    }
  });
});

async function getMovieDetails(movieTitle) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(
        movieTitle
      )}&apikey=${OMDB_API_KEY}`
    );
    const data = await response.json();
    if (data.Response === "True") {
      return {
        title: data.Title,
        year: data.Year,
        genre: data.Genre,
        imdbRating:
          data.imdbRating && data.imdbRating !== "N/A"
            ? data.imdbRating
            : "N/A",
        plot: data.Plot,
        director: data.Director,
        cast: data.Actors,
        poster: data.Poster,
        imdbID: data.imdbID,
        boxOffice: data.BoxOffice || "N/A",
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

async function getStreamingPlatform(movieTitle) {

  return null;
}

async function displayMovieDetails(movie) {

  const youtubeResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      movie.Title + " " + movie.Year + " official trailer"
    )}&type=video&key=${GOOGLE_BOOKS_API_KEY}`
  );
  const youtubeData = await youtubeResponse.json();
  const videoId = youtubeData.items?.[0]?.id?.videoId;
  const youtubeSearchQuery = encodeURIComponent(
    `${movie.Title} ${movie.Year} official trailer`
  );

  movieDetails.innerHTML = `
        <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Finding movie details...</p>
        </div>
    `;

  const movieDetailsData = await getMovieDetails(movie.Title);
  if (!movieDetailsData) {
    movieDetails.innerHTML = `<p>Movie details not found.</p>`;
    return;
  }

  const cast = movieDetailsData.cast || "N/A";
  const director = movieDetailsData.director || "N/A";

  movieDetails.innerHTML = `
        <div class="movie-details">
            <div class="movie-poster">
                <img src="${
                  movieDetailsData.poster !== "N/A"
                    ? movieDetailsData.poster
                    : "https://via.placeholder.com/200x300"
                }" alt="${movieDetailsData.title} poster">
            </div>
            <div class="movie-info">
                <h3>${movieDetailsData.title} (${movieDetailsData.year})</h3>
                <p><strong>Genre:</strong> ${movieDetailsData.genre}</p>
                <p><strong>IMDB Rating:</strong> ${
                  movieDetailsData.imdbRating
                }</p>
                <p><strong>Box Office:</strong> ${
                  movieDetailsData.boxOffice
                }</p>
                <p><strong>Director:</strong> ${director}</p>
                <p><strong>Plot:</strong> ${movieDetailsData.plot}</p>
                <p><strong>Cast:</strong> ${cast}</p>
                ${
                  videoId
                    ? `
                <div class="trailer-container">
                    <h4>Watch Trailer</h4>
                    <iframe 
                        width="100%" 
                        height="315" 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>`
                    : ""
                }
                <div class="external-links">
                    <a href="https://www.imdb.com/title/${
                      movieDetailsData.imdbID
                    }" target="_blank" class="movie-link-button imdb">
                        <i class="fab fa-imdb"></i> View on IMDb
                    </a>
                    <a href="https://www.youtube.com/results?search_query=${youtubeSearchQuery}" target="_blank" class="movie-link-button youtube">
                        <i class="fab fa-youtube"></i> Watch Trailer
                    </a>
                </div>
            </div>
        </div>
    `;
}

async function searchMovie(title, year = "", rating = "") {
  try {
    let url = `https://www.omdbapi.com/?t=${encodeURIComponent(
      title
    )}&apikey=${OMDB_API_KEY}`;
    if (year) url += `&y=${year}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      throw new Error("Movie not found");
    }

    displayMovieDetails(data);
    searchRelatedBooks(data);
  } catch (error) {
    movieDetails.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

async function displayCastAndCrew(movie) {
  return `
        <div class="cast-crew-section">
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Cast:</strong> ${movie.Actors}</p>
        </div>
    `;
}

async function searchRelatedBooks(movie) {
  try {

    const searchTerms = [];


    searchTerms.push(
      movie.Title.replace(/[^\w\s]/gi, "")
        .split("(")[0]
        .trim()
    );


    const genres = movie.Genre.split(",").map((g) => g.trim());
    searchTerms.push(...genres);


    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ]);
    const plotWords = movie.Plot.split(" ")
      .map((word) => word.toLowerCase().replace(/[^\w\s]/gi, ""))
      .filter((word) => word.length > 3 && !commonWords.has(word))
      .slice(0, 3);
    searchTerms.push(...plotWords);


    if (movie.Plot.toLowerCase().includes("war")) searchTerms.push("war");
    if (movie.Plot.toLowerCase().includes("love")) searchTerms.push("romance");
    if (movie.Plot.toLowerCase().includes("magic")) searchTerms.push("fantasy");
    if (movie.Plot.toLowerCase().includes("crime"))
      searchTerms.push("thriller");


    const searchQuery = searchTerms
      .filter((term, index, self) => self.indexOf(term) === index) 
      .join(" OR ");

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?` +
        `q=${encodeURIComponent(searchQuery)}` +
        `&key=${GOOGLE_BOOKS_API_KEY}` +
        `&maxResults=10` +
        `&langRestrict=en` +
        `&orderBy=relevance` +
        `&fields=items(volumeInfo)`
    );

    const data = await response.json();

    if (!data.items) {
      throw new Error("No books found");
    }


    const filteredBooks = data.items
      .filter((book) => {
        const bookInfo = book.volumeInfo;

        return bookInfo.title && bookInfo.description && bookInfo.imageLinks;
      })
      .map((book) => {

        let score = 0;
        const bookTitle = book.volumeInfo.title.toLowerCase();
        const bookDescription = book.volumeInfo.description.toLowerCase();


        if (bookTitle.includes(movie.Title.toLowerCase())) score += 5;


        genres.forEach((genre) => {
          if (bookDescription.includes(genre.toLowerCase())) score += 3;
        });


        plotWords.forEach((word) => {
          if (bookDescription.includes(word)) score += 2;
        });

        return { ...book, relevanceScore: score };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);

    displayBookDetails(filteredBooks);
  } catch (error) {
    console.error("Book search failed:", error);
    bookDetails.innerHTML = `<p class="error">Could not load book recommendations. Please try again.</p>`;
  }
}

function getPurchaseLinks(book) {
  const title = encodeURIComponent(book.volumeInfo.title);
  const author = book.volumeInfo.authors
    ? encodeURIComponent(book.volumeInfo.authors[0])
    : "";
  return {
    amazon: `https://www.amazon.com/s?k=${title}+${author}+book`,
    googleBooks:
      book.volumeInfo.canonicalVolumeLink ||
      `https://books.google.com/books?q=${title}+${author}`,
  };
}

async function displayBookDetails(books) {
  if (!window.google || !window.google.books) {
    const script = document.createElement("script");
    script.src = "https://www.google.com/books/jsapi.js";
    await new Promise((resolve) => {
      script.onload = resolve;
      document.head.appendChild(script);
    });
    google.books.load();
  }
  bookDetails.innerHTML = `
        <div class="book-grid">
            ${books
              .map(
                (book) => `
                <div class="book-item">
                    <div class="book-content">
                        <div class="book-header">
                            <img class="book-cover" 
                                 src="${
                                   book.volumeInfo.imageLinks
                                     ? book.volumeInfo.imageLinks.thumbnail
                                     : "https://via.placeholder.com/128x192"
                                 }" 
                                 alt="${book.volumeInfo.title}">
                            <div class="book-main-info">
                                <h3>${book.volumeInfo.title}</h3>
                                <div class="book-rating">
                                    ${
                                      book.volumeInfo.averageRating
                                        ? "★ " +
                                          book.volumeInfo.averageRating +
                                          "/5"
                                        : "No rating available for this book"
                                    }
                                </div>
                                <p><strong>Author:</strong> ${
                                  book.volumeInfo.authors
                                    ? book.volumeInfo.authors.join(", ")
                                    : "Unknown"
                                }</p>
                                <p class="book-year"><strong>Published:</strong> ${
                                  book.volumeInfo.publishedDate
                                    ? book.volumeInfo.publishedDate.substring(
                                        0,
                                        4
                                      )
                                    : "Unknown"
                                }</p>
                            </div>
                        </div>
                        <p class="book-description">${
                          book.volumeInfo.description
                            ? book.volumeInfo.description.substring(0, 200) +
                              "..."
                            : "No description available"
                        }</p>
                        <div class="book-links">
                            <div class="purchase-links">
                                <a href="${
                                  getPurchaseLinks(book).amazon
                                }" target="_blank" class="buy-button amazon">
                                    <i class="fab fa-amazon"></i> Buy on Amazon
                                </a>
                                <a href="${
                                  getPurchaseLinks(book).googleBooks
                                }" target="_blank" class="buy-button google">
                                    <i class="fas fa-book"></i> Buy on Google Books
                                </a>
                                <a href="${
                                  book.volumeInfo.previewLink
                                }" target="_blank" class="buy-button preview">
                                    <i class="fas fa-book-open"></i> Read Preview
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
}

function showBookPreview(bookId) {
  const viewer = new google.books.DefaultViewer(
    document.getElementById(`viewerCanvas-${bookId}`)
  );
  viewer.load(bookId);
}

searchBtn.addEventListener("click", () => {
  const movie = movieInput.value.trim();
  if (movie) {
    searchMovie(movie);
  }
});

surpriseBtn.addEventListener("click", () => {
  const randomMovie =
    sampleMovies[Math.floor(Math.random() * sampleMovies.length)];
  movieInput.value = randomMovie;
  searchMovie(randomMovie);
});

let searchTimeout;


yearFilter.addEventListener("change", updateRecommendations);
ratingFilter.addEventListener("change", updateRecommendations);


function filterMoviesByGenreAndLanguage(movies, genre, language) {
  return movies.filter((movie) => {
    const matchesGenre = !genre || (movie.Genre && movie.Genre.includes(genre));
    const matchesLanguage =
      !language || (movie.Language && movie.Language.includes(language));
    return matchesGenre && matchesLanguage;
  });
}

async function updateRecommendations() {
  const query = movieInput.value.trim();
  const year = yearFilter.value;
  const rating = ratingFilter.value;

  if (query.length >= 3) {
    try {
      let url = `https://www.omdbapi.com/?s=${encodeURIComponent(
        query
      )}&apikey=${OMDB_API_KEY}`;
      if (year) url += `&y=${year}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True" && data.Search) {

        if (rating) {
          const detailedMovies = await Promise.all(
            data.Search.map(async (movie) => {
              const detailResponse = await fetch(
                `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`
              );
              return detailResponse.json();
            })
          );


          const filteredMovies = detailedMovies.filter(
            (movie) => parseFloat(movie.imdbRating) >= parseFloat(rating)
          );

          showSuggestions(filteredMovies.slice(0, 5));
        } else {
          showSuggestions(data.Search.slice(0, 5));
        }
      } else {
        hideSuggestions();
      }
    } catch (error) {
      console.error("Movie search failed:", error);
      hideSuggestions();
    }
  } else {
    hideSuggestions();
  }
}

movieInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  if (e.target.value.length >= 2) {
    searchTimeout = setTimeout(updateRecommendations, 100);
  } else {
    hideSuggestions();
  }
});


function showSuggestions(movies) {
  let suggestionsBox = document.getElementById("suggestions");
  if (!suggestionsBox) {
    suggestionsBox = document.createElement("div");
    suggestionsBox.id = "suggestions";
    movieInput.parentNode.appendChild(suggestionsBox);
  }

  suggestionsBox.innerHTML = movies
    .map((movie) => {
      const title = movie.Title;
      const year = movie.Year;
      const rating = movie.imdbRating ? ` • ⭐${movie.imdbRating}` : "";
      return `
            <div class="suggestion" onclick="selectMovie('${title.replace(
              /'/g,
              "\\'"
            )}')">
                <i class="fas fa-film"></i> ${title} 
                <span style="color: var(--text-secondary)">(${year}${rating})</span>
            </div>
        `;
    })
    .join("");

  const inputRect = movieInput.getBoundingClientRect();
  suggestionsBox.style.width = inputRect.width + "px";
}

function hideSuggestions() {
  const suggestionsBox = document.getElementById("suggestions");
  if (suggestionsBox) {
    suggestionsBox.innerHTML = "";
  }
}

function selectMovie(title) {
  movieInput.value = title;
  searchMovie(title);
  hideSuggestions();
}

document.addEventListener("click", (e) => {
  if (!e.target.closest("#suggestions") && !e.target.closest("#movieInput")) {
    hideSuggestions();
  }
});


const OMDB_API_KEY = "dd176e1c";
const GOOGLE_BOOKS_API_KEY = "AIzaSyAJxdMuWwe559_J8Mo3Dfmo9LWaN7Qtvm8";

let googleBooksLoaded = false;
window.onGoogleBooksLoad = () => {
    googleBooksLoaded = true;
};

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    themeToggle.innerHTML = `<i class="fas fa-${currentTheme === 'dark' ? 'moon' : 'sun'}"></i>`;
});

const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const movieDetails = document.getElementById('movieDetails');
const bookDetails = document.getElementById('bookDetails');

// Sample movies for the surprise feature
const sampleMovies = [
    'The Matrix',
    'Inception',
    'The Lord of the Rings',
    'Harry Potter',
    'The Shawshank Redemption',
    'Pulp Fiction',
    'The Dark Knight',
    'Forrest Gump',
    'The Godfather',
    'Fight Club',
    'Interstellar',
    'Gladiator',
    'The Silence of the Lambs',
    'Goodfellas',
    'The Green Mile',
    'Saving Private Ryan',
    'Jurassic Park',
    'The Lion King',
    'Back to the Future',
    'Titanic',
    'Avatar',
    'Star Wars',
    'Indiana Jones',
    'The Avengers',
    'The Departed'
];

// Extended pool of popular movies
const moviePool = [
    { title: 'Dune', poster: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg' },
    { title: 'Oppenheimer', poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg' },
    { title: 'Barbie', poster: 'https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg' },
    { title: 'Poor Things', poster: 'https://m.media-amazon.com/images/M/MV5BNGIyYWMzNjktNDE3MC00YWQyLWEyMmEtN2ZmNzZhZDk3NGJlXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg' },
    { title: 'Killers of the Flower Moon', poster: 'https://m.media-amazon.com/images/M/MV5BMjE4ZTZlNDAtM2Q3YS00YjFhLThjN2UtODg2ZGNlN2E2MWU2XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg' },
    { title: 'The Batman', poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg' },
    { title: 'Everything Everywhere All at Once', poster: 'https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_SX300.jpg' },
    { title: 'Top Gun: Maverick', poster: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_SX300.jpg' },
    { title: 'The Menu', poster: 'https://m.media-amazon.com/images/M/MV5BMzdjNjI5MmYtODhiNS00NTcyLWEzZmUtYzVmODM5YzExNDE3XkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_SX300.jpg' },
    { title: 'Nope', poster: 'https://m.media-amazon.com/images/M/MV5BMGIyNTI3NWItNTJkOS00MGYyLWE4NjgtZDhjMWQ4Y2JkZTU5XkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_SX300.jpg' }
];

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Get 5 random movies for trending section
function getRandomTrendingMovies() {
    return shuffleArray([...moviePool]).slice(0, 5);
}

function displayTrendingMovies() {
    const trendingSection = document.getElementById('trendingMovies');
    const trendingMovies = getRandomTrendingMovies();
    trendingSection.innerHTML = trendingMovies.map(movie => `
        <div class="trending-item" onclick="selectMovie('${movie.title}')">
            <img src="${movie.poster}" alt="${movie.title}">
        </div>
    `).join('');
}

// Initialize trending section
document.addEventListener('DOMContentLoaded', () => {
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
});

async function searchMovie(title, year = '', rating = '') {
    try {
        let url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;
        if (year) url += `&y=${year}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'False') {
            throw new Error('Movie not found');
        }

        displayMovieDetails(data);
        searchBooks(data.Genre.split(',')[0]);
    } catch (error) {
        movieDetails.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function searchBooks(genre) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=5&fields=items(volumeInfo)&langRestrict=en`);
        const data = await response.json();

        if (!data.items) {
            throw new Error('No books found');
        }

        displayBookDetails(data.items);
    } catch (error) {
        console.error('Book search failed:', error);
        bookDetails.innerHTML = `<p class="error">Could not load book recommendations. Please try again.</p>`;
    }
}

function displayMovieDetails(movie) {
    const youtubeSearchQuery = encodeURIComponent(`${movie.Title} ${movie.Year} official trailer`);
    movieDetails.innerHTML = `
        <div class="movie-details">
            <div class="movie-poster">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300'}" alt="${movie.Title} poster">
            </div>
            <div class="movie-info">
                <h3>${movie.Title} (${movie.Year})</h3>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Rating:</strong> ${movie.imdbRating}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <div class="movie-links">
                    <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="movie-link-button">View on IMDB</a>
                    <a href="https://www.youtube.com/results?search_query=${youtubeSearchQuery}" target="_blank" class="movie-link-button">Watch Trailer</a>
                </div>
            </div>
        </div>
    `;
}

function getPurchaseLinks(book) {
    const title = encodeURIComponent(book.volumeInfo.title);
    const author = book.volumeInfo.authors ? encodeURIComponent(book.volumeInfo.authors[0]) : '';
    return {
        amazon: `https://www.amazon.com/s?k=${title}+${author}+book`,
        googleBooks: book.volumeInfo.canonicalVolumeLink || `https://books.google.com/books?q=${title}+${author}`
    };
}

function displayBookDetails(books) {
    bookDetails.innerHTML = `
        <div class="book-grid">
            ${books.map(book => `
                <div class="book-item">
                    <div class="book-content">
                        <div class="book-header">
                            <img class="book-cover" 
                                 src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192'}" 
                                 alt="${book.volumeInfo.title}">
                            <div class="book-main-info">
                                <h3>${book.volumeInfo.title}</h3>
                                <div class="book-rating">
                                    ${book.volumeInfo.averageRating ? '★ ' + book.volumeInfo.averageRating + '/5' : 'No rating available for this book'}
                                </div>
                                <p><strong>Author:</strong> ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
                                ${book.volumeInfo.previewLink ? 
                                    `<a href="${book.volumeInfo.previewLink}" target="_blank" class="preview-button">Read Preview</a>` : ''}
                            </div>
                        </div>
                        <p class="book-description">${book.volumeInfo.description ? book.volumeInfo.description.substring(0, 200) + '...' : 'No description available'}</p>
                        <div class="book-links">
                            <div class="purchase-links">
                                <a href="${getPurchaseLinks(book).amazon}" target="_blank" class="buy-button amazon">
                                    <i class="fab fa-amazon"></i> Buy on Amazon
                                </a>
                                <a href="${getPurchaseLinks(book).googleBooks}" target="_blank" class="buy-button google">
                                    <i class="fas fa-book"></i> Buy on Google Books
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

searchBtn.addEventListener('click', () => {
    const movie = movieInput.value.trim();
    if (movie) {
        searchMovie(movie);
    }
});

surpriseBtn.addEventListener('click', () => {
    const randomMovie = sampleMovies[Math.floor(Math.random() * sampleMovies.length)];
    movieInput.value = randomMovie;
    searchMovie(randomMovie);
});

let searchTimeout;

// Add event listeners for filters
yearFilter.addEventListener('change', updateRecommendations);
ratingFilter.addEventListener('change', updateRecommendations);

async function updateRecommendations() {
    const query = movieInput.value.trim();
    const year = yearFilter.value;
    const rating = ratingFilter.value;
    
    if (query.length >= 3) {
        try {
            let url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`;
            if (year) url += `&y=${year}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.Response === 'True' && data.Search) {
                // If rating filter is active, fetch full details for each movie to check rating
                if (rating) {
                    const detailedMovies = await Promise.all(
                        data.Search.map(async movie => {
                            const detailResponse = await fetch(
                                `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`
                            );
                            return detailResponse.json();
                        })
                    );
                    
                    // Filter movies by rating
                    const filteredMovies = detailedMovies.filter(
                        movie => parseFloat(movie.imdbRating) >= parseFloat(rating)
                    );
                    
                    showSuggestions(filteredMovies.slice(0, 5));
                } else {
                    showSuggestions(data.Search.slice(0, 5));
                }
            } else {
                hideSuggestions();
            }
        } catch (error) {
            console.error('Movie search failed:', error);
            hideSuggestions();
        }
    } else {
        hideSuggestions();
    }
}

// Modify the existing input event listener to use the same function
movieInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(updateRecommendations, 300);
});

// Update showSuggestions function to handle both types of movie objects
function showSuggestions(movies) {
    let suggestionsBox = document.getElementById('suggestions');
    if (!suggestionsBox) {
        suggestionsBox = document.createElement('div');
        suggestionsBox.id = 'suggestions';
        movieInput.parentNode.appendChild(suggestionsBox);
    }
    
    suggestionsBox.innerHTML = movies.map(movie => {
        const title = movie.Title;
        const year = movie.Year;
        const rating = movie.imdbRating ? ` • ⭐${movie.imdbRating}` : '';
        return `
            <div class="suggestion" onclick="selectMovie('${title.replace(/'/g, "\\'")}')">
                <i class="fas fa-film"></i> ${title} 
                <span style="color: var(--text-secondary)">(${year}${rating})</span>
            </div>
        `;
    }).join('');
    
    const inputRect = movieInput.getBoundingClientRect();
    suggestionsBox.style.width = inputRect.width + 'px';
}

function hideSuggestions() {
    const suggestionsBox = document.getElementById('suggestions');
    if (suggestionsBox) {
        suggestionsBox.innerHTML = '';
    }
}

function selectMovie(title) {
    movieInput.value = title;
    searchMovie(title);
    hideSuggestions();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('#suggestions') && !e.target.closest('#movieInput')) {
        hideSuggestions();
    }
});
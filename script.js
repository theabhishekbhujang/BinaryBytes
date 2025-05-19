//Set up your API key and variables
const API_KEY = ''; // Replace with your NewsAPI key
const newsContainer = document.getElementById('newsContainer'); // Where news will be displayed
const loadingSpinner = document.getElementById('loadingSpinner'); // Loading animation
const errorMessage = document.getElementById('errorMessage'); // Error message box

//Fetch news when the page loads
window.onload = function () {
  fetchNews('general'); // Fetch news for the default category
};

//Function to fetch news from the API
function fetchNews(category) {
  // Show loading spinner and hide error message
  loadingSpinner.style.display = 'block';
  errorMessage.style.display = 'none';
  newsContainer.innerHTML = '';

  // Build the API URL with the selected category
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}`;

  // Fetch data from the API
  fetch(url)
    .then(function (response) {
      return response.json(); // Convert the response to JSON format
    })
    .then(function (data) {
      displayNews(data.articles); // Display the news articles
    })
    .catch(function (error) {
      console.error('Error:', error);
      errorMessage.style.display = 'block'; // Show error message
    })
    .finally(function () {
      loadingSpinner.style.display = 'none'; // Hide loading spinner
    });
}

// Step 4: Function to display news articles
function displayNews(articles) {
  let newsHTML = ''; // Variable to store HTML for all news cards

  // Loop through each article and create a card for it
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    newsHTML += `
      <div class="article-card">
        <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="News Image">
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank">Read More → </a>
      </div>
    `;
  }

  // Add all news cards to the news container
  newsContainer.innerHTML = newsHTML;
}

// Step 5: Add event listeners for interactivity

// Category filter: Fetch news when a new category is selected
document.getElementById('categoryFilter').addEventListener('change', function (e) {
  const category = e.target.value; // Get the selected category
  fetchNews(category); // Fetch news for the new category
});

// Search bar: Filter news articles based on the search term
document.getElementById('searchInput').addEventListener('input', function (e) {
  const searchTerm = e.target.value.toLowerCase(); // Get the search term
  const cards = document.querySelectorAll('.article-card'); // Get all news cards

  // Loop through each card and show/hide based on the search term
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();

    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = 'block'; // Show the card
    } else {
      card.style.display = 'none'; // Hide the card
    }
  }
});
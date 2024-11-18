document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  const outputDiv = document.getElementById('output');

  // Utility function to sanitize user input
  const sanitizeInput = (input) => input.replace(/[<>{}]/g, '').trim();

  // Function to display messages in the outputDiv
  const displayMessage = (message, className) => {
    outputDiv.innerHTML = `<div class="${className}">${message}</div>`;
  };

  // Function to fetch and display superhero data
  const fetchSuperheroes = async (query = '') => {
    try {
      const sanitizedQuery = sanitizeInput(query);
      const url = sanitizedQuery
        ? `superheroes.php?query=${encodeURIComponent(sanitizedQuery)}`
        : 'superheroes.php';

      // Fetch data from the server
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const htmlContent = await response.text();

      // Handle "not found" case
      if (htmlContent.includes('SUPERHERO NOT FOUND')) {
        displayMessage('SUPERHERO NOT FOUND', 'not-found');
        return;
      }

      // Update output and format list items if needed
      outputDiv.innerHTML = htmlContent;
      if (htmlContent.includes('<ul>')) {
        const listItems = outputDiv.querySelectorAll('li');
        listItems.forEach(li => {
          if (!li.textContent.startsWith('•')) {
            li.textContent = '• ' + li.textContent;
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      displayMessage('Failed to load superhero data.', 'error');
    }
  };

  // Event handler for search button click
  const handleSearch = () => fetchSuperheroes(searchInput.value);

  // Event handler for Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchSuperheroes(searchInput.value);
  };

  // Attach event listeners
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', handleKeyPress);
});

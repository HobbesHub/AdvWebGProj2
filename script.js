document.addEventListener('DOMContentLoaded', function () {
  const addBookForm = document.getElementById('addBookForm');
  const bookList = document.getElementById('bookList');

  // Function to create a card for a book
  function createCard(book) {
    const card = document.createElement('tr');
    card.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.releaseYear}</td>
    `;
    return card;
  }

  // Function to fetch and display the list of all books
  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const books = await response.json();

      // Clear previous book list
      bookList.innerHTML = '';

      // Display each book in the table
      books.forEach(book => {
        const card = createCard(book);
        bookList.appendChild(card);
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Event listener for the form submission
  addBookForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(addBookForm);
    const bookData = {
      title: formData.get('title'),
      author: formData.get('author'),
      genre: formData.get('genre'),
      releaseYear: formData.get('releaseYear'),
    };

    try {
      // Send a POST request to add a new book
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const newBook = await response.json();

      // Create a card for the new book and add it to the list
      const card = createCard(newBook);
      bookList.appendChild(card);
    } catch (error) {
      console.error('Error adding a new book:', error);
    }
  });

  // Fetch and display the list of books when the page loads
  fetchBooks();
});

document.addEventListener('DOMContentLoaded', function () {
  const addBookForm = document.getElementById('addBookForm');
  const bookList = document.getElementById('bookList');

  // Function to fetch and display the list of all books
  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const books = await response.json();

      // Clear previous book list
      bookList.innerHTML = '';

      // Display each book in the table with a delete button
      books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.genre}</td>
          <td>${book.releaseYear}</td>
          <td><button class="btn btn-danger" data-id="${book._id}">Delete</button></td>
        `;

        // Add a click event listener to the delete button
        const deleteButton = row.querySelector('button');
        deleteButton.addEventListener('click', () => {
          const bookId = deleteButton.getAttribute('data-id');
          deleteBook(bookId);
        });

        bookList.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Function to delete a book by ID
  const deleteBook = async (bookId) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (response.status === 200) {
        // Book deleted successfully, re-fetch the updated list of books
        fetchBooks();
      } else {
        console.error('Error deleting book:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
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

      // Fetch and display the updated list of books
      fetchBooks();
    } catch (error) {
      console.error('Error adding a new book:', error);
    }
  });

  // fetch to display the list of books
  fetchBooks();
});

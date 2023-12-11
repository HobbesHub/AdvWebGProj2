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

      // Display each book in the table
      books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.genre}</td>
          <td>${book.releaseYear}</td>
          <td><button class="btn btn-danger delete-button" data-book-id="${book.id}">Delete</button></td> <!-- Delete button -->
        `;
        bookList.appendChild(row);
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

      // Fetch and display the updated list of books
      fetchBooks();
    } catch (error) {
      console.error('Error adding a new book:', error);
    }
  });

  // Event listener for book deletion
  bookList.addEventListener('click', async function (event) {
    if (event.target.classList.contains('delete-button')) {
      const bookId = event.target.dataset.bookId; // Get the book ID from the button's data attribute

      try {
        // Send a DELETE request to delete the book
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Book deleted successfully, remove it from the UI
          event.target.closest('tr').remove();
        } else {
          console.error('Error deleting the book:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting the book:', error);
      }
    }
  });

  // fetch to display the list of books
  fetchBooks();
});

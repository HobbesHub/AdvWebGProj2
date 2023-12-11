const bookFormEl = $('#addBookForm');
const authorEl = $('input[name="author"]');
const titleEl = $('input[name="title"]');
const genreEl = $('input[name="genre"]');
const releaseYearEl = $('input[name="releaseYear"]');
const bookList = $('#bookList'); // Get the bookList container

function handleFormSubmit(event) {
  event.preventDefault();

  const bookData = {
    title: titleEl.val(),
    author: authorEl.val(),
    genre: genreEl.val(),
    releaseYear: releaseYearEl.val(),
  };

  const submission = validateBook(bookData);

  if (submission.isValid) {
    postBook(bookData)
      .then((data) => {
        alert('Book added successfully!');
        fetchBooks();
      })
      .catch((error) => {
        console.error('Error adding a new book:', error);
      });
  } else {
    showErrors(submission.errors);
  }
}

bookFormEl.on('submit', handleFormSubmit);

const getBooks = () =>
  fetch('/api/books', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error('Error:', error);
    });

const postBook = (book, isMongo) => {
  const path = isMongo ? '/mongo' : '/file';

  return fetch(`/api/books${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(`Error adding a new book to ${isMongo ? 'MongoDB' : 'JSON file'}:`, error);
    });
};

const fetchBooks = async () => {
  try {
    const books = await getBooks();

    // Clear the bookList container
    bookList.empty();

    // Display each book in the bookList
    books.forEach((book) => {
      // Create a new card for each book
      const card = $('<div class="card"></div>');
      const title = $(`<p>Title: ${book.title}</p>`);
      const author = $(`<p>Author: ${book.author}</p>`);
      const genre = $(`<p>Genre: ${book.genre}</p>`);
      const releaseYear = $(`<p>Release Year: ${book.releaseYear}</p>`);

      // Append elements to the card
      card.append(title, author, genre, releaseYear);

      // Append the card to the bookList container
      bookList.append(card);
    });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

// Initial fetch and display of books
fetchBooks();

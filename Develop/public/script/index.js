
const bookFormEl = $('#addBookForm');
var authorEl = $('input[name="author"]');
var titleEl = $('input[name="title"]');
var genreEl = $('input[name="genre"]');
var releaseYearEl = $('input[name="releaseYear"]');

// Function to update the book list in the HTML
const updateBookList = (books) => {
  const bookListElement = $('#bookList');
  bookListElement.empty(); // Clear the existing content

  books.forEach((book) => {
    // Create a new row for each book
    const newRow = $('<tr>');
    newRow.append($('<td>').text(book.title));
    newRow.append($('<td>').text(book.author));
    newRow.append($('<td>').text(book.genre));
    newRow.append($('<td>').text(book.releaseYear));

    // Append  new row to the book list
    bookListElement.append(newRow);
  });
};

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

    // Display each book in the console for users
    books.forEach((book) => {
      console.log('Book:', book);
    });

    // then Update the book list in the HTML
    updateBookList(books);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

// Fetch books and update the list when the page loads
getBooks().then((data) => {
  updateBookList(data);
});

// Function to validate the book data
const validateBook = (newBook) => {
  const { author } = newBook;

  // Object to hold our error messages until we are ready to return
  const errorState = {
    author: '',
  };

  // Bool value if the author is valid
  const authorCheck = author.length >= 3;
  if (!authorCheck) {
    errorState.author = 'Invalid author name!';
  }

  const result = {
    isValid: authorCheck,
    errors: errorState,
  };
  return result;
};

// Function to display errors
const showErrors = (errorObj) => {
  const errors = Object.values(errorObj);
  errors.forEach((error) => {
    if (error.length > 0) {
      alert(error);
    }
  });
};

// Submit event on the form
bookFormEl.on('submit', (event) => {
  event.preventDefault();

  console.log('author:', authorEl.val());
  console.log('title:', titleEl.val());
  console.log('genre:', genreEl.val());
  console.log('releaseYear:', releaseYearEl.val());

  const bookData = {
    title: titleEl.val(),
    author: authorEl.val(),
    genre: genreEl.val(),
    releaseYear: releaseYearEl.val(),
  };

  // Validate book data
  const submission = validateBook(bookData);

  if (submission.isValid) {
    // If the submission is valid, send a POST request to add a new book to MongoDB
    postBook(bookData, true)
      .then((data) => {
        alert('Book added successfully to MongoDB!');
        // Fetch and display updated books
        fetchBooks();
      });
    postBook(bookData, false)
      .then((data) => {
        alert('Book added successfully to JSON file!');
        // Fetch and display updated books
        fetchBooks();
      });
  } else {
    // If invalid, show errors
    showErrors(submission.errors);
  }
});

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ✅ Task 6: Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully!" });
});

// ✅ Task 10: Get the book list using async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(books), 100); // Simulated async delay
      });
    };

    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch books." });
  }
});

// ✅ Task 11: Get book details by ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve(book);
        else reject("Book not found");
      });
    };

    const isbn = req.params.isbn;
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// ✅ Task 12: Get book details by author using async/await
public_users.get('/author/:author', async function (req, res) {
  const authorParam = req.params.author.toLowerCase();

  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const matchingBooks = [];

      for (let key in books) {
        if (books[key].author.toLowerCase() === author) {
          matchingBooks.push({ isbn: key, ...books[key] });
        }
      }

      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found by that author");
      }
    });
  };

  try {
    const booksByAuthor = await getBooksByAuthor(authorParam);
    return res.status(200).json(booksByAuthor);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// ✅ Task 13: Get book details by title using async/await
public_users.get('/title/:title', async function (req, res) {
  const titleParam = req.params.title.toLowerCase();

  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const matchingBooks = [];

      for (let key in books) {
        if (books[key].title.toLowerCase() === title) {
          matchingBooks.push({ isbn: key, ...books[key] });
        }
      }

      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found with that title");
      }
    });
  };

  try {
    const booksByTitle = await getBooksByTitle(titleParam);
    return res.status(200).json(booksByTitle);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// ✅ Task 5: Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

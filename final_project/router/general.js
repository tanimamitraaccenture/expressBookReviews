const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  // Register a new user
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  users.push({ username, password });
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return all books
  return res.status(200).json(books);
});

// Get the book list available in the shop (Promise callback)
public_users.get('/books/promise', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({message: err}));
});

// Get the book list available in the shop (async-await with Axios)
public_users.get('/books/async', async function (req, res) {
  try {
    // Simulate fetching from an API endpoint (self-call)
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Return book by ISBN
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get book details based on ISBN (Promise callback)
public_users.get('/isbn/promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({message: err}));
});

// Get book details based on ISBN (async-await with Axios)
public_users.get('/isbn/async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Simulate fetching from an API endpoint (self-call)
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Return books by author
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get book details based on author (Promise callback)
public_users.get('/author/promise/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found for this author");
    }
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({message: err}));
});

// Get book details based on author (async-await with Axios)
public_users.get('/author/async/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // Simulate fetching from an API endpoint (self-call)
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Return books by title
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Get all books based on title (Promise callback)
public_users.get('/title/promise/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title");
    }
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({message: err}));
});

// Get all books based on title (async-await with Axios)
public_users.get('/title/async/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Simulate fetching from an API endpoint (self-call)
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Return reviews for a book
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book or reviews not found"});
  }
});

module.exports.general = public_users;

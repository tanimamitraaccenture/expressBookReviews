const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if username is a non-empty string and not already taken
  return typeof username === "string" && username.length > 0 && !users.find(u => u.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match a user in records
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // Authenticate user and return JWT token
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid credentials"});
  }
  let accessToken = jwt.sign({ username }, "access", { expiresIn: 3600 });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({message: "Login successful"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Add or update a review for a book by the logged-in user
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization && req.session.authorization.username;
  if (!username) {
    return res.status(401).json({message: "User not authenticated"});
  }
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!review) {
    return res.status(400).json({message: "Review content required"});
  }
  books[isbn].reviews = books[isbn].reviews || {};
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added/updated successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization && req.session.authorization.username;
  if (!username) {
    return res.status(401).json({message: "User not authenticated"});
  }
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  } else {
    return res.status(404).json({message: "Review not found for this user"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

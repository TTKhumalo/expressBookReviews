const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "access_secret_key";

// Check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Authenticate user login
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login endpoint
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({ message: "User successfully logged in", accessToken: token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { username, review } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!username || !review) {
        return res.status(400).json({ message: "Username and review required" });
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review successfully added/modified", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!username || !books[isbn].reviews[username]) {
        return res.status(400).json({ message: "Review not found for this user" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: `Review deleted for ISBN ${isbn}`, reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const books = require("./booksdb.js");
const public_users = express.Router();

// In-memory user store for registration
public_users.users = [];

// Register a new user
public_users.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const isUserExist = public_users.users.find(u => u.username === username);
    if (isUserExist) {
        return res.status(409).json({ message: "Username already exists" });
    }

    public_users.users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    try {
        // Just return books directly, but using async function
        return res.status(200).json(books);
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving book list", error: err.message });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving book by ISBN", error: err.message });
    }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const filteredBooks = Object.values(books).filter(
            (book) => book.author.toLowerCase() === author
        );

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving book by author", error: err.message });
    }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const filteredBooks = Object.values(books).filter(
            (book) => book.title.toLowerCase() === title
        );

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving book by title", error: err.message });
    }
});

// Get book review
public_users.get("/review/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            return res.status(200).json(books[isbn].reviews);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving book review", error: err.message });
    }
});

module.exports.general = public_users;

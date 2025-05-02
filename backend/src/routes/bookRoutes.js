import express from "express";
import cloudinary from "../lib/cloudinary";
import Book from "../models/Book";
import protectRoute from "../middleware/auth.middleware";

const router = express.Router();

// create
// yaha protectRoute use gareko xa, to make sure its protected and only the authenticated user who have the token can post it
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, author, description, image } = req.body;

    if (!title || !author || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the db
    const newBook = new Book({
      title,
      author,
      description,
      image: imageUrl,
      user: req.user._id, // attach the user id from the token
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error in create book route", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// get all books
// pagination => infinite scroll
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1; // get the page number from the query string
    const limit = req.query.limit || 5; // number of books per page

    const skip = (page - 1) * limit; // calculate the number of books to skip

    const books = await Book.find()
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .skip(skip) // skip the books
      .limit(limit) // limit the number of books to return
      .populate("user", "username profileImage"); // populate the user field with username and profileImage

    const totalBooks = await Book.countDocuments(); // get the total number of books

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit), // calculate the total number of pages
    });

    if (!books) {
      return res.status(404).json({ message: "No books found" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error in get all books route", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

export default router;

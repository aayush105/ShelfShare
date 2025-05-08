import express from "express";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

// create
// yaha protectRoute use gareko xa, to make sure its protected and only the authenticated user who have the token can post it
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, rating, caption, image } = req.body;

    console.log("req.body", req.body); // log the request body for debugging

    if (!title || !rating || !caption || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the db
    const newBook = new Book({
      title,
      rating,
      caption,
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
  // example call from react naive - front end
  // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5")
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

// get recommended books by the own user
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books); // send the books to the client
  } catch (error) {
    console.error("Error in get user books", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// delete a book
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // check if the user is the owner/creator of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // cloudinary url
    // https://res.cloudinary.com/dqjv4xg5h/image/upload/v1698231234/ysadjkshdiasdhab.jpg
    // public id: ysadjkshdiasdhab

    // delete the image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0]; // get the public id from the image url
        await cloudinary.uploader.destroy(publicId); // delete the image from cloudinary
      } catch (error) {
        console.error("Error deleting image from cloudinary", error);
        return res.status(500).json({ message: "Internal Server error" });
      }
    }

    await book.deleteOne(); // delete the book from the db

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error in delete book route", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

export default router;

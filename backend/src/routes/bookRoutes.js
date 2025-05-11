import express from "express";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

// Genre mapping for normalization
const genreMapping = {
  // Science Fiction
  "sci-fi": "Science Fiction",
  scifi: "Science Fiction",
  "science-fiction": "Science Fiction",
  sciencefiction: "Science Fiction",
  sf: "Science Fiction",

  // Non-Fiction
  "non-fiction": "Non-Fiction",
  nonfiction: "Non-Fiction",
  "non fiction": "Non-Fiction",
  nf: "Non-Fiction",

  // Fiction
  fiction: "Fiction",
  "general fiction": "Fiction",

  // Romance
  romance: "Romance",
  romantic: "Romance",
  "love story": "Romance",
  rom: "Romance",

  // Thriller
  thriller: "Thriller",
  suspense: "Thriller",
  thrill: "Thriller",
  "psychological thriller": "Thriller",

  // Mystery
  mystery: "Mystery",
  crime: "Mystery",
  detective: "Mystery",
  whodunit: "Mystery",

  // Horror
  horror: "Horror",
  scary: "Horror",
  terror: "Horror",

  // Fantasy
  fantasy: "Fantasy",
  "high fantasy": "Fantasy",
  "epic fantasy": "Fantasy",
  fant: "Fantasy",

  // Classics
  classics: "Classics",
  classic: "Classics",
  "literary classics": "Classics",

  // Biography
  biography: "Biography",
  bio: "Biography",
  autobiography: "Biography",
  memoir: "Biography",

  // History
  history: "History",
  historical: "History",
  hist: "History",

  // Self-Help
  "self-help": "Self-Help",
  selfhelp: "Self-Help",
  "personal development": "Self-Help",
  "self-improvement": "Self-Help",

  // Cookbook
  cookbook: "Cookbook",
  cooking: "Cookbook",
  recipe: "Cookbook",
  culinary: "Cookbook",

  // Educational
  educational: "Educational",
  education: "Educational",
  academic: "Educational",
  textbook: "Educational",

  // Young Adult
  "young adult": "Young Adult",
  ya: "Young Adult",
  teen: "Young Adult",
  youth: "Young Adult",

  // Children's
  "children's": "Children's",
  childrens: "Children's",
  kids: "Children's",
  juvenile: "Children's",

  // Personal Finance
  "personal finance": "Personal Finance",
  finance: "Personal Finance",
  money: "Personal Finance",
  financial: "Personal Finance",

  // Historical Fiction
  "historical fiction": "Historical Fiction",
  histfic: "Historical Fiction",
  "historical novel": "Historical Fiction",
  historical: "Historical Fiction",

  // Literary Fiction
  "literary fiction": "Literary Fiction",
  "lit fic": "Literary Fiction",
  literary: "Literary Fiction",
  lit: "Literary Fiction",

  // Business
  business: "Business",
  biz: "Business",
  entrepreneurship: "Business",
  management: "Business",

  // Poetry
  poetry: "Poetry",
  poem: "Poetry",
  verse: "Poetry",

  // Adventure
  adventure: "Adventure",
  action: "Adventure",
  quest: "Adventure",

  // Dystopian
  dystopian: "Dystopian",
  dystopia: "Dystopian",
  "post-apocalyptic": "Dystopian",

  // Humor
  humor: "Humor",
  comedy: "Humor",
  funny: "Humor",
  satire: "Humor",

  // Graphic Novel
  "graphic novel": "Graphic Novel",
  comic: "Graphic Novel",
  manga: "Graphic Novel",
  graphic: "Graphic Novel",

  // True Crime
  "true crime": "True Crime",
  truecrime: "True Crime",
  "crime story": "True Crime",

  // Paranormal
  paranormal: "Paranormal",
  supernatural: "Paranormal",
  "ghost story": "Paranormal",

  // Western
  western: "Western",
  cowboy: "Western",
  frontier: "Western",

  // Travel
  travel: "Travel",
  travelogue: "Travel",
  "adventure travel": "Travel",
};

// create
// yaha protectRoute use gareko xa, to make sure its protected and only the authenticated user who have the token can post it
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating, genre } = req.body;

    if (!title || !caption || !image || !rating || !genre) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate genre
    const trimmedGenre = genre.trim();
    if (!trimmedGenre) {
      return res.status(400).json({ message: "Genre cannot be empty" });
    }

    // Normalize genre using genreMapping
    const normalizedGenre =
      genreMapping[trimmedGenre.toLowerCase()] || trimmedGenre;

    // Upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // Save to the db
    const newBook = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      genre: normalizedGenre,
      user: req.user._id, // Attach the user id from the token
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

    if (!books) {
      return res.status(404).json({ message: "No books found" });
    }

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit), // calculate the total number of pages
    });
  } catch (error) {
    console.error("Error in get all books route", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// get books by genre
router.get("/genre/:genre", protectRoute, async (req, res) => {
  try {
    const { genre } = req.params; // get the genre from the params
    console.log("Genre name:", genre); // Debug log to see the genre name

    const page = parseInt(req.query.page) || 1; // get the page number from the query string
    const limit = parseInt(req.query.limit) || 5; // number of books per page
    const skip = (page - 1) * limit; // calculate the number of books to skip

    const books = await Book.find({ genre: genre })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");
    // find the books by genre and sort by createdAt in descending order, skip the books and limit the number of books to return

    const totalBooks = await Book.countDocuments({ genre: genre }); // get the total number of books by genre

    res.status(200).json({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error("Error in get books by genre route", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// get all available genres
router.get("/genres", protectRoute, async (req, res) => {
  try {
    // get all unique genres
    const genres = await Book.distinct("genre"); // get all unique genres from the books collection

    // add default suggested genres
    const suggestedGenres = [
      "Fiction",
      "Non-Fiction",
      "Romance",
      "Thriller",
      "Mystery",
      "Fantasy",
      "Science Fiction",
      "Classics",
      "Biography",
      "History",
      "Self-Help",
      "Cookbook",
      "Educational",
      "Young Adult",
      "Children's",
      "Personal Finance",
      "Historical Fiction",
      "Literary Fiction",
      "Business",
    ];

    const allGenres = [...new Set([...genres, ...suggestedGenres])]
      .filter((genre) => genre && genre.trim() !== "")
      .sort(); // Sort alphabetically for better UX

    res.status(200).json(allGenres); // send the genres to the client
  } catch (error) {
    console.error("Error in get all genres route", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// get the active genre only which have atleast one book
router.get("/active-genres", protectRoute, async (req, res) => {
  try {
    // fetch the distinct genres from the books collection
    const genres = await Book.distinct("genre");

    // Filter out empty or invalid genres and sort
    const activeGenres = genres
      .filter((genre) => genre && genre.trim() !== "")
      .sort();

    res.status(200).json(activeGenres); // send the active genres to the client
  } catch (error) {
    console.error("Error in get active genres route", error);
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

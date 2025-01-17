import e, { Router } from "express";
import Books from "../models/Book.mjs";
import Users from "../models/User.mjs";
import { authenticateJWT } from "./middlewares.mjs";

const Book = Books;
const User = Users;
const router = Router();

// GET ALL
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    res.status(200).json(user.books);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ADD TO FAVORITES
router.patch("/addFavorites", authenticateJWT, async (req, res) => {
  const favorite = new Book({
    id: req.body.id,
    authors: req.body.authors,
    title: req.body.title,
    subtitle: req.body.subtitle,
    pageCount: req.body.pageCount,
    categories: req.body.categories,
    averageRating: req.body.averageRating,
    image: req.body.image,
    isFavorite: true,
    isReading: req.body.isReading,
    toBeRead: req.body.toBeRead,
    desc: req.body.desc,
  });

  try {
    const savedBook = await favorite.save();
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Check if the book already exists in the user's list
      const existingBook = user.books.some((book) => book.id === req.body.id);
      if (!existingBook) {
        try {
          // Update the user's books array
          const update = await User.findOneAndUpdate(
            { email: req.body.email },
            {
              $push: { books: savedBook }, // Push the savedBook directly
            },
            { new: true } // Return the updated document
          );
          res.status(201).json(update);
        } catch (error) {
          res.status(500).json({ message: "Something went wrong", error });
        }
      } else {
        try {
          // Update the specific book directly
          const update = await User.findOneAndUpdate(
            { email: req.body.email, "books.id": req.body.id },
            { $set: { "books.$.isFavorite": true } }, // Use $ positional operator
            { new: true } // Return the updated document
          );

          if (!update) {
            return res.status(404).json({ message: "Book not found" });
          }

          console.log("Book exists and updated");
          res.status(200).json(update);
        } catch (err) {
          res.status(500).json(err);
        }
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// REMOVE FROM FAVORITES
router.patch("/removeFavorites", authenticateJWT, async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      // Check if the book exists in the user's list
      const favoriteBook = user.books.some((book) => book.id === req.body.id);

      if (favoriteBook) {
        try {
          // Update the user's books array and set isFavorite to false
          const update = await User.findOneAndUpdate(
            { email: req.body.email, "books.id": req.body.id },
            { $set: { "books.$.isFavorite": false } }, // Use $ positional operator
            { new: true } // Return the updated document
          );

          if (!update) {
            return res.status(404).json({ message: "Book not found" });
          }

          console.log("Favorite status removed");
          return res.status(200).json(update);
        } catch (error) {
          return res.status(500).json({ message: "Something went wrong", error });
        }
      } else {
        return res.status(404).json({ message: "Book is not marked as favorite" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});


// ADD TO TBR
router.patch("/addToReadlist", authenticateJWT, async (req, res) => {
  const newTBR = new Book({
    id: req.body.id,
    authors: req.body.authors,
    title: req.body.title,
    subtitle: req.body.subtitle,
    pageCount: req.body.pageCount,
    categories: req.body.categories,
    averageRating: req.body.averageRating,
    image: req.body.image,
    isFavorite: req.body.isFavorite,
    isReading: req.body.isReading,
    toBeRead: true,
    desc: req.body.desc,
  });

  try {
    const savedTBR = await newTBR.save();
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Check if the book already exists in the user's list
      const existingBook = user.books.some((book) => book.id === req.body.id);
      if (!existingBook) {
        try {
          // Update the user's books array
          const update = await User.findOneAndUpdate(
            { email: req.body.email },
            {
              $push: { books: savedTBR }, // Push the savedBook directly
            },
            { new: true } // Return the updated document
          );
          res.status(201).json(update);
        } catch (error) {
          res.status(500).json({ message: "Something went wrong", error });
        }
      } else {
        try {
          // Update the specific book directly
          const update = await User.findOneAndUpdate(
            { email: req.body.email, "books.id": req.body.id },
            { $set: { "books.$.toBeRead": true } }, // Use $ positional operator
            { new: true } // Return the updated document
          );

          if (!update) {
            return res.status(404).json({ message: "Book not found" });
          }

          console.log("Book exists and updated");
          res.status(200).json(update);
        } catch (err) {
          res.status(500).json(err);
        }
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// REMOVE FROM TBR
router.patch("/removeFromReadlist", authenticateJWT, async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      // Check if the book exists in the user's list
      const tbrBook = user.books.some((book) => book.id === req.body.id);

      if (tbrBook) {
        try {
          // Update the user's books array and set isFavorite to false
          const update = await User.findOneAndUpdate(
            { email: req.body.email, "books.id": req.body.id },
            { $set: { "books.$.toBeRead": false } }, // Use $ positional operator
            { new: true } // Return the updated document
          );

          if (!update) {
            return res.status(404).json({ message: "Book not found" });
          }

          console.log("Favorite status removed");
          return res.status(200).json(update);
        } catch (error) {
          return res.status(500).json({ message: "Something went wrong", error });
        }
      } else {
        return res.status(404).json({ message: "Book is not marked as favorite" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});

// START READING
// router.patch("/startReading", authenticateJWT, async (req, res) => {
//   try {
//     // Find the user by email
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if any book is already being read
//     const currentlyReading = user.books.find((book) => book.isReading);

//     if (currentlyReading) {
//       return res.status(409).json({ message: "Already reading a book" });
//     }

//     // Find the book in the user's books array
//     const bookIndex = user.books.findIndex((book) => book.id === req.body.id);

//     if (bookIndex === -1) {
//       return res.status(404).json({ message: "Book not found in user's list" });
//     }

//     // Update the book's isReading status
//     user.books[bookIndex] = {
//       ...user.books[bookIndex].toObject(),
//       isReading: true,
//     };

//     // Save the updated user document
//     await user.save();

//     return res.status(200).json({
//       message: "Book marked as currently reading",
//       book: user.books[bookIndex],
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Something went wrong", error });
//   }
// });
router.patch("/startReading", authenticateJWT, async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if any book is already being read
    const currentlyReading = user.books.find((book) => book.isReading);

    if (currentlyReading) {
      return res.status(409).json({ message: "Already reading a book" });
    }

    // Find the book in the user's books array
    const bookIndex = user.books.findIndex((book) => book.id === req.body.id);

    if (bookIndex === -1) {
      // If the book is not found in the user's list, create a new book
      const newBook = {
        id: req.body.id,
        authors: req.body.authors,
        title: req.body.title,
        subtitle: req.body.subtitle,
        pageCount: req.body.pageCount,
        categories: req.body.categories,
        averageRating: req.body.averageRating,
        image: req.body.image,
        isFavorite: req.body.isFavorite || false,
        isReading: true, // Set as currently reading
        toBeRead: req.body.toBeRead || false,
        desc: req.body.desc,
      };

      user.books.push(newBook);

      // Save the updated user document
      await user.save();

      return res.status(201).json({
        message: "Book added and marked as currently reading",
        book: newBook,
      });
    }

    // If the book exists, update the book's isReading status
    user.books[bookIndex] = {
      ...user.books[bookIndex].toObject(),
      isReading: true,
    };

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Book marked as currently reading",
      book: user.books[bookIndex],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});


// STOP READING
router.patch("/stopReading", authenticateJWT, async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the book in the user's books array
    const bookIndex = user.books.findIndex((book) => book.id === req.body.id);

    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found in user's list" });
    }

    // Update the book's isReading status
    user.books[bookIndex] = {
      ...user.books[bookIndex].toObject(),
      isReading: false,
    };

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Book marked as not currently reading",
      book: user.books[bookIndex],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});

// MARK AS COMPLETED
router.patch("/markAsCompleted", authenticateJWT, async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the book in the user's books array
    const bookIndex = user.books.findIndex((book) => book.id === req.body.id);

    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found in user's list" });
    }

    // Update the book's isCompleted status
    user.books[bookIndex] = {
      ...user.books[bookIndex].toObject(),
      isReading: false, // Stop reading the book as it's completed
      isCompleted: true,
    };

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Book marked as completed",
      book: user.books[bookIndex],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});



export default router;

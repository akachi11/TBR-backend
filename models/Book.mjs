import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema(
  {
    id: {type: String, required: true},
    authors: { type: [String], required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    pageCount: { type: Number },
    categories: { type: [String], required: true },
    averageRating: { type: String },
    image: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    isReading: { type: Boolean, default: false },
    toBeRead: { type: Boolean, default: false },
    desc: { type: String, required: true }
  },
  { timestamps: true }
);

const Books = mongoose.model("Book", BookSchema);

export default Books;

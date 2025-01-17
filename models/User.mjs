import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  books: [
    {
      id: { type: String, required: true },
      authors: { type: [String], required: true },
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      pageCount: { type: Number },
      categories: { type: [String], required: true },
      averageRating: { type: String },
      image: { type: String, required: true },
      isFavorite: { type: Boolean, default: false },
      isReading: { type: Boolean, default: false },
      isCompleted: { type: Boolean, default: false },
      toBeRead: { type: Boolean, default: false },
      desc: { type: String, required: true },
    },
  ],
  password: { type: String, required: true },
});

const Users = mongoose.model("User", UserSchema);

export default Users;

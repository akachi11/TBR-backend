import { Router } from "express";
import Users from "../models/User.mjs";
import jwt from "jsonwebtoken";

const User = Users;
const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(403).json("Email in use");
    } else {
      const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      });
      const user = newUser.toObject();

      delete user.password;

      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (req.body.password === user.password) {
        const { password, books, ...otherInfo } = user.toObject();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });

        res.status(200).json({...otherInfo, token});  
      } else {
        res.status(401).json("Wrong password");
      }
    } else {
      res.status(400).json("Wrong email");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;

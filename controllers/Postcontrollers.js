const { get } = require("mongoose");
const Post = require("../models/post");
const bcrypt = require("bcrypt");

const uploadpost = async (req, res) => {
  try {
    const newpost = new Post(req.body);
    const savedpost = await newpost.save();
    res.status(200).json(savedpost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading post" });
  }
};

const getpost = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error getting post" });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  try {
    const user = new User({
      email: email,
      password: hashedpassword,
    });
    const saveduser = await user.save();
    res.status(201).json(saveduser);
  } catch (error) {
    res.status(500).json({ message: "User already registered" });
  }
};

const login = async (req,res) => {
  const {email , password} = req.body;
  
}

module.exports = {
  uploadpost,
  getpost,
  register,
};

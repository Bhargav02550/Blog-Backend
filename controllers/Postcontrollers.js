const { get } = require("mongoose");
const Post = require("../models/post");
const User = require("../models/users");
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
    let posts = await Post.find();
    posts = posts.map((post) => {
      const maxLength = 100;
      let content = post.content.substring(0, maxLength);
      if (post.content.length > maxLength) {
        content = content.substring(0, content.lastIndexOf(" ")) + "...";
      }

      return {
        ...post._doc,
        content,
      };
    });
    res.status(200).json(posts);
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
    res.status(500).json({ message: "Error Registering User" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const current_user = await User.findOne({ email: email });

  const isCorrectPassword = await bcrypt.compare(
    password,
    current_user.password
  );

  if (
    current_user &&
    (isCorrectPassword || isCorrectPassword === true) &&
    current_user.isLoggedIn === false
  ) {
    const access_token = current_user._id;
    res.status(201).json({ access_token, message: "Login Success" });
    current_user.isLoggedIn = true;
    await current_user.save();
  } else if (current_user && current_user.isLoggedIn === true) {
    res.status(401).json({ message: "User already logged in" });
  } else if (
    (await bcrypt.compare(password, current_user.password)) === false
  ) {
    res.status(401).json({ message: "Wrong password" });
  }
};

const logout = async (req, res) => {
  const { access_token } = req.body;
  console.log(access_token);

  try {
    const present_user = await User.findOne({ _id: access_token });
    if (!present_user) {
      res.status(401).json({ message: "Wrong user" });
    } else {
      present_user.isLoggedIn = false;
      await present_user.save();
      res.status(200).json({
        message: "Successfully logged out",
        access_token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error Logging out user" });
  }
};

module.exports = {
  uploadpost,
  getpost,
  register,
  login,
  logout,
};

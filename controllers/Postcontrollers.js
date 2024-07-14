const { get } = require("mongoose");
const Post = require("../models/post");


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

const getpost = async (req,res) => {
    try{
        const post = await Post.find();
        res.status(200).json(post);

    }
    catch(error){
        res.status(500).json({message:"Error getting post"});
    }
}


module.exports = {
  uploadpost,
  getpost,
};

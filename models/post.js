const mongoose = require("mongoose");
const schema = mongoose.Schema;

const postSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  image:{
    type:String,
    required:true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: Object,
    default: {},
  },
  hash_tags: {
    type: Object,
    default: {},
  },
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Post", postSchema);

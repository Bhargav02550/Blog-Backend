const express = require("express");
const Router = express.Router();

// const Posts = require("../models/post");

const Postcontroller = require("../controllers/Postcontrollers");

Router.post("/upload_post",Postcontroller.uploadpost);
// Router.post("/post_fake_data",Postcontroller.fakedata);
Router.get("/get_posts",Postcontroller.getpost);
Router.post("/register",Postcontroller.register);

module.exports = Router;
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Post = require("./models/post");
const User = require("./models/users");
const cors = require("cors");
const env = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");

var app = express();

app.use(cors());

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
env.config({ path: "./.env" });

// const corsOptions ={
//     origin:'http://localhost:3000',
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }

app.use("/api", require("./routes/Postroutes"));

// POST route to generate fake data using faker
app.post("/generate-fake-data", async (req, res) => {
  try {
    const fakePosts = [];
    for (let i = 0; i < 10; i++) {
      fakePosts.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        author: faker.person.fullName(),
        image: faker.image.urlPicsumPhotos(),
        created_date: faker.date.past(),
        comments: {
          [faker.string.uuid()]: faker.lorem.sentence(),
          [faker.string.uuid()]: faker.lorem.sentence(),
        },
        hash_tags: {
          [faker.string.uuid()]: faker.lorem.word(),
          [faker.string.uuid()]: faker.lorem.word(),
        },
        likes: faker.number.int({ min: 0, max: 100 }),
      });
    }

    for (let post of fakePosts) {
      const newPost = new Post(post);
      await newPost.save();
    }

    res.send("Fake data generated and inserted.");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating fake data.");
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler

const mongodb_url = process.env.MONGODB_URL;

mongoose
  .connect(mongodb_url)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// io.on("connection", (socket) => {
//   console.log("A user connected");
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

server.listen(process.env.PORT || 8000, (req, res) => {
  console.log(`Server running on Port:${process.env.PORT || 8000}`);
});

module.exports = app;

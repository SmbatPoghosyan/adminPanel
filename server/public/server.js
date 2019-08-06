//server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const dbConfig = require("../config/database.config");
const branches = require("../routes/branch.routes");
const playlists = require("../routes/playlist.routes");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/../../storage/files");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../../storage")));
app.use("/branches", branches);
app.use("/playlists", playlists);

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.json(req.file);
  } else throw "error";
});

const port = process.env.PORT;

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useFindAndModify: false
});
app.get("/", (req, res) => {
  res.send("Hiiii");
});

app.listen(port, _ => console.log(`The server is listening on port ${port}`));

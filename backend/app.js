const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/UserRoutes.js");
const cors = require("cors");
const { join, dirname } = require("path");
const { fileURLToPath } = require("url");
const bodyParser = require("body-parser");

dotenv.config();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("thumbnails"));
app.use(express.static("videoCourse"));
app.use(express.static("questionSheet"));
app.use(express.static(join(__dirname, "build")));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", userRoutes);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Use __dirname in your code as before
app.use(express.static(join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "build", "index.html"));
});

app.use("/thumbnails", express.static(join(__dirname, "thumbnails")));
app.use("/videoCourse", express.static(join(__dirname, "videoCourse")));
app.use("/questionSheet", express.static(join(__dirname, "questionSheet")));

// rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

// PORT
const PORT = process.env.PORT || 7070;

// run listen
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgCyan.white);
});

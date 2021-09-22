const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "files"));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.get("/api/info", (req, res) => res.send("The backend is working 5/5."));

app.post("/api/files", upload.array("file"), (req, res, next) => {
  res.end();
});

app.delete("/api/files/:filename", (req, res, next) => {
  const { filename } = req.params;
  fs.unlink(path.join(__dirname, `files/${filename}`), (err) => {
    res.end();
  });
});

app.use((err, req, res, next) => {
  res.status(500).end();
});

app.listen(3000, () => console.log("Server App is running..."));

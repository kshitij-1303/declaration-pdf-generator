require("dotenv").config();

const express = require("express");
const PDFDocument = require("pdfkit");
const path = require("path");
const myDeclaration = require("./routes/myDeclaration");
const newDeclaration = require("./routes/newDeclaration");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/pdf", myDeclaration);
app.use("/pdf", newDeclaration);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(PORT, () => {
  console.log(`app is listening to port ${PORT}`);
});

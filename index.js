require("dotenv").config();

const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const blobStream = require("blob-stream");

const PORT = process.env.PORT || 3000;

const app = express();

const doc = new PDFDocument();

app.get("/", (req, res) => {
  console.log("welcome");
});

app.get("/pdf", async (req, res) => {
  doc.pipe(fs.createWriteStream("declaration.pdf"));
  const { date1, date2, total } = req.query;
  const boldElements = [
    "Kshitij Deshpande",
    "Career Camp",
    "Frontend Development Course",
    "Bank name: State bank of India",
    "Accout number: 00000040612666706",
    "IFSC Code: SBIN0009408",
    "Benificiary name:",
  ];

  const data = `This is to declare that myself \
  ${boldElements[0]} interned as a Teacher Assistant at Sunrise Mentors Private Limited [Coding Ninjas]. As a Teaching Assistant, I assisted students of ${boldElements[1]} | ${boldElements[2]} for doubts related to curriculam & provided mentorship to the students. I took a total of 4 doubt classes from ${date1} to ${date2}. The stipend earned by me during this internship: Rs.${total}/- as per my performance and I accept this. Bank details as mentioned below :-
  ${boldElements[6]}: ${boldElements[0]}
  
  ${boldElements[3]}

  ${boldElements[4]}

  ${boldElements[5]}
  `;

  doc.font("Helvetica").fontSize(14);
  doc.text(`${data}`, {
    width: 410,
    align: "justify",
  });
  doc.end();

  console.log("your pdf will be generated ");
  res.send("your pdf will be generated");
});

app.listen(PORT, () => {
  console.log(`app is listening to port ${PORT}`);
});

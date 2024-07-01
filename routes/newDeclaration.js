const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const multer = require("multer");
const camelCaseToWords = require("../utils/camelCaseToWords");

const router = express.Router();

let newData = {};
let signaturePath;
let panPath;

function makeBold(ele) {
  newDoc.font("Helvetica-Bold").text(ele, { continued: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // File size 5mb
});

const newDoc = new PDFDocument();

router.get("/new", (req, res) => {
  res.render("new.ejs");
});

router.post(
  "/new/generate",
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "PAN", maxCount: 1 },
  ]),
  async (req, res) => {
    const signatureFile = req.files["signature"][0];
    const panFile = req.files["PAN"][0];

    newData = req.body;

    Object.keys(newData).forEach((key, index) => {
      newData[key] =
        index > 1 && index < 5 ? newData[key] + "\n\n\n" : newData[key];
    });

    signaturePath = signatureFile.path;
    panPath = panFile.path;

    res.redirect("/pdf/new/generatePdf");
  }
);

router.get("/new/generatePdf", (req, res) => {
  const startDate = new Date(newData.date1).toLocaleString().split(",")[0];
  const endDate = new Date(newData.date2).toLocaleString().split(",")[0];

  const stream = fs.createWriteStream("new_declaration.pdf");

  newDoc.pipe(stream);

  newDoc.font("Helvetica").fontSize(14);
  newDoc.text(`This is to declare that myself `, {
    // width: 410,
    align: "justify",
    continued: true,
  });

  makeBold(newData.benificiaryName + " ");

  newDoc.font("Helvetica").fontSize(14);
  newDoc.text(
    `interned as a Teacher Assistant at Sunrise Mentors Private Limited [Coding Ninjas]. As a Teaching Assistant, I assisted students of`,
    {
      // width: 410,
      align: "justify",
      continued: true,
    }
  );
  makeBold(" " + newData.course + " ");

  newDoc.font("Helvetica").fontSize(14);
  newDoc.text(
    `for doubts related to curriculam & provided mentorship to the students. I took a total of 4 doubt classes from `,
    {
      align: "justify",
      continued: true,
    }
  );

  makeBold(startDate + " to " + endDate + " ");

  newDoc.font("Helvetica").fontSize(14);
  newDoc.text(`The stipend earned by me during this internship: Rs.`, {
    align: "justify",
    continued: true,
  });

  makeBold(newData.stipend);

  newDoc.font("Helvetica").fontSize(14);
  newDoc.text(
    `/- as per my performance and I accept this. Bank details as mentioned below :- \n\n\n\n`,
    {
      // width: 410,
      align: "justify",
      continued: true,
    }
  );
  const nameChange = camelCaseToWords(Object.keys(newData)[0]);
  makeBold(`${nameChange}: ${newData.benificiaryName}\n\n\n`);

  Object.keys(newData).forEach((key, idx) => {
    if (idx > 1 && idx < 5) {
      const val = newData[key];
      key = camelCaseToWords(key);
      makeBold(`${key}: ${val}`);
    }
  });

  newDoc.text(`\n\n\n\n\n\n\n${newData.benificiaryName}\n${newData.phone}`, {
    width: 410,
    align: "justify",
    continued: true,
  });

  newDoc.image(`./${signaturePath}`, 70, 360, { width: 150, height: 80 });

  newDoc.image(`./${panPath}`, 70, 550, { width: 250, height: 150 });

  newDoc.end();
  const pdfPath = "new_declaration.pdf";

  stream.on("finish", () => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${pdfPath}`);
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      fs.unlink(pdfPath, (err) => {
        if (err) {
          console.log("error deleting the file: ", err);
        } else {
          console.log("file deleted successfully");
        }
      });
    });
  });
});

module.exports = router;

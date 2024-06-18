const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const camelCaseToWords = require("../utils/camelCaseToWords");

const formFields = {
  benificiaryName: process.env.NAME,
  course: process.env.COURSE,
  bank: process.env.BANK,
  accountNumber: process.env.ACCOUNT_NUMBER,
  IFSC: process.env.IFSC,
  phone: process.env.PHONE,
};

// Add new line characters to fields

Object.keys(formFields).forEach((key, index) => {
  formFields[key] = index != 1 ? formFields[key] + "\n\n\n" : formFields[key];
});

// To make certain words bold

function makeBold(ele) {
  doc.font("Helvetica-Bold").text(ele, { continued: true });
}

let myData = {};

const doc = new PDFDocument();

router.post("/info/check", (req, res) => {
  myData = req.body;
  if (myData.password == process.env.PASSWORD) {
    res.redirect("/pdf/my");
  } else {
    res.send("Wrong password");
  }
});

router.get("/info", (req, res) => {
  res.render("myTemplateInfo.ejs");
});

router.get("/my", (req, res) => {
  console.log(myData);
  const startDate = new Date(myData.date1).toLocaleString().split(",")[0];
  const endDate = new Date(myData.date2).toLocaleString().split(",")[0];
  const writeStream = fs.createWriteStream("declaration.pdf");
  doc.pipe(writeStream);
  // const { date1,date2,  total } = req.query;
  const total = `${myData.stipend}`;

  doc.font("Helvetica").fontSize(14);
  doc.text(`This is to declare that myself `, {
    // width: 410,
    align: "justify",
    continued: true,
  });

  makeBold("Kshitij Deshpande ");

  doc.font("Helvetica").fontSize(14);
  doc.text(
    `interned as a Teacher Assistant at Sunrise Mentors Private Limited [Coding Ninjas]. As a Teaching Assistant, I assisted students of `,
    {
      // width: 410,
      align: "justify",
      continued: true,
    }
  );
  makeBold(" " + formFields.course + " ");

  doc.font("Helvetica").fontSize(14);
  doc.text(
    `for doubts related to curriculam & provided mentorship to the students. I took a total of 4 doubt classes from `,
    {
      // width: 410,
      align: "justify",
      continued: true,
    }
  );

  makeBold(startDate + " to " + endDate);

  doc.font("Helvetica").fontSize(14);
  doc.text(`. The stipend earned by me during this internship: Rs.`, {
    alignn: "justify",
    continued: true,
  });
  makeBold(total);

  doc.font("Helvetica").fontSize(14);
  doc.text(
    `/- as per my performance and I accept this. Bank details as mentioned below :- \n\n\n\n`,
    {
      // width: 410,
      align: "justify",
      continued: true,
    }
  );
  const nameChange = camelCaseToWords(Object.keys(formFields)[0]);
  makeBold(`${nameChange}: ${formFields.benificiaryName}`);

  Object.keys(formFields).forEach((key, idx) => {
    if (idx > 1 && idx != 5) {
      const val = formFields[key];
      key = camelCaseToWords(key);
      makeBold(`${key}: ${val}`);
    }
  });

  doc.text(`\n\n\n\n\n\n\n${formFields.benificiaryName}${formFields.phone}`, {
    width: 410,
    align: "justify",
    continued: true,
  });

  doc.image("./images/Signature.png", 70, 400, { width: 150, height: 80 });

  doc.image("./images/Pan-card.png", 70, 600, { width: 250, height: 150 });

  doc.end();
  const pdfPath = "declaration.pdf";

  writeStream.on("finish", () => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${pdfPath}`);
    fs.createReadStream(pdfPath).pipe(res);
  });
});

module.exports = router;

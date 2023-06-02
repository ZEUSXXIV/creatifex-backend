const webp = require("webp-converter");



const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const cors = require("cors");



const app = express();

// Enable file uploads
app.use(fileUpload());

app.use(cors());


// Handle POST request to /upload endpoint
app.post("/upload", (req, res) => {
  if (!req.files || !req.files.image) {
    res.status(400).send("No image file uploaded");
    return;
  }

  // Get the uploaded image file
  const imageFile = req.files.image;

  // Generate a unique filename for the temporary file

  const id = `image-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const tempFilename = `${id}.png`;
  const tempFilePath = path.join(__dirname + "/temp/", tempFilename);

  // Save the image file to the temporary file
  imageFile.mv(tempFilePath, (err) => {
    if (err) {
      console.log("err==>>", err);
      res.status(500).send("Error saving file");
      return;
    }

    // convert from jpg to webp

    const convertedFilename = `${id}.webp`;
    const convertedFilePath = path.join(
      __dirname + "/converted/",
      convertedFilename
    );

    const result = webp.cwebp(
      tempFilePath,
      convertedFilePath,
      "-q 100",
      (logging = "-v")
    );
    result.then(async (response) => {

      const buffer = fs.readFileSync(convertedFilePath);

      console.log("buffer==>>", buffer);

  

      res.send({ imageUrl: buffer });
    });

  });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

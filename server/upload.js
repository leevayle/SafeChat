// upload.js

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'images', 'profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const idPhn = req.body.id_phn; // Get the id_phn from the body
    const ext = path.extname(file.originalname); // Get file extension
    const filename = `${idPhn}${ext}`; // Create a filename using id_phn
    cb(null, filename);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Route to handle the file upload (as an API)
function handleFileUpload(app) {
  app.post('/upload.js', upload.single('profilePic'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Success response
    res.json({
      message: 'File uploaded successfully!',
      filename: req.file.filename,
    });
  });
}

module.exports = handleFileUpload;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), (req, res) => {
  res.send("File Uploaded");
});

router.get('/', auth, (req, res) => {
  const files = fs.readdirSync('uploads');
  res.json(files);
});

router.get('/download/:name', auth, (req, res) => {
  res.download('uploads/' + req.params.name);
});

router.delete('/:name', auth, (req, res) => {
  fs.unlinkSync('uploads/' + req.params.name);
  res.send("File Deleted");
});

module.exports = router;
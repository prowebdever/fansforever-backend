const router = require('express').Router();
const multer = require('multer');
const cors = require('cors');
const {
  addJsonToIPFSHandler,
  addFileToIPFSHandler,
} = require('../controllers/ipfsController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/json', cors(), addJsonToIPFSHandler);

router.post('/file', cors(), upload.single('file'), addFileToIPFSHandler);

module.exports = router;

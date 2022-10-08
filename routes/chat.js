const router = require('express').Router();
var cors = require('cors');
const {
  getChatDataHandler,
  addChatDataHandler,
  getNewMessageNumber

} = require('../controllers/chatController');

router.post('/getMessage',cors(), getChatDataHandler);

router.post('/addMessage',cors(), addChatDataHandler);

router.post('/getNewMessageNumber',cors(), getNewMessageNumber);
module.exports = router;

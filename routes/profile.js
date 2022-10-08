const router = require('express').Router();
const cors = require('cors')
const {
  checkUserHandleExistsHandler,
  getProfileHandler,
  addProfileHandler,
  updateProfileHandler,
  addFollowHandler,
  FollowHandler,
  UnFollowHandler
} = require('../controllers/profileController');

router.get('/',cors(), getProfileHandler);

router.post('/',cors(), addProfileHandler);

router.put('/',cors(), updateProfileHandler);

router.get('/user',cors(), checkUserHandleExistsHandler);

router.post('/follow',cors(), FollowHandler);

router.post('/unfollow',cors(), UnFollowHandler);
module.exports = router;

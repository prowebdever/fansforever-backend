const router = require('express').Router();
var cors = require('cors');
const {
  getAuctionsHandler,
  getSingleAuctionHandler,
  getRecommendedAutionHandler,
  createAuctionHandler,
  getHotAuctionsHandler,
  claimAssetHandler,
  claimTokenHandler,
  cancelAuctionHandler
} = require('../controllers/auctionController');

router.get('/', cors({origin: "*"}), getSingleAuctionHandler);

router.get('/list',cors({origin: "*"}), getAuctionsHandler);

router.get('/recommended', cors({origin: "*"}),getRecommendedAutionHandler);

router.get('/hot', cors({origin: "*"}),getHotAuctionsHandler);

router.post('/',cors({origin: "*"}), createAuctionHandler);

router.post('/claim/asset',cors({origin: "*"}), claimAssetHandler);

router.post('/claim/token',cors({origin: "*"}), claimTokenHandler);

router.post('/cancel',cors({origin: "*"}), cancelAuctionHandler);

module.exports = router;

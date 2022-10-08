const router = require('express').Router();
const cors = require('cors')
const {
  fetchNFTsListHandler,
  fetchSingleNFTHandler,
  createNFTHandler,
  updateNFTHandler,
  fetchAllNFTHandler,
  buyNFTHandler,
  deleteNFTHandler
} = require('../controllers/nftController');

router.get('/listall', cors(),fetchAllNFTHandler);

router.post('/details/:tokenId', cors(),fetchSingleNFTHandler);

router.post('/list',cors(), fetchNFTsListHandler);

router.post('/',cors(), createNFTHandler);

router.put('/',cors(), updateNFTHandler);

router.put('/buy',cors(), buyNFTHandler);

router.post('/delete',cors(), deleteNFTHandler);
module.exports = router;

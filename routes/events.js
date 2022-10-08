const router = require('express').Router();
const cors = require('cors')
const {
  getAuctionBidEventsHandler,
  getAuctionCreateEventsHandler,
  getAuctionClaimTokensEventsHandler,
  createBidEventHandler,
} = require('../controllers/eventsController');

router.get('/auction/create',cors(), getAuctionCreateEventsHandler);

router.get('/auction/bids',cors(), getAuctionBidEventsHandler);

router.get('/auction/claim-tokens',cors(), getAuctionClaimTokensEventsHandler);

router.post('/auction/bids/event',cors(), createBidEventHandler);

module.exports = router;

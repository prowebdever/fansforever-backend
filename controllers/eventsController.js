const AuctionCreateEvent = require('../models/auction-engine/AuctionCreatedEvent');
const AuctionBidEvent = require('../models/auction-engine/AuctionBidEvent');
const AuctionClaimTokensEvent = require('../models/auction-engine/AuctionClaimTokensEvent');

const config = require('../config');

const masterAuctionContractAddress = config.masterAuctionContractAddress;

const getAuctionCreateEventsHandler = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const createEvents = await AuctionCreateEvent.find()
      .sort({
        block_timestamp: -1,
      })
      .limit(limit);
    res.status(200).json({ events: createEvents });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const getAuctionBidEventsHandler = async (req, res) => {
  try {
    const {
      auctionIndex,
      // limit = 5
    } = req.query;
    const bidEvents = await AuctionBidEvent.aggregate()
      .match({
        'result._index': auctionIndex,
        contract_address: masterAuctionContractAddress,
      })
      .lookup({
        from: 'userprofiles',
        localField: 'result._bidder',
        foreignField: 'userCryptoAddress',
        as: 'user',
      })
      .project({
        transaction_id: 1,
        block_timestamp: 1,
        'result._bidder': 1,
        'result.amount': 1,
        'result._index': 1,
        user_account_handle: { $arrayElemAt: ['$user.userAccountHandle', 0] },
        user_profile_image_url: {
          $arrayElemAt: ['$user.userProfileImageUrl', 0],
        },
      })
      .sort({ block_timestamp: -1 });
    // .limit(limit);
    res.status(200).json({ events: bidEvents });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const getAuctionClaimTokensEventsHandler = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const claimTokensEvents = await AuctionClaimTokensEvent.find()
      .sort({
        block_timestamp: -1,
      })
      .limit(limit);
    res.status(200).json({ events: claimTokensEvents });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const createBidEventHandler = async (req, res) => {
  try {
    console.log("create bidevent", {...req.body.events})
    const event = new AuctionBidEvent({...req.body.events});
    const doc = await event.save();
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};


module.exports = {
  getAuctionCreateEventsHandler,
  getAuctionBidEventsHandler,
  getAuctionClaimTokensEventsHandler,
  createBidEventHandler
};

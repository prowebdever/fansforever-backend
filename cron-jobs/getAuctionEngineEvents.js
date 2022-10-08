const TronWeb = require('tronweb');
const TronGrid = require('trongrid');
const mongoose = require('mongoose');

const fetchAuctionCreatedEventsTask = require('./auction-engine/fetchAuctionCreatedEventsTask');
const fetchAuctionBidEventsTask = require('./auction-engine/fetchAuctionBidEventsTask');
const fetchAuctionClaimTokensEventsTask = require('./auction-engine/fetchAuctionClaimTokensEventsTask');
const fetchAuctionClaimAssetEventsTask = require('./auction-engine/fetchAuctionClaimAssetEventsTask');

const config = require('../config');

const fullHost = config.fullHost;
const mongodbURI = config.mongodbURI;
const masterAuctionContractAddress = config.masterAuctionContractAddress;

const tronWeb = new TronWeb({ fullHost });
const tronGrid = new TronGrid(tronWeb);

mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');

    // CRON Job to fetch Auction Created Events.
    fetchAuctionCreatedEventsTask(
      tronGrid,
      masterAuctionContractAddress
    ).start();

    // CRON Job to fetch Auction Bid Events.
    fetchAuctionBidEventsTask(tronGrid, masterAuctionContractAddress).start();

    // CRON Job to fetch Auction Claim Tokens Events.
    fetchAuctionClaimTokensEventsTask(
      tronGrid,
      masterAuctionContractAddress
    ).start();

    // CRON Job to fetch Auction Claim Asset Events.
    fetchAuctionClaimAssetEventsTask(
      tronGrid,
      masterAuctionContractAddress
    ).start();
  })
  .catch((err) => console.error(err));

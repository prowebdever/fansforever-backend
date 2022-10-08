const { Schema, model } = require('mongoose');

const convertHexToBase58Address = require('../../utils/convertHexToBase58');

const NFT = require('../NFT');
const Auction = require('../Auction');
const UserProfile = require('../UserProfile');
const config = require('../../config');

const auctionClaimAssetEventSchema = new Schema(
  {
    block_number: { type: Number, required: true },
    block_timestamp: { type: Number, required: true },
    caller_contract_address: { type: String, required: true },
    contract_address: { type: String, required: true },
    event_index: { type: Number, required: true },
    event_name: { type: String, required: true, index: true },
    result: {
      0: { type: String, required: true },
      1: { type: String, required: true, set: convertHexToBase58Address },
      auctionIndex: { type: String, required: true, index: true },
      claimer: { type: String, required: true, set: convertHexToBase58Address },
    },
    result_type: {
      auctionIndex: { type: String, required: true },
      claimer: { type: String, required: true },
    },
    transaction_id: { type: String, required: true, index: true, unique: true },
  },
  {
    _id: true,
    timestamps: true,
  }
);

auctionClaimAssetEventSchema.post('save', async function (doc) {
  try {
    if (doc && doc.result) {
      const { claimer, auctionIndex } = doc.result;
      const [auction, user] = await Promise.all([
        Auction.findOne({
          'auctionEventResult.result._index': auctionIndex,
          'auctionEventResult.contract_address':
            config.masterAuctionContractAddress,
        }),
        UserProfile.findOne({ userCryptoAddress: claimer }),
      ]);
      if (auction) {
        const nft = await NFT.findOne({
          'mintEventResult.result.tokenId':
            auction.auctionEventResult.result._assetID,
          'mintEventResult.contract_address':
            config.justFanCollectionContractAddress,
        });
        if (user) {
          nft.tokenId = auction.auctionEventResult.result._assetId;
          nft.isMovedToAuction = false;
          nft.tags = [];
          nft.owners.push(user._id);
          nft.ownerWalletAddress = claimer;
          nft.save();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

auctionClaimAssetEventSchema.post('findOneAndUpdate', async function (doc) {
  try {
    if (doc && doc.result) {
      const { claimer, auctionIndex } = doc.result;
      const [auction, user] = await Promise.all([
        Auction.findOne({
          'auctionEventResult.result._index': auctionIndex,
          'auctionEventResult.contract_address':
            config.masterAuctionContractAddress,
        }),
        UserProfile.findOne({ userCryptoAddress: claimer }),
      ]);
      if (auction) {
        const nft = await NFT.findOne({
          'mintEventResult.result.tokenId':
            auction.auctionEventResult.result._assetID,
          'mintEventResult.contract_address':
            config.justFanCollectionContractAddress,
        });
        if (user) {
          nft.tokenId = auction.auctionEventResult.result._assetId;
          nft.isMovedToAuction = false;
          nft.isApprovedForAuction = false;
          nft.tags = [];
          nft.owners.push(user._id);
          nft.ownerWalletAddress = claimer;
          nft.save();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = model('AuctionClaimAsset', auctionClaimAssetEventSchema);

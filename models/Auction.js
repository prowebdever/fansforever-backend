const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const NFT = require('./NFT');

const auctionSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: uuidv4,
      unique: true,
    },
    nftDetails: {
      type: Object,
      required: true,
    },
    isTokenClaimed:{type:Boolean, default: false},
    isAssetClaimed:{type:Boolean, default: false},
    startPrice: { type: Number, required: true },
    startTime: { type: Number, required: true },
    duration: { type: Number, required: true },
    endsAt: { type: Number, required: false },
    instantSalePrice: { type: Number, required: true },
    auctionTransactionId: { type: String },
    auctionEventResult: {},
    trc20TokenAddress: {
      type: String,
      required: true,
      default: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
    },
    isTrxAuction: {
      type: Boolean,
      required: false,
      default: function () {
        return this.trc20TokenAddress === 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';
      },
    },
    tags: [{ type: String, trim: true, lowercase: true }],
  },
  {
    _id: true,
    timestamps: true,
  }
);

// Calculate & set endsAt property value.
auctionSchema.pre('save', function (next) {
  this.endsAt = this.startTime + this.duration;
  next();
});

// Set if Auction is TRX auction or not
auctionSchema.pre('save', function (next) {
  this.isTrxAuction =
    this.trc20TokenAddress === 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';
  next();
});

// Update NFT document isMovedToAuctionStatus after auction creation
auctionSchema.post('save', async function (doc) {
  try {
    const nft = await NFT.findById(doc.nftDetails._id);
    if (nft) {
      nft.isMovedToAuction = true;
      nft.save();
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = model('Auction', auctionSchema);

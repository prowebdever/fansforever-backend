const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const nftSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: uuidv4,
      unique: true,
    },
    tokenId: {
      type: String,
      required: false,
      trim: true,
      index: true,
      sparse: true,
    },
    assetName: { type: String, required: true, trim: true },
    assetDescription: { type: String, required: true, trim: true },
    assetMimetype: { type: String, required: true, trim: true },
    assetIpfsHash: { type: String, required: true, trim: true },
    nftIpfsHash: { type: String, required: true, trim: true },
    userContractAddress: { type: String, required: true, trim: true },
    userWalletAddress: { type: String, required: true, trim: true },
    ownerWalletAddress: { type: String, required: true, trim: true },
    mintTransactionId: { type: String },
    mintEventResult: {},
    isApprovedForAuction: { type: Boolean, required: true, default: false },
    isMovedToAuction: { type: Boolean, required: true, default: false },
    approvedTransactionId: { type: String },
    approvedEventResult: {},
    tags: [{ type: String, trim: true, lowercase: true }],
    owners: [],
    buyInfo:[],
  },
  {
    _id: true,
    timestamps: true,
  }
);

module.exports = model('NFT', nftSchema);

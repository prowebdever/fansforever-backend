const { Schema, model } = require('mongoose');
const convertHexToBase58Address = require('../../utils/convertHexToBase58');

const auctionCreatedEventSchema = new Schema(
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
      2: { type: String, required: true, set: convertHexToBase58Address },
      3: { type: String, required: true },
      _assetID: { type: String, required: true },
      _creator: {
        type: String,
        required: true,
        set: convertHexToBase58Address,
      },
      _index: { type: String, required: true, index: true, unique: true },
      _asset: { type: String, required: true, set: convertHexToBase58Address },
    },
    result_type: {
      _assetID: { type: String, required: true },
      _creator: { type: String, required: true },
      _index: { type: String, required: true },
      _asset: { type: String, required: true },
    },
    transaction_id: { type: String, required: true, index: true, unique: true },
  },
  {
    _id: true,
    timestamps: true,
  }
);

module.exports = model('AuctionCreatedEvent', auctionCreatedEventSchema);

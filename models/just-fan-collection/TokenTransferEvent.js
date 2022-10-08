const { Schema, model } = require('mongoose');
const convertHexToBase58Address = require('../../utils/convertHexToBase58');

const tokenTransferEventSchema = new Schema(
  {
    block_number: { type: Number, required: true },
    block_timestamp: { type: Number, required: true },
    caller_contract_address: { type: String, required: true },
    contract_address: { type: String, required: true },
    event_index: { type: Number, required: true },
    event_name: { type: String, required: true, index: true },
    result: {
      0: { type: String, required: true, set: convertHexToBase58Address },
      1: { type: String, required: true, set: convertHexToBase58Address },
      2: { type: String, required: true },
      tokenId: { type: String, required: true, index: true },
      from: {
        type: String,
        required: true,
        set: convertHexToBase58Address,
        index: true,
      },
      to: {
        type: String,
        required: true,
        set: convertHexToBase58Address,
        index: true,
      },
    },
    result_type: {
      tokenId: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    transaction_id: { type: String, required: true, index: true, unique: true },
  },
  {
    _id: true,
    timestamps: true,
  }
);

module.exports = model('TokenTransferEvent', tokenTransferEventSchema);

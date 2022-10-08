const { Schema, model } = require('mongoose');
const convertHexToBase58Address = require('../../utils/convertHexToBase58');

const minterRemovedEventSchema = new Schema(
  {
    block_number: { type: Number, required: true },
    block_timestamp: { type: Number, required: true },
    caller_contract_address: { type: String, required: true },
    contract_address: { type: String, required: true },
    event_index: { type: Number, required: true },
    event_name: { type: String, required: true, index: true },
    result: {
      0: { type: String, required: true, set: convertHexToBase58Address },
      account: {
        type: String,
        required: true,
        set: convertHexToBase58Address,
        index: true,
      },
    },
    result_type: {
      account: { type: String, required: true },
    },
    transaction_id: { type: String, required: true, index: true, unique: true },
  },
  {
    _id: true,
    timestamps: true,
  }
);

minterRemovedEventSchema.post('save', async (doc) => {
  try {
    const user = await UserProfile.findOne({
      userCryptoAddress: doc.result.account,
    });
    if (user) {
      user.isMinter = false;
      user.save();
    }
  } catch (error) {
    console.log(error);
  }
});

minterRemovedEventSchema.post('update', async (doc) => {
  try {
    const user = await UserProfile.findOne({
      userCryptoAddress: doc.result.account,
    });
    if (user) {
      user.isMinter = false;
      user.save();
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = model('MinterRemovedEvent', minterRemovedEventSchema);

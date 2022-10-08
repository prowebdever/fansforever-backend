const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const chatSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: uuidv4,
      unique: true,
    },
    from: { type: String, required: true, trim: true },
    fromHandle: {type: String, required: true},
    to: { type: String, required: true, trim: true },
    auctionId: {type: Number, required: true, trim: true},
    date: { type: String, required: true, trim: true },
    message: { type: String,trim: true },
    isRead: {type: Boolean, default: false}
  },
  {
    _id: true,
    timestamps: true,
  }
);

module.exports = model('CHAT', chatSchema);

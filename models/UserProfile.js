const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userProfileSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: uuidv4,
      unique: true,
    },
    userBannerImageUrl: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    userProfileImageUrl: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    userAccountHandle: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userCryptoAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userDescription: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    userSocials: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedIn: { type: String, default: '' },
      youtube: { type: String, default: '' },
      spotify: { type: String, default: '' },
    },
    isVerified: { type: Boolean, required: true, default: false },
    isMinter: { type: Boolean, required: true, default: false },
    isBlacklisted: { type: Boolean, required: true, default: false },
    follow: [],
  },
  {
    _id: true,
    timestamps: true,
  }
);

module.exports = model('UserProfile', userProfileSchema);

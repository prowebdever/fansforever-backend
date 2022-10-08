const TronWeb = require('tronweb');
const TronGrid = require('trongrid');

const config = require('../config');

const fullHost = config.fullHost;

const masterTronWeb = new TronWeb({
  fullHost,
  privateKey: config.justFanContractDeployerAccountPrivateKey,
});
const eventsTronWeb = new TronWeb({ fullHost });
const tronGrid = new TronGrid(eventsTronWeb);

const UserProfile = require('../models/UserProfile');

const checkUserHandleExistsHandler = async (req, res) => {
  try {
    const { userAccountHandle } = req.query;
    const user = await UserProfile.findOne({
      userAccountHandle,
    });
    if (user) {
      return res.status(200).json({ userExists: true });
    }
    res.status(200).json({ userExists: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const getProfileHandler = async (req, res) => {
  try {
    const { userAccountHandle = null, userCryptoAddress = null } = req.query;
    const user = await UserProfile.findOne({
      $or: [
        {
          userAccountHandle,
        },
        {
          userCryptoAddress,
        },
        {
          userAccountHandle,
          userCryptoAddress,
        },
      ],
    });
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const addProfileHandler = async (req, res) => {
  try {
    const {
      userBannerImageUrl,
      userProfileImageUrl,
      username,
      userAccountHandle,
      userCryptoAddress,
      userContractAddress = config.justFanCollectionContractAddress,
      userDescription,
      userSocials: {
        facebook = '',
        twitter = '',
        instagram = '',
        linkedIn = '',
        youtube = '',
        spotify = '',
      },
      linkedUserObjectId = '',
    } = req.body;
    
    const existingUser = await UserProfile.find().or([
      { userAccountHandle },
      { userCryptoAddress },
    ]);

    if (existingUser && existingUser.length) {
      return res.status(400).json({ message: 'Duplicate details found.' });
    }
    
    const user = new UserProfile({
      userBannerImageUrl,
      userProfileImageUrl,
      username,
      userAccountHandle,
      userCryptoAddress,
      userContractAddress,
      userDescription,
      userSocials: {
        facebook,
        twitter,
        instagram,
        linkedIn,
        youtube,
        spotify,
      },
      ...(linkedUserObjectId && { linkedUserObjectId }),
    });
    const contractInstance = await masterTronWeb
      .contract()
      .at(config.justFanCollectionContractAddress);
    // Check if user's crypto address is already added as a minter.
    const isMinter = await contractInstance.isMinter(userCryptoAddress).call();
    if (isMinter) {
      user.isMinter = true;
      await user.save();
      return res.status(200).json({ message: 'User added successfully' });
    }
    const addMinterTransactionId = await contractInstance
      .addMinter(userCryptoAddress)
      .send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });
    setTimeout(async () => {
      const events = await tronGrid.transaction.getEvents(
        addMinterTransactionId
      );
      if (events?.data?.length) {
        user.isMinter = true;
        await user.save();
        res.status(200).json({ message: 'User added successfully' });
      } else {
        res.status(500).json({ error: 'Transaction failed' });
      }
    }, 20000);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const updateProfileHandler = async (req, res) => {
  try {
    const { originalBody, signedMessage, userCryptoAddress } = req.body;
    const verified = await masterTronWeb.trx.verifyMessage(
      masterTronWeb.toHex(JSON.stringify(originalBody)),
      signedMessage,
      userCryptoAddress
    );
    delete originalBody.userAccountHandle;
    if (verified && originalBody.userCryptoAddress === userCryptoAddress) {
      const profile = await UserProfile.findOneAndUpdate(
        { userCryptoAddress },
        originalBody,
        { new: true }
      );
      res.status(200).json(profile);
    } else {
      throw new Error('Signing address and account address mismatch');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const FollowHandler = async (req, res) =>{
  try {
    const {followprofiledata, myWalletAddress } = req.body;
    const myprofile = await UserProfile.findOne(
      {userCryptoAddress: myWalletAddress}
    )
    const profile = await UserProfile.findOneAndUpdate(
      {userCryptoAddress: followprofiledata.userCryptoAddress},
      {
        $push:{
          follow: myprofile
        }
      }
    );
    const updated_profile = await UserProfile.findOne(
      {userCryptoAddress:followprofiledata.userCryptoAddress}
    );
    res.status(200).json(updated_profile);
  }catch(error){
    console.log(error);
    res.status.json({error:error.message || error});
  }
}


const UnFollowHandler = async (req, res) =>{
  try {
    const {followprofiledata, myWalletAddress } = req.body;
    const myprofile = await UserProfile.findOne(
      {userCryptoAddress: myWalletAddress}
    )
    const profile = await UserProfile.findOneAndUpdate(
      {userCryptoAddress: followprofiledata.userCryptoAddress},
      {
        $pull:{
          follow: {userCryptoAddress: myprofile.userCryptoAddress}
        }
      }
    );
    const updated_profile = await UserProfile.findOne(
      {userCryptoAddress: followprofiledata.userCryptoAddress}
    );
    res.status(200).json(updated_profile);
  }catch(error){
    console.log(error);
    res.status.json({error:error.message || error});
  }
}
module.exports = {
  checkUserHandleExistsHandler,
  getProfileHandler,
  addProfileHandler,
  updateProfileHandler,
  FollowHandler,
  UnFollowHandler,
};

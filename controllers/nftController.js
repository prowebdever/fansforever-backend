const NFT = require('../models/NFT');

const createNFTHandler = async (req, res) => {
  try {
    const {
      tokenId,
      assetName,
      assetDescription,
      assetMimetype,
      assetIpfsHash,
      nftIpfsHash,
      userContractAddress,
      userWalletAddress,
      mintTransactionId,
      mintEventResult,
    } = req.body;
    console.log(req.body)
    const nft = new NFT({
      tokenId,
      assetName,
      assetDescription,
      assetMimetype,
      assetIpfsHash,
      nftIpfsHash,
      userContractAddress,
      userWalletAddress,
      ownerWalletAddress: userWalletAddress,
      mintTransactionId,
      mintEventResult,
    });
    const doc = await nft.save();
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const fetchNFTsListHandler = async (req, res) => {
  try {
    const { userCryptoAddress, userContractAddress } = req.body;
    const nfts = await NFT.aggregate()
      .match({
        $or: [
          {
            userWalletAddress: userCryptoAddress,
            ownerWalletAddress: userCryptoAddress,
            userContractAddress,
          },
          {
            userWalletAddress: { $ne: userCryptoAddress },
            ownerWalletAddress: userCryptoAddress,
            userContractAddress,
          },
        ],
      })
      .lookup({
        from: 'userprofiles',
        localField: 'userWalletAddress',
        foreignField: 'userCryptoAddress',
        as: 'user',
      })
      .lookup({
        from: 'auctions',
        localField: 'mintEventResult.result.tokenId',
        foreignField: 'nftDetails.mintEventResult.result.tokenId',
        as: 'auctionInfo',
      })
      .project({
        nftIpfsHash: 1,
        'mintEventResult.result.tokenId': 1,
        assetIpfsHash: 1,
        assetName: 1,
        assetMimetype: 1,
        userContractAddress: 1,
        ownerWalletAddress: 1,
        'user.userCryptoAddress': {
          $arrayElemAt: ['$user.userCryptoAddress', 0],
        },
        'user.userProfileImageUrl': {
          $arrayElemAt: ['$user.userProfileImageUrl', 0],
        },
        'user.userAccountHandle': {
          $arrayElemAt: ['$user.userAccountHandle', 0],
        },
        isApprovedForAuction: 1,
        isMovedToAuction: 1,
        auctionIndex: {
          $arrayElemAt: ['$auctionInfo.auctionEventResult.result._index', -1],
        },
      });
    res.status(200).json(nfts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const fetchSingleNFTHandler = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { userCryptoAddress, userContractAddress } = req.body;
    const nfts = await NFT.aggregate()
      .match({
        $or: [
          {
            userWalletAddress: userCryptoAddress,
          },
          {
            ownerWalletAddress: userCryptoAddress,
          },
        ],
        userContractAddress,
        $or: [{ tokenId }, { 'mintEventResult.result.tokenId': tokenId }],
      })
      .lookup({
        from: 'userprofiles',
        localField: 'userWalletAddress',
        foreignField: 'userCryptoAddress',
        as: 'user',
      });
    res.status(200).json(nfts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const fetchAllNFTHandler = async (req, res) => {
  try {
    // const { userCryptoAddress, userContractAddress } = req.body;
    const nfts = await NFT.find({});
    res.status(200).json(nfts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const updateNFTHandler = async (req, res) => {
  try {
    const {
      userWalletAddress,
      userContractAddress,
      nftIpfsHash,
      mintTransactionId,
      tokenId,
      approvedTransactionId,
      approvedEventResult,
    } = req.body;
    const doc = await NFT.update(
      {
        ownerWalletAddress: userWalletAddress,
        userContractAddress,
        nftIpfsHash,
        mintTransactionId,
        'mintEventResult.result.tokenId': tokenId,
      },
      {
        $set: {
          isApprovedForAuction: true,
          approvedTransactionId,
          approvedEventResult,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};


const buyNFTHandler = async (req, res) => {
  try {
    const {
      currentuserWalletAddress,
      buyerWalletAddress,
      tokenId,
      buyInfo
    } = req.body;
    buyInfo['buydate'] = new Date();
    console.log(req.body)
    const doc = await NFT.findOneAndUpdate(
      {
        userWalletAddress: currentuserWalletAddress,
        tokenId, 
      },
      {
        $set: {
          isApprovedForAuction: false,
          isMovedToAuction: false,
          ownerWalletAddress: buyerWalletAddress,
          userWalletAddress: buyerWalletAddress,
        },
        $push: {buyInfo: buyInfo}
      },
      {new: true}
    );
    console.log(doc)
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const deleteNFTHandler = async (req, res) => {
  try {
    const {
      tokenId,
    } = req.body;
    const doc = await NFT.findOneAndDelete(
      {
        tokenId, 
      }
    );
    console.log("buyNFTHandler", doc)
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

module.exports = {
  createNFTHandler,
  fetchNFTsListHandler,
  fetchSingleNFTHandler,
  updateNFTHandler,
  fetchAllNFTHandler,
  buyNFTHandler,
  deleteNFTHandler
};

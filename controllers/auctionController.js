const Auction = require('../models/Auction');
const NFT = require('../models/NFT');

const getAuctionsHandler = async (req, res) => {
  try {
    const auctions = await Auction.aggregate()
      .lookup({
        from: 'userprofiles',
        localField: 'nftDetails.userWalletAddress',
        foreignField: 'userCryptoAddress',
        as: 'user',
      })
      .project({
        'nftDetails.isApprovedForAuction': 1,
        'nftDetails.assetName': 1,
        'nftDetails.assetMimetype': 1,
        'nftDetails.assetIpfsHash': 1,
        userAccountHandle: { $arrayElemAt: ['$user.userAccountHandle', 0] },
        userProfileImage: { $arrayElemAt: ['$user.userProfileImageUrl', 0] },
        startPrice: 1,
        startTime: 1,
        duration: 1,
        endsAt: { $add: ['$startTime', '$duration'] },
        instantSalePrice: 1,
        auctionIndex: '$auctionEventResult.result._index',
        trc20TokenAddress: 1,
        isTrxAuction: 1,
        createdAt:1,
        isAssetClaimed:1,
        isTokenClaimed: 1
      })
      .match({$or:[{isAssetClaimed: {$eq:false}}, {isTokenClaimed: {$eq: false}}]})
      // .match({ endsAt: { $gt: Math.round(new Date() / 1000) } });
    res.status(200).json(auctions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const getSingleAuctionHandler = async (req, res) => {
  try {
    const { auctionIndex } = req.query;
    const auctions = await Auction.findOne({
      'auctionEventResult.result._index': auctionIndex,
    });
    res.status(200).json(auctions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const getRecommendedAutionHandler = async (req, res) => {
  try {
    const auctions = await Auction.aggregate()
      .lookup({
        from: 'userprofiles',
        localField: 'nftDetails.userWalletAddress',
        foreignField: 'userCryptoAddress',
        as: 'user',
      })
      .lookup({
        from: 'auctionbidevents',
        localField: 'auctionEventResult.result._index',
        foreignField: 'result._index',
        as: 'bids',
      })
      .project({
        'nftDetails.isApprovedForAuction': 1,
        'nftDetails.assetName': 1,
        'nftDetails.assetMimetype': 1,
        'nftDetails.assetIpfsHash': 1,
        'nftDetails.userWalletAddress': 1,
        username: { $arrayElemAt: ['$user.username', 0] },
        userAccountHandle: { $arrayElemAt: ['$user.userAccountHandle', 0] },
        userProfileImage: { $arrayElemAt: ['$user.userProfileImageUrl', 0] },
        startPrice: 1,
        startTime: 1,
        duration: 1,
        endsAt: { $add: ['$startTime', '$duration'] },
        instantSalePrice: 1,
        auctionIndex: '$auctionEventResult.result._index',
        trc20TokenAddress: 1,
        isTrxAuction: 1,
        bidCount: { $size: '$bids' },
        latestBidAmount: {
          $arrayElemAt: ['$bids.result.amount', -1],
        },
        isAssetClaimed:1,
        isTokenClaimed: 1
      })
      .match({$or:[{isAssetClaimed: {$eq:false}}, {isTokenClaimed: {$eq: false}}]})
      .limit(1);
    res.status(200).json(auctions && auctions.length ? auctions[0] : null);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const getHotAuctionsHandler = async (req, res) => {
  try {
    const auctions = await Auction.aggregate()
      .lookup({
        from: 'userprofiles',
        localField: 'nftDetails.userWalletAddress',
        foreignField: 'userCryptoAddress',
        as: 'user',
      })
      .lookup({
        from: 'auctionbidevents',
        localField: 'auctionEventResult.result._index',
        foreignField: 'result._index',
        as: 'bids',
      })
      .project({
        'nftDetails.isApprovedForAuction': 1,
        'nftDetails.assetName': 1,
        'nftDetails.assetMimetype': 1,
        'nftDetails.assetIpfsHash': 1,
        username: { $arrayElemAt: ['$user.username', 0] },
        userAccountHandle: { $arrayElemAt: ['$user.userAccountHandle', 0] },
        userProfileImage: { $arrayElemAt: ['$user.userProfileImageUrl', 0] },
        startPrice: 1,
        startTime: 1,
        duration: 1,
        endsAt: { $add: ['$startTime', '$duration'] },
        instantSalePrice: 1,
        auctionIndex: '$auctionEventResult.result._index',
        trc20TokenAddress: 1,
        isTrxAuction: 1,
        bidCount: { $size: '$bids' },
        latestBidAmount: {
          $arrayElemAt: ['$bids.result.amount', -1],
        },
        isAssetClaimed:1,
        isTokenClaimed: 1
      })
      .match({$or:[{isAssetClaimed: {$eq:false}}, {isTokenClaimed: {$eq: false}}]})
      // .match({ endsAt: { $gt: Math.round(new Date() / 1000) } });
    res.status(200).json(auctions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const createAuctionHandler = async (req, res) => {
  try {
    const {
      nftDetails,
      auctionTransactionId,
      startPrice,
      startTime,
      duration,
      instantSalePrice,
      auctionEventResult,
      trc20TokenAddress,
    } = req.body;
    console.log(nftDetails)
    const auction = new Auction({
      nftDetails: { ...nftDetails, isMovedToAuction: true },
      startPrice,
      startTime,
      duration,
      instantSalePrice,
      auctionTransactionId,
      auctionEventResult,
      trc20TokenAddress,
    });
    const doc = auction.save();
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const claimAssetHandler = async (req, res) => {
  try {
    const {isAssetClaimed, auctionId} = req.body;
    let _auctionId = auctionId.toString();
    const doc = await Auction.findOneAndUpdate(
      {
       'auctionEventResult.result._index': _auctionId, 
      },
      {
        $set: {
          isAssetClaimed: true,
        },
      },
      {new: true}
    );
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};


const claimTokenHandler = async (req, res) => {
  try {
    const {isTokenClaimed, auctionId} = req.body;
    let _auctionId = auctionId.toString();
    const doc = await Auction.findOneAndUpdate(
      {
       'auctionEventResult.result._index': _auctionId, 
      },
      { 
        $set: {
          isTokenClaimed: isTokenClaimed,
        },
      },
      {new: true}
    );
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const cancelAuctionHandler = async (req, res) => {
  try {
    const { auctionId, tokenId } = req.body;
    let _auctionId = auctionId.toString();
    let _tokenId = tokenId.toString();
    console.log("sdfsdfsdfsdfsdf",_tokenId)
    const doc = await Auction.findOneAndDelete(
      {
       'auctionEventResult.result._index': _auctionId, 
      }
    );
    const updatenft =await NFT.findOneAndUpdate(
      {
        tokenId: _tokenId
      },
      {
        $set:{
          isMovedToAuction: false,
          isApprovedForAuction: false
        }
      }
    );
    res.status(200).json({result: "success"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const chatHandler = async (req, res) =>{
  try {
    const {auctionId, newMessage } = req.body;
    let _auctionId = auctionId.toString();
    const doc = await Auction.findOneAndUpdate(
      {
        'auctionEventResult.result._index': _auctionId      
      }
    )
  } catch (error) {
    console.log(error);
    res.status(500).json({error:error.message || error})
  }
}

module.exports = {
  getAuctionsHandler,
  getSingleAuctionHandler,
  getRecommendedAutionHandler,
  getHotAuctionsHandler,
  createAuctionHandler,
  claimAssetHandler,
  claimTokenHandler,
  cancelAuctionHandler
};

const Chat = require('../models/Chat');


const getChatDataHandler = async (req, res) => {
  try {
    const { from, to, auctionId } = req.body;
    const _auctionId = parseInt(auctionId);
    const chats = await Chat.find(
    {
      auctionId:_auctionId,
      $or:[{to:to, from: from}, {to: from}]
    }
    )
    .sort({
      date: 1,
    });

    const buyerList = await Chat.aggregate(
      [
        {
          $match:  {
            to: to,
            auctionId: _auctionId
          }
        },
        {
          $group: {
            _id: "$from",
            fromHandle: {$first: "$fromHandle"},
            to:{$first:"$to"},
            date: {$first:"$date"},
            message: {$first: "$message"}
          }
        }
      ]
    )
    .sort({
        date: 1,
    });
    res.status(200).json({chat:chats, buyerList: buyerList});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const getNewMessageNumber = async (req, res) => {
  const {auctionId, to} = req.body;
  var _auctionId = parseInt(auctionId);
  try {
    const num = await Chat.find(
      {
          to: to,
          auctionId: _auctionId,
          isRead: false
      }
    );
    console.log(num)
    res.status(200).json(num.length);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:error.message || error})
  }
}



const addChatDataHandler = async (req, res) => {
  try {
    const { from ,fromHandle, to, auctionId, message, date} = req.body;
    const _auctionId = parseInt(auctionId);
    const updateddoc = await Chat.updateMany(
    {
      auctionId:_auctionId,
      from: to,
      to: from
    },
    {$set:{isRead: true}}
    )
    const chat = new Chat({
      from, fromHandle, to, auctionId ,message, date
    });
    const doc = await chat.save();
    res.status(200).json(doc);
    console.log("add chat message", doc)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

module.exports = { getChatDataHandler, addChatDataHandler,getNewMessageNumber };
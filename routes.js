const rootRoute = require('./routes/root');
const auctionRoute = require('./routes/auction');
const eventsRoute = require('./routes/events');
const ipfsRoute = require('./routes/ipfs');
const nftRoute = require('./routes/nft');
const profileRoute = require('./routes/profile');
const chatRoute = require('./routes/chat');

module.exports = (app) => {
  app.use('/', rootRoute);
  app.use('/auction', auctionRoute);
  app.use('/events', eventsRoute);
  app.use('/ipfs', ipfsRoute);
  app.use('/nft', nftRoute);
  app.use('/profile', profileRoute);
  app.use('/chat', chatRoute);
};

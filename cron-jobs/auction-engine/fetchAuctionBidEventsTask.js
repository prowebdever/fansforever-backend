const cron = require('node-cron');

const AuctionBidEvent = require('../../models/auction-engine/AuctionBidEvent');

const fetchAuctionBidEventsTask = (tronGrid, masterAuctionContractAddress) =>
  cron.schedule(
    '* * * * *',
    async () => {
      try {
        const latestAuctionContractAddress = masterAuctionContractAddress;
        const timestamp = new Date().getTime();

        const events = await tronGrid.contract.getEvents(
          latestAuctionContractAddress,
          {
            only_unconfirmed: true,
            order_by: 'timestamp,desc',
            limit: 200,
            event_name: 'AuctionBid',
            max_timestamp: timestamp,
            min_timestamp: timestamp - 2 * 60 * 1000, // fetch events from 2 minutes prior to this current run's timestamp
          }
        );
        if (events.data.length) {
          const auctionBidEvents = events.data;
          const bulkWriteArray = auctionBidEvents.map((event) => ({
            updateOne: {
              filter: { transaction_id: event.transaction_id },
              update: event,
              upsert: true,
            },
          }));
          await AuctionBidEvent.bulkWrite(bulkWriteArray);
        }
      } catch (error) {
        console.log(error);
      }
    },
    { scheduled: false }
  );

module.exports = fetchAuctionBidEventsTask;

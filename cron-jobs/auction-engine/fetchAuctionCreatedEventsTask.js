const cron = require('node-cron');

const AuctionCreatedEvent = require('../../models/auction-engine/AuctionCreatedEvent');

const fetchAuctionCreatedEventsTask = (
  tronGrid,
  masterAuctionContractAddress
) =>
  cron.schedule(
    '* * * * *',
    async () => {
      try {
        const latestAuctionContractAddress = masterAuctionContractAddress;
        const timestamp = new Date().getTime();

        const events = await tronGrid.contract.getEvents(
          latestAuctionContractAddress,
          {
            only_confirmed: true,
            order_by: 'timestamp,desc',
            limit: 200,
            event_name: 'AuctionCreated',
            max_timestamp: timestamp,
            min_timestamp: timestamp - 2 * 60 * 1000, // fetch events from 2 minutes prior to this current run's timestamp
          }
        );
        if (events.data.length) {
          const auctionCreatedEvents = events.data;
          const bulkWriteArray = auctionCreatedEvents.map((event) => ({
            updateOne: {
              filter: { transaction_id: event.transaction_id },
              update: event,
              upsert: true,
            },
          }));
          await AuctionCreatedEvent.bulkWrite(bulkWriteArray);
        }
      } catch (error) {
        console.log(error);
      }
    },
    { scheduled: false }
  );

module.exports = fetchAuctionCreatedEventsTask;

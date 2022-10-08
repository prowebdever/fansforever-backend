const cron = require('node-cron');

const AuctionClaimTokensEvent = require('../../models/auction-engine/AuctionClaimTokensEvent');

const fetchAuctionClaimTokensEventsTask = (
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
            event_name: 'ClaimTokens',
            max_timestamp: timestamp,
            min_timestamp: timestamp - 2 * 60 * 1000, // fetch events from 2 minutes prior to this current run's timestamp
          }
        );
        if (events.data.length) {
          const auctionClaimTokensEvents = events.data;
          const bulkWriteArray = auctionClaimTokensEvents.map((event) => ({
            updateOne: {
              filter: { transaction_id: event.transaction_id },
              update: event,
              upsert: true,
            },
          }));
          await AuctionClaimTokensEvent.bulkWrite(bulkWriteArray);
        }
      } catch (error) {
        console.log(error);
      }
    },
    { scheduled: false }
  );

module.exports = fetchAuctionClaimTokensEventsTask;

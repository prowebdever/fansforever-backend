const cron = require('node-cron');

const AuctionClaimAssetEvent = require('../../models/auction-engine/AuctionClaimAssetEvent');

const fetchAuctionClaimAssetEventsTask = (
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
            event_name: 'ClaimAsset',
            max_timestamp: timestamp,
            min_timestamp: timestamp - 5 * 60 * 1000, // fetch events from 5 minutes prior to this current run's timestamp
          }
        );
        if (events.data.length) {
          const auctionClaimAssetEvents = events.data;
          const claimAssetPromises = auctionClaimAssetEvents.map((event) => {
            return AuctionClaimAssetEvent.findOneAndUpdate(
              {
                transaction_id: event.transaction_id,
              },
              event,
              { upsert: true, setDefaultsOnInsert: true }
            );
          });
          await Promise.all(claimAssetPromises);
        }
      } catch (error) {
        console.log(error);
      }
    },
    { scheduled: false }
  );

module.exports = fetchAuctionClaimAssetEventsTask;

const cron = require('node-cron');

const TokenApprovedEvent = require('../../models/just-fan-collection/TokenApprovedEvent');
const config = require('../../config');

const fetchApprovedEventsTask = (tronGrid) => {
  return cron.schedule(
    '* * * * *',
    async () => {
      try {
        const justFanCollectionContractAddress =
          config.justFanCollectionContractAddress;
        const timestamp = new Date().getTime();

        const events = await tronGrid.contract.getEvents(
          justFanCollectionContractAddress,
          {
            only_confirmed: true,
            order_by: 'timestamp,desc',
            limit: 200,
            event_name: 'Approval',
            max_timestamp: timestamp,
            min_timestamp: timestamp - 2 * 60 * 1000, // fetch events from 2 minutes prior to this current run's timestamp
          }
        );
        if (events && events.data && events.data.length) {
          const tokenApprovedEvents = events.data;
          const bulkWriteArray = tokenApprovedEvents.map((event) => ({
            updateOne: {
              filter: { transaction_id: event.transaction_id },
              update: event,
              upsert: true,
            },
          }));
          await TokenApprovedEvent.bulkWrite(bulkWriteArray);
        }
      } catch (error) {
        console.log(error);
      }
    },
    { scheduled: false }
  );
};

module.exports = fetchApprovedEventsTask;

const cron = require('node-cron');

const MinterRemovedEvent = require('../../models/just-fan-collection/MinterRemovedEvent');
const config = require('../../config');

const fetchMinterRemovedEventsTask = (tronGrid) => {
  return cron.schedule('* * * * *', async () => {
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
          event_name: 'MinterRemoved',
          max_timestamp: timestamp,
          min_timestamp: timestamp - 2 * 60 * 1000, // fetch events from 2 minutes prior to this current run's timestamp
        }
      );
      if (events && events.data && events.data.length) {
        const minterRemovedEvents = events.data;
        const bulkWriteArray = minterRemovedEvents.map((event) => ({
          updateOne: {
            filter: { transaction_id: event.transaction_id },
            update: event,
            upsert: true,
          },
        }));
        await MinterRemovedEvent.bulkWrite(bulkWriteArray);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = fetchMinterRemovedEventsTask;

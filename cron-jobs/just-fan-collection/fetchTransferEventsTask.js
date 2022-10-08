const cron = require('node-cron');

const TokenTransferEvent = require('../../models/just-fan-collection/TokenTransferEvent');
const config = require('../../config');

const fetchTransferEventsTask = (tronGrid) => {
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
          event_name: 'Transfer',
          max_timestamp: timestamp,
          min_timestamp: timestamp - 2 * 60 * 1000, // fetch events from 2 minutes prior to this current run's timestamp
        }
      );
      if (events && events.data && events.data.length) {
        const tokenTransferEvents = events.data;
        const bulkWriteArray = tokenTransferEvents.map((event) => ({
          updateOne: {
            filter: { transaction_id: event.transaction_id },
            update: event,
            upsert: true,
          },
        }));
        await TokenTransferEvent.bulkWrite(bulkWriteArray);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = fetchTransferEventsTask;

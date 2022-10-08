const TronWeb = require('tronweb');
const TronGrid = require('trongrid');
const mongoose = require('mongoose');

const fetchApprovedEventsTask = require('./just-fan-collection/fetchApprovedEventsTask');
const fetchMinterAddedEventsTask = require('./just-fan-collection/fetchMinterAddedEventsTask');
const fetchMinterRemovedEventsTask = require('./just-fan-collection/fetchMinterRemovedEventsTask');
const fetchTransferEventsTask = require('./just-fan-collection/fetchTransferEventsTask');

const config = require('../config');

const fullHost = config.fullHost;

const tronWeb = new TronWeb({ fullHost });
const tronGrid = new TronGrid(tronWeb);

const mongodbURI = config.mongodbURI;

mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');

    // Start Just FAN Collection Event listeners.
    fetchApprovedEventsTask(tronGrid).start();
    fetchMinterAddedEventsTask(tronGrid).start();
    fetchMinterRemovedEventsTask(tronGrid).start();
    fetchTransferEventsTask(tronGrid).start();
  })
  .catch((err) => console.error(err));

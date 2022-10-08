const TronWeb = require('tronweb');

const config = require('../config');

const fullHost = config.fullHost;

const tronWeb = new TronWeb({ fullHost });

const convertHexToBase58Address = (v) => {
  return tronWeb.address.fromHex(v);
};

module.exports = convertHexToBase58Address;

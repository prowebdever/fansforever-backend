const joi = require('joi');

const config = {
  env: 'local',
  port: 8000,
  isLocal: false,
  isDevelopment: false,
  isProduction: true,
  jwtSecretKey: 'qNC7cPEAP9kqRNFXApVaTZrA8IwqDs4niENOBQYSAQRrWXvbebnD3I50Ad73QQ0',
  mongodbURI: 'mongodb+srv://node-app:94nK8MR4kykM33Z6@dev-db-app-fansforever.kmted.mongodb.net/fan-shasta-development?retryWrites=true&w=majority',
  fullHost: 'https://api.shasta.trongrid.io',
  masterAuctionContractAddress: 'TPwehu45wHBvxEwtfXYF3CYLrTETJQYPNB',
  justFanCollectionContractAddress:
    'TM5AUVBjxy92nCJxj2ujkJrctiqycyz7gG',
  justFanContractDeployerAccountPrivateKey:
    '171b8c761724812564c4439992ea9249d101de2a2fb93ddc5aaef4e2ab931a34',
  pinataApiKey: 'f450547e44c5e15287dd',
  pinataSecretApiKey: '71bd3a768169e29620d750dad6a1746882a0f6c04c791ff4f895d3fccfeebbdb',
};

module.exports = config;

// API Key: f450547e44c5e15287dd
//  API Secret: 71bd3a768169e29620d750dad6a1746882a0f6c04c791ff4f895d3fccfeebbdb

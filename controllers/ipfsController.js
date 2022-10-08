const { Readable } = require('stream');
const pinataSDK = require('@pinata/sdk');
const config = require('../config');

const pinata = pinataSDK(config.pinataApiKey, config.pinataSecretApiKey);

const addJsonToIPFSHandler = async (req, res) => {
  try {
    const { IpfsHash } = await pinata.pinJSONToIPFS(req.body);
    res.status(200).json({
      ipfsHash: IpfsHash,
      previewUrl: `https://ipfs.io/ipfs/${IpfsHash}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const addFileToIPFSHandler = async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const stream = Readable.from(buffer);
    stream.path = originalname;
    console.log(originalname)
    console.log(buffer)
    const options = {
      pinataMetadata: {
        name: originalname,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const { IpfsHash } = await pinata.pinFileToIPFS(stream, options);
    res.status(200).json({
      ipfsHash: IpfsHash,
      previewUrl: `https://ipfs.io/ipfs/${IpfsHash}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

module.exports = { addJsonToIPFSHandler, addFileToIPFSHandler };

const pinataSDK = require('@pinata/sdk');
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

let pinata;
const LOCAL_ASSET_DIR = path.join(__dirname, '../../data/assets');

function initializePinata() {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;
  if (!apiKey || !secretKey) return false;
  pinata = new pinataSDK(apiKey, secretKey);
  return true;
}

function ensureAssetDir() {
  if (!fs.existsSync(LOCAL_ASSET_DIR)) {
    fs.mkdirSync(LOCAL_ASSET_DIR, { recursive: true });
  }
}

function buildLocalAssetUrl(filename) {
  const explicit = process.env.ASSET_BASE_URL;
  if (explicit) return `${explicit.replace(/\/$/, '')}/assets/${filename}`;
  const port = process.env.BACKEND_PORT || 3001;
  return `http://localhost:${port}/assets/${filename}`;
}

function hashPayload(data) {
  const payload = Buffer.isBuffer(data) ? data : Buffer.from(JSON.stringify(data));
  return crypto.createHash('sha256').update(payload).digest('hex');
}

async function uploadToLocalAssets(data, filename) {
  ensureAssetDir();
  const hash = hashPayload(data).slice(0, 16);
  const extension = path.extname(filename) || '.json';
  const outputName = `${hash}${extension}`;
  const outputPath = path.join(LOCAL_ASSET_DIR, outputName);
  const payload = Buffer.isBuffer(data) ? data : Buffer.from(JSON.stringify(data, null, 2));
  fs.writeFileSync(outputPath, payload);
  return buildLocalAssetUrl(outputName);
}

async function uploadToIPFS(data, filename = 'metadata.json') {
  try {
    if (initializePinata()) {
      return await uploadToPinata(data, filename);
    }
    return await uploadToLocalAssets(data, filename);
  } catch (error) {
    console.error('Error uploading asset:', error.message);
    throw error;
  }
}

async function uploadToPinata(data, filename) {
  let result;

  if (Buffer.isBuffer(data)) {
    const formData = new FormData();
    formData.append('file', data, filename);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY
        }
      }
    );
    result = response.data;
  } else {
    result = await pinata.pinJSONToIPFS(data, {
      pinataMetadata: { name: filename }
    });
  }

  const ipfsHash = result.IpfsHash;
  return `ipfs://${ipfsHash}`;
}

async function getFromIPFS(ipfsHash) {
  const hash = ipfsHash.replace('ipfs://', '');
  const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
  const response = await axios.get(url);
  return response.data;
}

module.exports = {
  uploadToIPFS,
  getFromIPFS,
  LOCAL_ASSET_DIR
};

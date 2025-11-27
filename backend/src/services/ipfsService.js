const pinataSDK = require('@pinata/sdk');
const axios = require('axios');
const FormData = require('form-data');

// IPFS service using Pinata

let pinata;

function initializePinata() {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;

  if (apiKey && secretKey) {
    pinata = new pinataSDK(apiKey, secretKey);
    console.log('✅ Pinata initialized');
    return true;
  }

  console.log('⚠️  Pinata credentials not found');
  return false;
}

async function uploadToIPFS(data, filename = 'metadata.json') {
  try {
    // Try Pinata first
    if (initializePinata()) {
      return await uploadToPinata(data, filename);
    }

    // Fallback to public IPFS gateway (for development)
    console.log('⚠️  Using placeholder IPFS URL');
    return `ipfs://QmPlaceholder/${filename}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error.message);
    throw error;
  }
}

async function uploadToPinata(data, filename) {
  try {
    let result;

    if (Buffer.isBuffer(data)) {
      // Upload file (image)
      const formData = new FormData();
      formData.append('file', data, filename);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
          }
        }
      );

      result = response.data;
    } else {
      // Upload JSON metadata
      result = await pinata.pinJSONToIPFS(data, {
        pinataMetadata: {
          name: filename
        }
      });
    }

    const ipfsHash = result.IpfsHash;
    const ipfsUrl = `ipfs://${ipfsHash}`;
    
    console.log(`✅ Uploaded to IPFS: ${ipfsUrl}`);
    console.log(`   Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    return ipfsUrl;
  } catch (error) {
    console.error('Pinata upload error:', error.message);
    throw error;
  }
}

async function getFromIPFS(ipfsHash) {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error.message);
    throw error;
  }
}

module.exports = {
  uploadToIPFS,
  getFromIPFS
};

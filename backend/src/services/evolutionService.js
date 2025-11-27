const { ethers } = require('ethers');
const axios = require('axios');
const { uploadToIPFS } = require('./ipfsService');

// Evolution service - handles AI generation and contract updates

async function triggerEvolution(tokenId, newLevel) {
  try {
    console.log(`\n🎨 Starting evolution for Token ID: ${tokenId}`);
    console.log(`   New Level: ${newLevel}`);

    // Step 1: Generate AI artwork
    const imageUrl = await generateAIArtwork(tokenId, newLevel);
    console.log(`✅ AI artwork generated: ${imageUrl}`);

    // Step 2: Create metadata
    const metadata = createMetadata(tokenId, newLevel, imageUrl);
    console.log(`✅ Metadata created`);

    // Step 3: Upload to IPFS
    const metadataURI = await uploadToIPFS(metadata);
    console.log(`✅ Uploaded to IPFS: ${metadataURI}`);

    // Step 4: Update contract
    await updateContractMetadata(tokenId, metadataURI);
    console.log(`✅ Contract updated successfully`);

    return { success: true, metadataURI, imageUrl };
  } catch (error) {
    console.error(`❌ Evolution failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function generateAIArtwork(tokenId, level) {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY || process.env.STABILITY_API_KEY;
    
    if (!apiKey) {
      console.log('⚠️  No AI API key found. Using placeholder image.');
      return `https://via.placeholder.com/512x512.png?text=Chara+Level+${level}`;
    }

    // Generate prompt based on level
    const prompt = generatePrompt(level);
    console.log(`   Prompt: ${prompt}`);

    // Option 1: Hugging Face Inference API
    if (process.env.HUGGINGFACE_API_KEY) {
      return await generateWithHuggingFace(prompt, apiKey);
    }

    // Option 2: Stability AI
    if (process.env.STABILITY_API_KEY) {
      return await generateWithStabilityAI(prompt, apiKey);
    }

    // Fallback to placeholder
    return `https://via.placeholder.com/512x512.png?text=Chara+Level+${level}`;
  } catch (error) {
    console.error('Error generating AI artwork:', error.message);
    return `https://via.placeholder.com/512x512.png?text=Chara+Level+${level}`;
  }
}

function generatePrompt(level) {
  const basePrompt = "A mystical digital character avatar";
  const levelTraits = {
    0: "simple, basic form, glowing softly",
    1: "developing energy, small particles around it",
    2: "growing power, vibrant colors, energy trails",
    3: "advanced form, complex patterns, bright aura",
    4: "powerful being, intricate details, cosmic background",
    5: "legendary form, maximum detail, universe-bending power"
  };

  const trait = levelTraits[level] || levelTraits[0];
  return `${basePrompt}, ${trait}, digital art, high quality, detailed, fantasy style`;
}

async function generateWithHuggingFace(prompt, apiKey) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Upload image to IPFS
    const imageBuffer = Buffer.from(response.data);
    const imageURI = await uploadToIPFS(imageBuffer, 'image.png');
    return imageURI;
  } catch (error) {
    console.error('Hugging Face API error:', error.message);
    throw error;
  }
}

async function generateWithStabilityAI(prompt, apiKey) {
  try {
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const imageBase64 = response.data.artifacts[0].base64;
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const imageURI = await uploadToIPFS(imageBuffer, 'image.png');
    return imageURI;
  } catch (error) {
    console.error('Stability AI API error:', error.message);
    throw error;
  }
}

function createMetadata(tokenId, level, imageUrl) {
  const attributes = generateAttributes(level);
  
  return {
    name: `Chara #${tokenId}`,
    description: `An evolving NFT that grows with your on-chain activity. Current Level: ${level}`,
    image: imageUrl,
    external_url: `https://chara.xyz/nft/${tokenId}`,
    attributes: attributes,
    properties: {
      level: level,
      evolved_at: new Date().toISOString(),
      category: "Evolving NFT"
    }
  };
}

function generateAttributes(level) {
  const baseAttributes = [
    { trait_type: "Level", value: level },
    { trait_type: "Generation", value: "Genesis" },
    { trait_type: "Type", value: "Soulbound" }
  ];

  // Add level-specific attributes
  if (level >= 1) {
    baseAttributes.push({ trait_type: "Awakened", value: "Yes" });
  }
  if (level >= 2) {
    baseAttributes.push({ trait_type: "Power", value: "Enhanced" });
  }
  if (level >= 3) {
    baseAttributes.push({ trait_type: "Rarity", value: "Rare" });
  }
  if (level >= 4) {
    baseAttributes.push({ trait_type: "Rarity", value: "Epic" });
  }
  if (level >= 5) {
    baseAttributes.push({ trait_type: "Rarity", value: "Legendary" });
  }

  return baseAttributes;
}

async function updateContractMetadata(tokenId, metadataURI) {
  try {
    const privateKey = process.env.PRIVATE_KEY_DEPLOYER;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const rpcUrl = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';

    if (!privateKey || !contractAddress) {
      throw new Error('Missing contract configuration');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const contractABI = [
      "function evolveNFT(uint256 tokenId, string memory newMetadataURI) external"
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Call evolveNFT function
    const tx = await contract.evolveNFT(tokenId, metadataURI);
    console.log(`   Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`   Transaction confirmed in block: ${receipt.blockNumber}`);

    return receipt;
  } catch (error) {
    console.error('Error updating contract:', error.message);
    throw error;
  }
}

module.exports = {
  triggerEvolution,
  generateAIArtwork,
  createMetadata
};

const { ethers } = require('ethers');
const axios = require('axios');
const { uploadToIPFS } = require('./ipfsService');

function createFallbackArtwork(tokenId, level) {
  const hue = (tokenId * 37 + level * 51) % 360;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="hsl(${hue}, 85%, 60%)"/>
      <stop offset="100%" stop-color="hsl(${(hue + 120) % 360}, 70%, 15%)"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)" />
  <circle cx="512" cy="512" r="${220 + level * 12}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="6"/>
  <circle cx="512" cy="512" r="${140 + level * 8}" fill="rgba(255,255,255,0.08)"/>
  <text x="50%" y="54%" text-anchor="middle" fill="white" font-family="Georgia,serif" font-size="84">CHARA</text>
  <text x="50%" y="62%" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Georgia,serif" font-size="42">LEVEL ${level}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function generatePrompt(level) {
  const basePrompt = 'A high-detail mythic digital avatar portrait';
  const levelTraits = {
    0: 'newly awakened, subtle aura, geometric sigils',
    1: 'charged posture, fine particle trails, neon contour',
    2: 'stabilized power field, arc light, dense texture',
    3: 'elite archetype, crystalline motifs, dynamic contrast',
    4: 'mythic guardian, cosmic fragments, ornate detailing',
    5: 'legendary sovereign, radiant halo, cinematic atmosphere',
    6: 'apex strategist, electromagnetic ribbons, precision linework',
    7: 'veteran champion, layered armor glow, celestial depth',
    8: 'expert ascendant, fractal crown, photoreal lighting',
    9: 'master architect, luminous runes, dimensional backdrop',
    10: 'ultimate legend, transcendent aura, masterpiece composition'
  };

  const trait = levelTraits[level] || levelTraits[10];
  return `${basePrompt}, ${trait}, ultra-detailed, digital art, 4k`;
}

async function generateWithHuggingFace(prompt, apiKey) {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    }
  );

  const imageBuffer = Buffer.from(response.data);
  return uploadToIPFS(imageBuffer, 'evolution.png');
}

async function generateWithStabilityAI(prompt, apiKey) {
  const response = await axios.post(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    {
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const imageBase64 = response.data.artifacts[0].base64;
  const imageBuffer = Buffer.from(imageBase64, 'base64');
  return uploadToIPFS(imageBuffer, 'evolution.png');
}

async function generateAIArtwork(tokenId, level) {
  try {
    const prompt = generatePrompt(level);
    if (process.env.HUGGINGFACE_API_KEY) {
      return await generateWithHuggingFace(prompt, process.env.HUGGINGFACE_API_KEY);
    }
    if (process.env.STABILITY_API_KEY) {
      return await generateWithStabilityAI(prompt, process.env.STABILITY_API_KEY);
    }
  } catch (error) {
    console.error('External AI generation failed, using deterministic fallback:', error.message);
  }

  return createFallbackArtwork(tokenId, level);
}

function generateAttributes(level) {
  return [
    { trait_type: 'Level', value: level },
    { trait_type: 'Type', value: 'Soulbound Reputation NFT' },
    { trait_type: 'Tier', value: level >= 9 ? 'Legend' : level >= 7 ? 'Veteran' : level >= 5 ? 'Trusted' : 'Rising' },
    { trait_type: 'Undercollateralized Eligible', value: level >= 7 ? 'Yes' : 'No' }
  ];
}

function createMetadata(tokenId, level, imageUrl) {
  const appBase = process.env.FRONTEND_URL || 'http://localhost:3000';
  return {
    name: `Chara #${tokenId}`,
    description: `Chara reputation identity NFT at level ${level}.`,
    image: imageUrl,
    external_url: `${appBase.replace(/\/$/, '')}/?token=${tokenId}`,
    attributes: generateAttributes(level),
    properties: {
      level,
      evolvedAt: new Date().toISOString(),
      category: 'Reputation Identity'
    }
  };
}

async function updateContractMetadata(tokenId, metadataURI) {
  const privateKey = process.env.PRIVATE_KEY_DEPLOYER;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpcUrl = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';

  if (!privateKey || !contractAddress) {
    throw new Error('Missing contract configuration');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    contractAddress,
    ['function evolveNFT(uint256 tokenId, string memory newMetadataURI) external'],
    wallet
  );

  const tx = await contract.evolveNFT(tokenId, metadataURI);
  await tx.wait();
  return tx.hash;
}

async function triggerEvolution(tokenId, newLevel) {
  try {
    console.log(`Starting evolution for token ${tokenId}, level ${newLevel}`);
    const imageUrl = await generateAIArtwork(tokenId, newLevel);
    const metadata = createMetadata(tokenId, newLevel, imageUrl);
    const metadataURI = await uploadToIPFS(metadata, `token-${tokenId}-metadata.json`);
    const txHash = await updateContractMetadata(tokenId, metadataURI);
    return { success: true, metadataURI, imageUrl, txHash };
  } catch (error) {
    console.error('Evolution failed:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  triggerEvolution,
  generateAIArtwork,
  createMetadata
};


// App configuration
export const ACCOUNT_ID = process.env.ACCOUNT_ID;
export const PLUGIN_URL = process.env.PLUGIN_URL || 'https://avvy-domains-agent.vercel.app';

// Blockchain configuration
export const API_RPC_URL = process.env.API_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc';
export const CHAIN_ID = 43114; // Avalanche C-Chain

// Contract addresses
export const CONTRACT_ADDRESSES = {
  RESOLUTION_UTILS: '0x5BBD3a8E215B1fC30595fd1Aba4F3FcDbB614078',
  ENS_UTILS: '0x24DFa1455A75f64800BFdB2447958D2B632b94f6',
};

// Domain pricing in USD
export const DOMAIN_PRICING = {
  FIVE_PLUS_CHARS: 5,      // $5 USD per year
  FOUR_CHARS: 160,         // $160 USD per year
  THREE_CHARS: 640,        // $640 USD per year
};

// Auction configuration
export const AUCTION_CONFIG = {
  GRACE_PERIOD_DAYS: 30,   // 30 days grace period after expiration
  RECYCLE_PERIOD_DAYS: 30, // 30 days auction period
  INITIAL_PREMIUM_USD: 100, // Starting premium
};

// API endpoints
export const API_ENDPOINTS = {
  AVAX_PRICE: 'https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd',
};

if (!PLUGIN_URL) {
  console.error(
    "!!! Plugin URL not found in env, BITTE_CONFIG or DEPLOYMENT_URL !!!"
  );
  process.exit(1);
}

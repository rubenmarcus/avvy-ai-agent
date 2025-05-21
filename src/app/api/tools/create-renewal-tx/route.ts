import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createPublicClient, http, parseEther, encodeFunctionData, getAddress, toBytes, keccak256 } from 'viem';
import { avalanche } from 'viem/chains';
import { AVVY_DOMAINS_ABI } from '@/lib/contracts/avvy-domains-abi';
import {
  handleRequest,
  signRequestFor,
} from "@bitte-ai/agent-sdk";

const AVVY_DOMAINS_CONTRACT = '0x5BBD3a8E215B1fC30595fd1Aba4F3FcDbB614078'; // Verify this is the correct contract address

async function logic(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domainName = searchParams.get('domainName');
  const years = searchParams.get('years');

  if (!domainName) {
    throw new Error('Domain name is required');
  }

  if (!years || Number.isNaN(Number(years)) || Number(years) < 1) {
    throw new Error('Valid years parameter (minimum 1) is required');
  }

  // Calculate price based on domain length
  let pricePerYear = 5; // default for 5+ characters

  if (domainName.length === 3) {
    pricePerYear = 640;
  } else if (domainName.length === 4) {
    pricePerYear = 160;
  }

  const totalYears = Number(years);
  const priceUSD = pricePerYear * totalYears;

  // Fetch real AVAX price using fetch instead of axios
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd');
  const data = await response.json();
  const avaxPrice = data['avalanche-2'].usd;
  const priceAVAX = (priceUSD / avaxPrice).toFixed(6);

  // Initialize viem public clientnp
  const client = createPublicClient({
    chain: avalanche,
    transport: http('https://api.avax.network/ext/bc/C/rpc')
  });

  // Get the domain hash
  const domainHash = keccak256(toBytes(domainName));

  // Fetch current domain expiry
  const currentExpiry = await client.readContract({
    address: getAddress(AVVY_DOMAINS_CONTRACT),
    abi: AVVY_DOMAINS_ABI,
    functionName: 'expiryOf',
    args: [domainHash]
  });

  // Calculate new expiry timestamp (current + years in seconds)
  const secondsInYear = 365 * 24 * 60 * 60;
  const newExpiryTimestamp = Number(currentExpiry) + (totalYears * secondsInYear);
  const newExpiryDate = new Date(newExpiryTimestamp * 1000);

  // Generate contract calldata for renewing the domain
  const calldata = encodeFunctionData({
    abi: AVVY_DOMAINS_ABI,
    functionName: 'renewDomain',
    args: [domainHash, BigInt(newExpiryTimestamp)]
  });

  // Avalanche C-Chain
  const chainId = 43114;

  return {
    transaction: signRequestFor({
      chainId,
      metaTransactions: [{
        to: AVVY_DOMAINS_CONTRACT,
        data: calldata,
        value: parseEther(priceAVAX).toString()
      }],
    }),
    meta: {
      domainName: `${domainName}.avax`,
      priceUSD,
      avaxPrice,
      priceAVAX,
      newExpiryDate: newExpiryDate.toISOString()
    }
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleRequest(req, logic, (result) => NextResponse.json(result));
}
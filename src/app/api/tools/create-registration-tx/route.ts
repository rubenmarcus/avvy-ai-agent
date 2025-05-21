import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  handleRequest,
  signRequestFor,
} from "@bitte-ai/agent-sdk";

async function logic(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domainName = searchParams.get('domainName');
  const years = searchParams.get('years');
  const enhancedPrivacy = searchParams.get('enhancedPrivacy') === 'true';

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

  // Fetch real-time AVAX price
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd');
  if (!response.ok) {
    throw new Error('Failed to fetch AVAX price');
  }

  const data = await response.json();
  const avaxPrice = data['avalanche-2'].usd;
  const priceAVAX = (priceUSD / avaxPrice).toFixed(4);

  // Create expiry date
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + totalYears);

  // Build proper ABI-encoded data for domain registration
  const contractAddress = "0x5BBD3a8E215B1fC30595fd1Aba4F3FcDbB614078"; // Avvy Domains contract

  // Function signature for registerDomain(string,uint256)
  const functionSignature = "0x3fa4f245"; // keccak256("registerDomain(string,uint256)") first 4 bytes

  // ABI encode domain name and years
  const encodedDomain = encodeString(domainName);
  const encodedYears = encodeUint256(totalYears);

  // Construct transaction data
  const txData = `${functionSignature}${encodedDomain}${encodedYears}`;

  const valueInWei = BigInt(Math.floor(Number(priceAVAX) * 10**18)).toString();

  // Avalanche C-Chain
  const chainId = 43114;

  return {
    transaction: signRequestFor({
      chainId,
      metaTransactions: [{
        to: contractAddress,
        data: txData,
        value: valueInWei
      }],
    }),
    meta: {
      domainName: `${domainName}.avax`,
      priceUSD,
      priceAVAX,
      currentAvaxPriceUSD: avaxPrice,
      expiryDate: expiryDate.toISOString(),
      enhancedPrivacy
    }
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleRequest(req, logic, (result) => NextResponse.json(result));
}

// Helper functions for ABI encoding
function encodeString(str: string): string {
  const bytes = Buffer.from(str, 'utf8');
  const length = bytes.length;

  // Encode dynamic type position (32 bytes from the start of data part)
  const position = '0000000000000000000000000000000000000000000000000000000000000020';

  // Encode string length
  const lengthHex = length.toString(16).padStart(64, '0');

  // Encode string data
  const dataHex = bytes.toString('hex').padEnd(Math.ceil(length / 32) * 64, '0');

  return `${position}${lengthHex}${dataHex}`;
}

function encodeUint256(value: number): string {
  return value.toString(16).padStart(64, '0');
}
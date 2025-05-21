import { NextResponse } from 'next/server';
import { Client } from '@avvy/client';
import { createPublicClient, http } from 'viem';
import { avalanche } from 'viem/chains';
import { API_RPC_URL } from '@/app/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let domainName = searchParams.get('domainName');

  if (!domainName) {
    return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
  }

  // Add .avax extension if not already present
  if (!domainName.endsWith('.avax')) {
    domainName = `${domainName}.avax`;
  }

  try {
    // Create Viem client
    const client = createPublicClient({
      chain: avalanche,
      transport: http(API_RPC_URL),
    });

    // Initialize Avvy client
    const avvy = new Client(client);

    // Check if domain exists
    const domainHash = await avvy.utils.nameHash(domainName);

    // Get registry to check owner
    const registry = await avvy.getRegistry();
    const owner = await registry.owner(domainHash);

    if (!owner) {
      return NextResponse.json({
        domainName,
        available: true,
        error: 'Domain not registered'
      }, { status: 404 });
    }

    // Get domain expiration
    const registrar = await avvy.getRegistrar();
    const expiry = await registrar.nameExpires(domainHash);
    let expiryDate = null;

    if (expiry) {
      const expiryTimestamp = typeof expiry === 'bigint'
        ? Number(expiry)
        : expiry.toNumber();
      expiryDate = new Date(expiryTimestamp * 1000).toISOString();
    }

    // Get common records
    const records: Record<string, string> = {};
    const recordTypes = ['EVM', 'CONTENT', 'AVATAR', 'EMAIL', 'URL', 'BTC', 'IPFS'];

    for (const type of recordTypes) {
      try {
        const value = await avvy.resolve(domainName, type);
        if (value) {
          records[type] = value;
        }
      } catch (error) {
        // Skip records that don't exist
        return NextResponse.json({ error: `Failed to fetch domain info ${error}` }, { status: 500 });
      }
    }

    return NextResponse.json({
      domainName,
      available: false,
      expiryDate,
      owner,
      records
    });
  } catch (error) {
    console.error('Error fetching domain info:', error);
    return NextResponse.json({ error: 'Failed to fetch domain info' }, { status: 500 });
  }
}
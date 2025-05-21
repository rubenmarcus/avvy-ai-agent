import { NextResponse } from 'next/server';
import { Client } from '@avvy/client';
import { createPublicClient, http } from 'viem';
import { avalanche } from 'viem/chains';
import { API_RPC_URL } from '@/app/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainName = searchParams.get('domainName');

  if (!domainName) {
    return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
  }

  try {
    // Mock implementation - in a real scenario, this would fetch data from Avvy Domains API
    const mockData = {
      domainName: `${domainName}.avax`,
      available: false,
      expiryDate: '2025-01-01T00:00:00Z',
      owner: '0x1234567890123456789012345678901234567890',
      records: {
        EVM: '0x1234567890123456789012345678901234567890',
        AVATAR: 'https://example.com/avatar.png'
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching domain info:', error);
    return NextResponse.json({ error: 'Failed to fetch domain info' }, { status: 500 });
  }
}
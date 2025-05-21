import { NextResponse } from 'next/server';
import { Client } from '@avvy/client';
import { createPublicClient, http } from 'viem';
import { avalanche } from 'viem/chains';
import { API_RPC_URL } from '@/app/config';

// Create a type-safe record map
interface AvvyRecordMapping {
  [key: string]: string | { [key: string]: string };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let domainName = searchParams.get('domainName');
  const recordType = searchParams.get('recordType') || 'EVM';
  const customKey = searchParams.get('customKey');

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

    // Determine which record to resolve
    let value: string | null = null;

    if (recordType === 'CUSTOM' && customKey) {
      // Custom record resolution
      try {
        value = await avvy.resolve(domainName, `CUSTOM:${customKey}`);
      } catch (error) {
        console.error('Error resolving custom record:', error);
        return NextResponse.json({ error: 'Custom record not found' }, { status: 404 });
      }
    } else {
      // Standard record resolution
      const recordTypeKey = recordType as keyof typeof avvy.constants.RECORDS;

      try {
        value = await avvy.resolve(domainName, recordType);
      } catch (error) {
        console.error('Error resolving record:', error);
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }
    }

    if (!value) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({
      domainName,
      recordType: recordType === 'CUSTOM' ? `CUSTOM:${customKey}` : recordType,
      value
    });
  } catch (error) {
    console.error('Error resolving domain:', error);
    return NextResponse.json({ error: 'Failed to resolve domain' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainName = searchParams.get('domainName');
  const years = searchParams.get('years');

  if (!domainName) {
    return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
  }

  if (!years || Number.isNaN(Number(years)) || Number(years) < 1) {
    return NextResponse.json({ error: 'Valid years parameter (minimum 1) is required' }, { status: 400 });
  }

  try {
    // Calculate price based on domain length
    let pricePerYear = 5; // default for 5+ characters

    if (domainName.length === 3) {
      pricePerYear = 640;
    } else if (domainName.length === 4) {
      pricePerYear = 160;
    }

    const totalYears = Number(years);
    const priceUSD = pricePerYear * totalYears;

    // Mock AVAX price calculation - in a real scenario, would use Chainlink price feed
    const mockAvaxPrice = 20; // $20 per AVAX
    const priceAVAX = (priceUSD / mockAvaxPrice).toFixed(4);

    return NextResponse.json({
      domainName: `${domainName}.avax`,
      priceUSD,
      priceAVAX,
      years: totalYears
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    return NextResponse.json({ error: 'Failed to calculate price' }, { status: 500 });
  }
}
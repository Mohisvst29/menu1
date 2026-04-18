import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { OfferBannerModel } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const offers = await OfferBannerModel.find().lean();
    return NextResponse.json(offers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const banners = await req.json();
    await dbConnect();
    
    // Replace all banners
    await OfferBannerModel.deleteMany({});
    if (banners.length > 0) {
      await OfferBannerModel.insertMany(banners);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

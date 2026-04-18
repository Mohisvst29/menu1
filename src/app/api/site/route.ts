import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { SiteConfigModel } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    let config = await SiteConfigModel.findOne();
    if (!config) {
      // Return empty default to avoid error
      return NextResponse.json({ businessName: 'My Business', theme: { primaryColor: '#f97316' } });
    }
    return NextResponse.json(config);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    // Use findOneAndUpdate with upsert to manage a single config document
    await SiteConfigModel.findOneAndUpdate({}, body, { upsert: true, new: true });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

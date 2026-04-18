import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { SiteConfigModel } from '@/lib/models';
import { getSiteConfig } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let config = await SiteConfigModel.findOne();
    
    // Auto-migration from JSON to MongoDB if empty
    if (!config) {
      try {
        const localData = getSiteConfig();
        if (localData && localData.businessName) {
          config = await SiteConfigModel.create(localData);
        }
      } catch (e) {
        console.log('No local site.json found to migrate');
      }
    }

    if (!config) {
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

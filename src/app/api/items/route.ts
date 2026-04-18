import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { CategoryModel, ItemModel } from '@/lib/models';
import { getItemsData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    let categories = await CategoryModel.find().sort({ order: 1 }).lean();
    let items = await ItemModel.find().lean();

    // Auto-migration
    if (categories.length === 0 && items.length === 0) {
       try {
         const local = getItemsData();
         if (local.categories.length > 0 || local.items.length > 0) {
            await CategoryModel.insertMany(local.categories);
            await ItemModel.insertMany(local.items);
            categories = await CategoryModel.find().sort({ order: 1 }).lean();
            items = await ItemModel.find().lean();
         }
       } catch (e) {
         console.log('No local items.json found');
       }
    }

    return NextResponse.json({ categories, items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { categories, items } = await req.json();
    await dbConnect();

    // In a production app, we'd do more granular updates. 
    // Here we clear and replace to match the existing saveItemsData behavior.
    await CategoryModel.deleteMany({});
    await CategoryModel.insertMany(categories);

    await ItemModel.deleteMany({});
    await ItemModel.insertMany(items);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

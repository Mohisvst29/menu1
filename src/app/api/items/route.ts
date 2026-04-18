import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { CategoryModel, ItemModel } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const categories = await CategoryModel.find().sort({ order: 1 }).lean();
    const items = await ItemModel.find().lean();
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

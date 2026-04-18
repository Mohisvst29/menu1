import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { OrderModel } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const orders = await OrderModel.find().sort({ date: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    
    // Generate Order ID ORD-XXXX based on count
    const count = await OrderModel.countDocuments();
    const nextIdNumber = count + 1001;
    const newOrderId = `ORD-${nextIdNumber}`;

    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      customer: {
        name: body.customer?.name || 'مجهول',
        phone: body.customer?.phone || '',
        address: body.customer?.address || '',
        notes: body.customer?.notes || '',
        type: body.customer?.type || 'takeaway',
        tableNum: body.customer?.tableNum || ''
      },
      items: body.items || [],
      totalAmount: body.totalAmount || 0,
      status: 'pending'
    };

    await OrderModel.create(newOrder);

    return NextResponse.json({ success: true, orderId: newOrderId });
  } catch (error: any) {
    console.error('Save order error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'Missing ID or status' }, { status: 400 });

    await dbConnect();
    const order = await OrderModel.findOneAndUpdate({ id }, { status }, { new: true });
    
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

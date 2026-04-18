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
    console.log('Order POST request received');
    const body = await req.json();
    console.log('Order body:', JSON.stringify(body).substring(0, 500));
    
    await dbConnect();
    console.log('DB connected for order save');
    
    // Generate Order ID ORD-XXXX based on count
    const count = await OrderModel.countDocuments();
    console.log('Current order count:', count);
    const nextIdNumber = count + 1001;
    const newOrderId = `ORD-${nextIdNumber}`;
    console.log('New generated OrderID:', newOrderId);
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

    const created = await OrderModel.create(newOrder);
    console.log('Order created successfully in MongoDB:', created._id);

    return NextResponse.json({ success: true, orderId: newOrderId });
  } catch (error: any) {
    console.error('CRITICAL: Save order error:', error);
    return NextResponse.json({ error: error.message || 'INTERNAL_SERVER_ERROR' }, { status: 500 });
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

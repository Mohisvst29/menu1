import { NextResponse } from 'next/server';
import { getAdminConfig, saveAdminConfig } from '@/lib/data';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const admin = getAdminConfig();

    if (admin.email === email && admin.password === password) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();
    const admin = getAdminConfig();

    if (admin.password !== currentPassword) {
      return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 401 });
    }

    saveAdminConfig({ ...admin, password: newPassword });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

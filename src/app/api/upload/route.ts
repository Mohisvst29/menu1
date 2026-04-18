import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.error('Upload Error: No file found in FormData');
      return NextResponse.json({ error: 'لم يتم العثور على ملف في الطلب' }, { status: 400 });
    }

    console.log(`Uploading file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'صيغة الملف غير مدعومة' }, { status: 400 });
    }

    // Limit base64 size to 4.4MB
    if (file.size > 4.4 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم الملف كبير جداً (الحد الأقصى 4.4MB)' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      throw new Error('فشل قراءة بيانات الملف');
    }

    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUri });
  } catch (err: any) {
    console.error('CRITICAL: Upload API global error:', err);
    return NextResponse.json({ error: 'فشل رفع الملف: ' + (err.message || 'خطأ داخلي') }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || targetLang === 'ar') {
      return NextResponse.json({ translated: text });
    }

    const langPair = `ar|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Translation API failed');

    const data = await res.json();
    const translated = data?.responseData?.translatedText || text;

    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ translated: '' }, { status: 500 });
  }
}

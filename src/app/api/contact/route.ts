import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const db = await getDb();
    const info = await db.run('INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?)', [name, email, message]);

    return NextResponse.json({ success: true, id: info.lastID });
  } catch (error) {
    console.error('Error guardando el mensaje:', error);
    return NextResponse.json({ error: 'Error del servidor al procesar la solicitud' }, { status: 500 });
  }
}

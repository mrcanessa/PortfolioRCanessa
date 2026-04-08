import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    // Verificación de API Key
    if (!apiKey) {
      console.error('ERROR: La variable de entorno RESEND_API_KEY no está configurada.');
      return NextResponse.json({ error: 'Configuración de correo incompleta' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // 1. Notificación para Marcelo (Dueño)
    await resend.emails.send({
      from: 'Portafolio <onboarding@resend.dev>',
      to: 'marcelo.rcanessa@gmail.com',
      subject: `Coordinar reunión inicial - ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Nueva Consulta de Portafolio</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    });

    // 2. Respuesta automática para el Cliente (Backup)
    await resend.emails.send({
      from: 'Marcelo Rodriguez Canessa <onboarding@resend.dev>',
      to: email,
      subject: 'Propuesta recibida',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
          <h2 style="color: #3b82f6;">¡Gracias por contactarme!</h2>
          <p>Estimado/a <strong>${name}</strong>,</p>
          <p>Su propuesta ha sido recibida correctamente. He tomado nota de sus requerimientos y nos contactaremos con usted a la brevedad para coordinar los siguientes pasos.</p>
          <p>Este es un mensaje de respaldo para confirmar que la información ha sido procesada de manera exitosa en nuestro sistema.</p>
          <br />
          <p>Atentamente,</p>
          <p><strong>Marcelo Rodriguez Canessa</strong><br />
          Consultoría e Ingeniería Tecnológica</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    return NextResponse.json({ error: 'Error del servidor al procesar la solicitud' }, { status: 500 });
  }
}

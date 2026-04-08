import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializamos Resend con la API Key de las variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Verificación de API Key
    if (!process.env.RESEND_API_KEY) {
      console.error('ERROR: La variable de entorno RESEND_API_KEY no está configurada en Vercel.');
      return NextResponse.json({ error: 'Configuración de correo incompleta' }, { status: 500 });
    }

    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Enviamos el correo a través de Resend
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Por defecto en modo trial, luego puedes usar tu dominio
      to: 'marcelo.rcanessa@gmail.com',
      subject: `Coordinar reunión inicial - ${name}`,
      reply_to: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Nueva Consulta de Portafolio</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8rem; color: #666;">Este mensaje fue enviado desde el formulario de contacto de tu portafolio.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    return NextResponse.json({ error: 'Error del servidor al procesar la solicitud' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass) {
      console.error('ERROR: Las variables GMAIL_USER o GMAIL_PASS no están configuradas.');
      return NextResponse.json({ error: 'Configuración de correo incompleta' }, { status: 500 });
    }

    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Configuración del transporte de Nodemailer para Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass, // Aquí va la Contraseña de Aplicación de 16 letras
      },
    });

    // 1. Notificación para Marcelo (Desde Marcelo para Marcelo)
    await transporter.sendMail({
      from: `"${name}" <${user}>`, // Usamos tu correo como remitente real
      to: user,
      replyTo: email,
      subject: `Coordinar reunión inicial - ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Nueva Consulta de Portafolio</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // 2. Respuesta automática para el Cliente (Desde Marcelo para el Cliente)
    await transporter.sendMail({
      from: `"Marcelo Rodriguez Canessa" <${user}>`,
      to: email,
      subject: 'Propuesta recibida',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <p>Hola <strong>${name}</strong>,</p>
          <p>Su propuesta a sido recibida, nos contactaremos a la brevedad.</p>
          <p>Gracias por su interés.</p>
          <br />
          <p>Atentamente,</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0; width: 200px;" />
          <p><strong>Marcelo Rodriguez Canessa</strong><br />
          Ingeniería y Consultoría Tecnológica</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando el correo con Nodemailer:', error);
    return NextResponse.json({ error: 'Error del servidor al procesar la solicitud' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getDb } from '@/lib/db';

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

    // --- Persistencia y Recuperación de Historial ---
    let historyHtml = '';
    try {
      const db = await getDb();
      
      // 1. Obtener historial ANTES de guardar el nuevo (para saber qué pidió antes)
      const previousInquiries = await db.all(
        'SELECT message, created_at FROM inquiries WHERE email = ? ORDER BY created_at DESC LIMIT 5',
        [email]
      );

      if (previousInquiries.length > 0) {
        historyHtml = `
          <div style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px; border: 1px dashed #cbd5e1;">
            <h4 style="margin: 0 0 10px; color: #475569; font-size: 13px;">HISTORIAL RECIENTE (${previousInquiries.length} consultas previas):</h4>
            ${previousInquiries.map((iq: any) => `
              <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
                <small style="color: #94a3b8;">${new Date(iq.created_at).toLocaleString('es-CL')}</small><br/>
                <p style="margin: 5px 0 0; font-size: 13px; color: #334155;">${iq.message}</p>
              </div>
            `).join('')}
          </div>
        `;
      }

      // 2. Guardar la consulta actual
      await db.run(
        'INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?)',
        [name, email, message]
      );
    } catch (dbError) {
      console.error('Error en la base de datos (SQLite):', dbError);
      // Continuamos con el envío de correo aunque falle la base de datos
    }

    // Configuración del transporte de Nodemailer para Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    // 1. Notificación para Marcelo (Con Historial)
    await transporter.sendMail({
      from: `"${name}" <${user}>`,
      to: user,
      replyTo: email,
      subject: `REQUERIMIENTO: ${name} (Historial disponible)`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #3b82f6; margin-top: 0;">Nueva Consulta Recibida</h2>
          <p><strong>De:</strong> ${name} (${email})</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensaje Actual:</strong></p>
          <p style="white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #f0f0f0;">${message}</p>
          
          ${historyHtml}
          
          <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
            Este mensaje ha sido registrado en la base de datos local para seguimiento de clientes recurrentes.
          </p>
        </div>
      `,
    });

    // 2. Respuesta automática para el Cliente (Conversacional)
    await transporter.sendMail({
      from: `"Marcelo Rodriguez Canessa" <${user}>`,
      to: email,
      subject: 'Hemos recibido tu mensaje - Marcelo Canessa IT',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.6;">
          <div style="background: #0f172a; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">¡Hola ${name}!</h1>
            <p style="color: #94a3b8; margin: 10px 0 0;">Tu requerimiento ha sido vinculado a tu historial.</p>
          </div>
          
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
            <p>He recibido tu solicitud y la he integrado con tus consultas previas para tener todo el contexto necesario antes de responderte.</p>
            
            <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px; color: #1e293b; font-size: 14px; text-transform: uppercase;">Resumen enviado:</h4>
              <p style="margin: 0; font-style: italic; color: #64748b;">"${message}"</p>
            </div>

            <p style="background: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px; color: #856404; font-size: 0.9em;">
              💡 <strong>¿Necesitas añadir algo más?</strong><br/>
              Si recuerdas algún detalle adicional o quieres ampliar tu requerimiento, no respondas a este correo. Por favor, <strong>vuelve a la página web</strong> y escribe nuevamente en el formulario. Mi sistema unirá automáticamente todos tus mensajes bajo tu correo electrónico.
            </p>

            <div style="margin: 30px 0; text-align: center;">
              <p style="font-size: 0.9em; color: #64748b;">Analizaré tu caso hoy mismo. Recibirás una respuesta personalizada en menos de 48 horas.</p>
            </div>

            <p style="margin-bottom: 0;">Un saludo,</p>
            <p style="margin-top: 5px;"><strong>Marcelo Rodriguez Canessa</strong><br />
            <span style="color: #64748b; font-size: 0.9em;">Consultoría e Ingeniería IT</span></p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error general en el servicio de contacto:', error);
    return NextResponse.json({ error: 'Error del servidor al procesar la solicitud' }, { status: 500 });
  }
}

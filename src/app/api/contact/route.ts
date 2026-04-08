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
    const { name, email, message, industry, scale, timeline, procedures, notes } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // --- Persistencia y Recuperación de Historial ---
    let historyHtml = '';
    try {
      const db = await getDb();
      
      // 1. Obtener historial ANTES de guardar el nuevo
      const previousInquiries = await db.all(
        'SELECT message, created_at FROM inquiries WHERE email = ? ORDER BY created_at DESC LIMIT 5',
        [email]
      );

      if (previousInquiries.length > 0) {
        historyHtml = `
          <div style="margin-top: 25px; padding: 15px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">
            <h4 style="margin: 0 0 10px; color: #475569; font-size: 12px; text-transform: uppercase;">Historial Reciente (Últimos 5):</h4>
            ${previousInquiries.map((iq: any) => `
              <div style="margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                <small style="color: #94a3b8;">${new Date(iq.created_at).toLocaleDateString()}</small>
                <p style="margin: 2px 0; font-size: 13px; color: #334155; height: 1.2em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${iq.message}</p>
              </div>
            `).join('')}
          </div>
        `;
      }

      // 2. Guardar la consulta actual con todos los campos
      await db.run(
        'INSERT INTO inquiries (name, email, message, industry, scale, timeline, procedures, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, message, industry, scale, timeline, procedures, notes]
      );
    } catch (dbError) {
      console.error('Error en base de datos:', dbError);
    }

    // Configuración del transporte de Nodemailer para Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    // 1. Notificación para Marcelo (Reporte Técnico)
    await transporter.sendMail({
      from: `"Consultoria e Ingenieria IT" <${user}>`,
      to: user,
      replyTo: email,
      subject: `NUEVO PROYECTO: ${name} (${industry})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1e293b;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Ficha Técnica de Requerimiento</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Cliente/Empresa:</td><td>${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Correo:</td><td>${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #3b82f6;">Rubro/Industria:</td><td>${industry}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #3b82f6;">Escala:</td><td>${scale}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #3b82f6;">Plazo Deseado:</td><td><span style="background: #eff6ff; padding: 2px 8px; border-radius: 4px;">${timeline}</span></td></tr>
          </table>

          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px; color: #3b82f6;">Requerimiento Principal:</h4>
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: #fdf2f8; padding: 15px; border-radius: 8px; border-left: 4px solid #db2777;">
              <h4 style="margin: 0 0 5px; font-size: 13px; color: #db2777;">Procedimientos sugeridos:</h4>
              <p style="margin: 0; font-size: 14px;">${procedures || 'No especificado'}</p>
            </div>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
              <h4 style="margin: 0 0 5px; font-size: 13px; color: #16a34a;">Notas del cliente:</h4>
              <p style="margin: 0; font-size: 14px;">${notes || 'Sin notas adicionales'}</p>
            </div>
          </div>

          ${historyHtml}

          <p style="font-size: 11px; color: #94a3b8; margin-top: 40px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Sistema de Gestión IT - Marcelo Canessa. Responde directamente a este correo para contactar al cliente.
          </p>
        </div>
      `,
    });

    // 2. Respuesta automática para el Cliente
    await transporter.sendMail({
      from: `"Consultoria e Ingenieria IT" <${user}>`,
      to: email,
      subject: `Confirmación de Requerimiento para ${industry} - Consultoria e Ingenieria IT`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.6;">
          <div style="background: #0f172a; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">¡Propuesta Estratégica en Marcha!</h1>
          </div>
          
          <div style="padding: 30px;">
            <p>Hola <strong>${name}</strong>,</p>
            <p>He recibido los detalles técnicos para tu proyecto en el sector de <strong>${industry}</strong>. Contar con la escala de <strong>${scale}</strong> y el plazo de <strong>${timeline}</strong> me permite realizar un análisis mucho más preciso.</p>
            
            <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">Analizaré los procedimientos sugeridos: <em>"${procedures || 'Evaluación estándar'}"</em> y me pondré en contacto contigo hoy mismo.</p>
            </div>

            <p style="background: #fefce8; border: 1px solid #fef08a; padding: 15px; border-radius: 8px; color: #854d0e; font-size: 0.9em; text-align: center;">
              💡 <strong>Dato:</strong> Si necesitas enviarme esquemas de red o diagramas, puedes responder a mi correo de contacto directo una vez que te escriba.
            </p>

            <p style="margin-top: 30px; font-weight: bold; color: #1e293b;">¿Necesitas añadir detalles técnicos?</p>
            <p style="font-size: 0.9em;">No respondas aquí. Por favor, <strong>vuelve a nuestro sitio web</strong> y rellena el formulario nuevamente. Mi sistema unirá la nueva información a tu ficha técnica actual.</p>
            
            <br />
            <p style="margin-bottom: 0;">Un saludo cordial,</p>
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

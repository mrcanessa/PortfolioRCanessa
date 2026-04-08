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

    // 2. Respuesta automática para el Cliente (Estilo ISO / Orden de Requerimiento)
    const orderId = `OR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const currentDate = new Date().toLocaleDateString('es-CL');

    await transporter.sendMail({
      from: `"Consultoria e Ingenieria IT" <${user}>`,
      to: email,
      subject: `[CONFIRMACIÓN] Orden de Requerimiento ${orderId} - ${industry}`,
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 800px; margin: 20px auto; border: 2px solid #334155; color: #1e293b; background: #ffffff;">
          
          <!-- Encabezado de Documento -->
          <table style="width: 100%; border-bottom: 2px solid #334155; border-collapse: collapse;">
            <tr>
              <td style="padding: 15px; width: 40%; border-right: 2px solid #334155; text-align: center;">
                <h2 style="margin: 0; color: #1e40af; font-size: 18px; letter-spacing: 2px;">CONSULTORÍA E INGENIERÍA IT</h2>
                <small style="font-size: 10px; color: #64748b;">SOLUCIONES DE ALTA DISPONIBILIDAD</small>
              </td>
              <td style="padding: 15px; text-align: center; background: #f8fafc;">
                <h1 style="margin: 0; font-size: 20px; text-transform: uppercase;">Orden de Requerimiento</h1>
                <p style="margin: 5px 0 0; font-size: 12px; font-weight: bold; color: #3b82f6;">DOC # ${orderId}</p>
              </td>
              <td style="padding: 15px; width: 25%; border-left: 2px solid #334155; font-size: 11px;">
                <strong>Fecha:</strong> ${currentDate}<br/>
                <strong>Versión:</strong> 1.0<br/>
                <strong>Estado:</strong> EN ANÁLISIS
              </td>
            </tr>
          </table>

          <!-- Datos del Solicitante / Proyecto -->
          <div style="padding: 20px; background: #f1f5f9; border-bottom: 2px solid #334155;">
            <table style="width: 100%; font-size: 13px;">
              <tr>
                <td style="width: 50%;"><strong>EMPRESA / SOLICITANTE:</strong> ${name}</td>
                <td><strong>RUBRO INDUSTRIAL:</strong> ${industry}</td>
              </tr>
              <tr>
                <td style="padding-top: 5px;"><strong>CONTACTO:</strong> ${email}</td>
                <td style="padding-top: 5px;"><strong>CÓDIGO CLIENTE:</strong> 13D-CONS-VIP</td>
              </tr>
            </table>
          </div>

          <!-- Grilla Técnica Central -->
          <table style="width: 100%; border-collapse: collapse; min-height: 250px;">
            <tr>
              <!-- Columna Requerimientos -->
              <td style="padding: 20px; width: 60%; border-right: 2px solid #334155; vertical-align: top;">
                <h4 style="margin: 0 0 10px; font-size: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; text-transform: uppercase;">I. Especificaciones Técnicas</h4>
                <p style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;"><strong>Descripción General:</strong><br/>${message}</p>
                
                <h4 style="margin: 20px 0 10px; font-size: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; text-transform: uppercase;">II. Procedimientos Sugeridos</h4>
                <p style="font-size: 13px; color: #475569;">${procedures || 'Sujeto a evaluación técnica inicial'}</p>
              </td>

              <!-- Columna Tiempos / Escala -->
              <td style="padding: 20px; width: 40%; vertical-align: top; background: #fcfcfc;">
                <h4 style="margin: 0 0 10px; font-size: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; text-transform: uppercase;">III. Factores de Entrega</h4>
                
                <div style="margin-bottom: 20px;">
                  <strong style="font-size: 11px;">PLAZO ESTIMADO:</strong><br/>
                  <span style="font-size: 16px; color: #1e40af; font-weight: bold;">${timeline}</span>
                </div>

                <div style="margin-bottom: 20px;">
                  <strong style="font-size: 11px;">ESCALA DE INFRAESTRUCTURA:</strong><br/>
                  <span style="font-size: 14px;">${scale}</span>
                </div>

                <div style="padding: 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 4px; font-size: 11px; margin-top: 30px;">
                  <strong>NOTA IMPORTANTE:</strong><br/>
                  Este requerimiento será analizado hoy mismo. Favor no responder aquí. Use el portal web para actualizaciones.
                </div>
              </td>
            </tr>
          </table>

          <!-- Observaciones Adicionales -->
          <div style="padding: 15px; border-top: 2px solid #334155; background: #fafafa;">
             <small style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 10px;">OBSERVACIONES / NOTAS DEL CLIENTE:</small>
             <p style="margin: 0; font-size: 12px; font-style: italic; color: #64748b;">${notes || 'Sin observaciones registradas por el solicitante en el formulario inicial.'}</p>
          </div>

          <!-- Pie de Documento / Firmas -->
          <table style="width: 100%; border-top: 2px solid #334155; border-collapse: collapse; text-align: center; font-size: 10px;">
            <tr>
              <td style="padding: 30px 15px 15px; width: 33.3%; border-right: 2px solid #334155;">
                <div style="margin-bottom: 15px; height: 1px; background: #cbd5e1;"></div>
                <strong>ELABORADO POR</strong><br/>
                SISTEMA AUTOMATIZADO V.1
              </td>
              <td style="padding: 30px 15px 15px; width: 33.3%; border-right: 2px solid #334155;">
                <div style="margin-bottom: 15px; height: 1px; background: #cbd5e1;"></div>
                <strong>REVISADO POR</strong><br/>
                INGENIERÍA PRE-VENTA
              </td>
              <td style="padding: 15px; width: 33.3%; background: #f8fafc;">
                <div style="display: inline-block; padding: 5px 10px; border: 3px double #3b82f6; color: #3b82f6; transform: rotate(-5deg); font-weight: 800; font-size: 14px;">
                   VALIDADO
                </div>
                <br/><br/>
                <strong>APROBADO POR</strong><br/>
                M. RODRÍGUEZ CANESSA
              </td>
            </tr>
          </table>

          <div style="background: #334155; color: #ffffff; padding: 10px; text-align: center; font-size: 9px; letter-spacing: 1px;">
             © ${new Date().getFullYear()} CONSULTORÍA E INGENIERÍA IT - CONFIDENCIAL - DOCUMENTO DIGITAL VÁLIDO SIN FIRMA FÍSICA
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

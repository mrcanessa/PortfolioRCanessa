'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentQRProps {
  amount: number;
  concept: string;
}

export default function PaymentQR({ amount, concept }: PaymentQRProps) {
  const [copied, setCopied] = useState(false);
  
  // En un caso real, el JSON podría ser una URL de MercadoPago, Stripe, o CBU/Alias.
  // Aquí usamos un JSON de ejemplo para que lo procese la app bancaria o se muestre visualmente.
  const paymentData = JSON.stringify({
    to: "consultoria@ejemplo.com",
    amount,
    concept,
    currency: "USD"
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '350px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Escanear para Pagar</h3>
        <p style={{ fontSize: '0.9rem' }}>{concept}</p>
      </div>
      
      <div style={{ background: 'white', padding: '1rem', borderRadius: '12px' }}>
        <QRCodeSVG 
          value={paymentData} 
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#0a0a0a"}
          level={"Q"}
        />
      </div>
      
      <div style={{ width: '100%', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: '#a0a0a0' }}>Total a pagar:</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--foreground)' }}>${amount.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={handleCopy}
          className="btn" 
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}
        >
          {copied ? '¡Copiado!' : 'Copiar datos de pago'}
        </button>
      </div>
    </div>
  );
}

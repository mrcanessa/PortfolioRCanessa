'use client';

import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Users, TrendingDown, Clock, Leaf } from 'lucide-react';

const stats = [
  {
    icon: Users,
    end: 500,
    suffix: '+',
    label: 'Cuentas Migradas',
    description: 'Transiciones exitosas sin downtime',
    color: '#3b82f6',
  },
  {
    icon: TrendingDown,
    end: 37,
    suffix: '%',
    label: 'Reducción de Costos',
    description: 'Ahorro promedio en infraestructura',
    color: '#22c55e',
  },
  {
    icon: Clock,
    end: 99.9,
    suffix: '%',
    decimals: 1,
    label: 'Uptime Garantizado',
    description: 'Disponibilidad de servicios críticos',
    color: '#60a5fa',
  },
  {
    icon: Leaf,
    end: 40,
    suffix: '%',
    label: 'Menos Huella Digital',
    description: 'Reducción de consumo energético promedio',
    color: '#10b981',
  },
];

export default function StatsCounter() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section ref={ref} style={{ padding: '6rem 0' }}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="stat-card"
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow accent at top */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                }} />
                
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}>
                  <Icon size={26} color={stat.color} />
                </div>

                <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.5rem', lineHeight: 1 }}>
                  {inView ? (
                    <CountUp
                      end={stat.end}
                      duration={2.5}
                      decimals={stat.decimals || 0}
                      suffix={stat.suffix}
                    />
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'white' }}>
                  {stat.label}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

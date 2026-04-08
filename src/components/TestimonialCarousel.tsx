'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  project: string;
}

const allTestimonials: Testimonial[] = [
  {
    name: 'Carlos Mendoza',
    role: 'Director de Operaciones',
    text: 'Pensábamos que mover 500 empleados a un nuevo ecosistema paralizaría nuestra comunicación durante semanas. Marcelo lo orquestó en un solo fin de semana de forma transparente.',
    rating: 5,
    project: 'Migración Google Workspace',
  },
  {
    name: 'Lorena Silva',
    role: 'Tech Lead',
    text: 'La interface nueva nos salvó la vida en el retorno híbrido. Además de los ahorros, nos brindó un taller excelente de concientización sobre Phishing.',
    rating: 5,
    project: 'Migración Google Workspace',
  },
  {
    name: 'Alberto Fujimoto',
    role: 'CEO en GlobalRetail Corp',
    text: 'Desde que implementamos el esquema Auto-Scaling los costos fijos bajaron en 37%. Este último CyberMonday el sitio se mantuvo intocable ante millones de visitas.',
    rating: 5,
    project: 'Infraestructura Híbrida AWS',
  },
  {
    name: 'María Valenzuela',
    role: 'CTO',
    text: 'A nivel gerencial, tener la trazabilidad híbrida entre el sistema antiguo y la velocidad de AWS nos devolvió la operatividad que soñábamos. Impresionante despliegue.',
    rating: 5,
    project: 'Infraestructura Híbrida AWS',
  },
  {
    name: 'Roberto Castañeda',
    role: 'Director de Infraestructura',
    text: 'Irse a dormir con la certeza de no caer víctimas del Ransomware al día siguiente lo vale todo. Un desempeño impecable en un tema sumamente técnico.',
    rating: 5,
    project: 'Seguridad Perimetral Fortinet',
  },
  {
    name: 'Sandra Villalba',
    role: 'Compliance Officer B2B',
    text: 'Nos permitió certificar los procesos de ciberseguridad a tiempo para pasar las auditorías externas. Cumplimos cada meta delineada en el control de acceso.',
    rating: 4,
    project: 'Seguridad Perimetral Fortinet',
  },
];

export default function TestimonialCarousel() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="testimonios" ref={ref} style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span style={{
            color: 'var(--accent-green)',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
          }}>
            Voces de Confianza
          </span>
          <h2 style={{ fontSize: '3rem', marginTop: '1rem' }}>
            Lo que Dicen <span className="text-gradient">Nuestros Clientes</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 120,
              modifier: 2,
              slideShadows: false,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet swiper-custom-bullet',
              bulletActiveClass: 'swiper-custom-bullet-active',
            }}
            spaceBetween={30}
            loop={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1.3 },
              900: { slidesPerView: 2 },
              1200: { slidesPerView: 2.5 },
            }}
            style={{ paddingBottom: '4rem' }}
          >
            {allTestimonials.map((t, index) => (
              <SwiperSlide key={index} style={{ height: 'auto' }}>
                <div
                  className="testimonial-slide-card"
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '1.2rem',
                    padding: '2.5rem',
                    minHeight: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  {/* Accent line at top */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #3b82f6, #22c55e, transparent)',
                  }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                        ))}
                        {[...Array(5 - t.rating)].map((_, i) => (
                          <Star key={`empty-${i}`} size={14} color="rgba(255,255,255,0.15)" />
                        ))}
                      </div>
                      <Quote size={28} color="rgba(34,197,94,0.2)" />
                    </div>

                    <p style={{
                      fontSize: '1.05rem',
                      fontStyle: 'italic',
                      color: '#e2e8f0',
                      lineHeight: 1.7,
                      marginBottom: '1.5rem',
                    }}>
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  <div>
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-green) 100%)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: 'white',
                      }}>
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.1rem', color: 'white' }}>{t.name}</p>
                        <p style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 500 }}>{t.role}</p>
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '0.8rem',
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.6rem',
                      background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      borderRadius: '4px',
                      color: 'var(--accent-green)',
                      fontWeight: 600,
                    }}>
                      {t.project}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}

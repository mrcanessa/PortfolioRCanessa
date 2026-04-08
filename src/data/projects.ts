export type Project = {
  id: string;
  slug: string;
  icon: string;
  title: string;
  shortDescription: string;
  tags: string[];
  fullDescription: string;
  challenges: string[];
  solutions: string[];
  testimonials: {
    name: string;
    role: string;
    text: string;
    rating: number;
  }[];
};

export const projects: Project[] = [
  {
    id: "1",
    slug: "migracion-workspace",
    icon: "Mail",
    title: "Migración a Google Workspace",
    shortDescription: "Transición de 500+ cuentas on-premise con cero pérdida.",
    tags: ["Workspace", "Migración"],
    fullDescription: "Dirigimos la transición de más de 500 cuentas desde servidores On-Premise físicos heredados hacia la plataforma Google Workspace. Este monumental cambio de arquitectura involucró la configuración de redes de confianza, auditorías de correo, importaciones automatizadas por lotes sin pérdida de información y reglas estrictas de MDM (Mobile Device Management) para la flota de trabajo remota.",
    challenges: [
      "Hardware obsoleto con latencia diaria afectando operativas.",
      "Altos gastos mensuales de mantenimiento de servidores locales.",
      "Rutas de correo anticuadas que generaban constantes rebotes."
    ],
    solutions: [
      "Implementación de Cloud Identity y Google Workspace Enterprise.",
      "Migración masiva de protocolos IMAP a la nube sin 'downtime' real.",
      "Entrenamiento de capacidades IT de ciberseguridad a nivel empleados."
    ],
    testimonials: [
      {
        name: "Carlos Mendoza",
        role: "Director de Operaciones",
        text: "Pensábamos que mover 500 empleados a un nuevo ecosistema paralizaría nuestra comunicación durante semanas. Marcelo lo orquestó en un solo fin de semana de forma transparente.",
        rating: 5
      },
      {
        name: "Lorena Silva",
        role: "Tech Lead",
        text: "La interface nueva nos salvó la vida en el retorno híbrido. Además de los ahorros, nos brindó un taller excelente de concientización sobre Phishing.",
        rating: 5
      }
    ]
  },
  {
    id: "2",
    slug: "infraestructura-hibrida-aws",
    icon: "Cloud",
    title: "Infraestructura Híbrida en AWS",
    shortDescription: "Rediseño completo de red interna usando EC2 Auto-Scaling.",
    tags: ["Cloud computing", "AWS", "DevOps"],
    fullDescription: "Ante cambios radicales del negocio digital en e-commerce, la infraestructura física cedía bajo demanda. Realizamos el diseño arquitectónico de una red híbrida AWS para establecer pasarelas VPN, crear un robusto Pipeline DevOps y proveer escalamiento bajo balanceadores de carga.",
    challenges: [
      "Picos de tráfico inmanejables durante masivas campañas B2C.",
      "Data sin redundancia nativa (no existían Backups distribuidos en múltiples zonas).",
      "Costos ocultos por sobre-provisionamiento (desperdicio pasivo)."
    ],
    solutions: [
      "Creación de topologías elásticas con clústeres EC2 dinámicos (Auto-Scaling).",
      "Provisión de RDS Multi-AZ Serverless permitiendo conmutación instantánea ante fallas.",
      "Distribución de tráfico local/internacional inteligente a través de Route53."
    ],
    testimonials: [
      {
        name: "Alberto Fujimoto",
        role: "CEO en GlobalRetail Corp",
        text: "Desde que implementamos el esquema Auto-Scaling los costos fijos bajaron en 37%. Este último CyberMonday el sitio se mantuvo intocable ante millones de visitas.",
        rating: 5
      },
      {
        name: "María Valenzuela",
        role: "CTO",
        text: "A nivel gerencial, tener la trazabilidad híbrida entre el sistema antiguo y la velocidad de AWS nos devolvió la operatividad que soñábamos. Impresionante despliegue.",
        rating: 5
      }
    ]
  },
  {
    id: "3",
    slug: "seguridad-perimetral-fortinet",
    icon: "Lock",
    title: "Seguridad Perimetral Fortinet",
    shortDescription: "Despliegue Firewall NGFW y túneles IPSec para sucursales.",
    tags: ["Cybersec", "Redes", "Cisco/Fortinet"],
    fullDescription: "Un proyecto crítico enfocado en endurecer la red corporativa de principio a fin según estándares ISO. Abarcó la evaluación de amenazas en la Dark Web, la segmentación profunda de las VLANs de área local y la implementación física e integrativa de cortafuegos FortiGate NGFW con cifrado absoluto hacia nubes bancarias.",
    challenges: [
      "Accesos vulnerables persistentes en el equipo comercial móvil (Trabajo Remoto).",
      "Hardware de ruteo perimetral End-of-Life carente de parches de seguridad de cero-días.",
      "Ausencia de un plano de recuperación ante intrusos digitales en la bóveda."
    ],
    solutions: [
      "Instalación doble (alta disponibilidad) de appliances FortiGate 100F con IPSec.",
      "Autenticación granular tipo VPN-SSL incluyendo Multi-Factor de credenciales físicas (Token).",
      "Políticas de prevención (IPS) y auditorías con informes DPI automatizados."
    ],
    testimonials: [
      {
        name: "Roberto Castañeda",
        role: "Director de Infraestructura",
        text: "Irse a dormir con la certeza de no caer víctimas del Ransomware al día siguiente lo vale todo. Un desempeño impecable en un tema sumamente técnico de redes perimetrales comerciales.",
        rating: 5
      },
      {
        name: "Sandra Villalba",
        role: "Compliance Officer B2B",
        text: "Nos permitió certificar los procesos de ciberseguridad a tiempo para pasar las auditorías externas. Cumplimos cada meta delineada en el control de acceso en red.",
        rating: 4
      }
    ]
  }
];

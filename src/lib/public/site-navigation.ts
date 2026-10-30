// ============================================================================
// CONTENIDO PROVISIONAL DE LA NUEVA EXPERIENCIA PÚBLICA (prototipo)
// ----------------------------------------------------------------------------
// Todo el contenido temporal del prototipo vive AQUÍ, localizado y señalado,
// para reemplazarlo luego por fuentes CMS aprobadas. No dispersar textos
// provisionales por los componentes.
// ============================================================================

export interface SiteNavItem {
  label: string;
  href: string;
}

// Navegación del prototipo. NO depende de la base de datos (la nav CMS
// existente apunta a las rutas actuales y se revisará después de aprobar
// el nuevo mapa del sitio).
export const SITE_NAV: SiteNavItem[] = [
  { label: "Conócenos", href: "/conocenos" },
  { label: "Eventos", href: "/eventos" },
  { label: "Contacto", href: "/contacto" },
];

// CTA único del header (evita duplicar "Visítanos" como enlace y botón).
export const SITE_CTA: SiteNavItem = { label: "Visítanos", href: "/visita" };

// Acción principal del hero. "Ver mensajes" se omite hasta que exista un
// destino real (no hay reproductor ni videos publicados todavía).
export const HERO_PRIMARY_CTA: SiteNavItem = {
  label: "Planea tu visita",
  href: "/visita",
};

// ----------------------------------------------------------------------------
// Hero: banner dinámico con clips de 1 segundo.
// Coloca los clips en `public/videos/hero/` (MP4, ~1 s cada uno, con el mismo
// encuadre/tamaño del banner) y agrégalos a esta lista en el orden deseado.
// Se reproducen en bucle, silenciosos; si la lista está vacía solo se muestra
// el poster (sin control de pausa). Con clips se activa el control de pausa
// y el respeto a prefers-reduced-motion.
// ----------------------------------------------------------------------------
export const HERO_CLIPS: string[] = [
  // "/videos/hero/clip-01.mp4",
  // "/videos/hero/clip-02.mp4",
];

export const HERO_POSTER_FALLBACK = "/images/banner-berea.png";

// ----------------------------------------------------------------------------
// Sección "Conecta con Berea" — textos propuestos por el propietario.
// ----------------------------------------------------------------------------
export interface ConnectItem {
  title: string;
  text: string;
  action: string;
  href: string;
}

export const CONNECT_ITEMS: ConnectItem[] = [
  {
    title: "¿Podemos orar por ti?",
    text: "Queremos acompañarte y poner tu petición delante de Dios.",
    action: "Enviar mi petición",
    href: "/contacto#contact-form",
  },
  {
    title: "¿Es tu primera vez?",
    text: "Conoce Centro Cristiano Berea y encuentra lo que necesitas para tu primera visita.",
    action: "Planear mi visita",
    href: "/visita",
  },
  {
    title: "Hay un lugar para ti",
    text: "Descubre cómo integrarte y servir con los dones que Dios te ha dado.",
    action: "Quiero involucrarme",
    href: "/conocenos#comunidad",
  },
];

// TODO(media): reemplazar por fotografía real de la congregación.
export const CONNECT_IMAGE = {
  src: "/images/simbolicas/comunidad.png",
  alt: "Comunidad de Centro Cristiano Berea",
};

// TODO(media): reemplazar por fotografía real de la congregación.
export const EDITORIAL_IMAGE = {
  src: "/images/banner-quienes-somos.png",
  alt: "Centro Cristiano Berea",
};

// ----------------------------------------------------------------------------
// Datos de contacto verificados en el footer actual del sitio (trabajo
// del propietario). Se usan SOLO como respaldo si la tabla `contact`
// no tiene información.
// ----------------------------------------------------------------------------
export const FALLBACK_CONTACT = {
  churchName: "Centro Cristiano Berea",
  address: "C. Tercera 109, Zona Urbana Xochimilco, Mexicali, Baja California, C.P. 21380",
  phone: "686 555 6149",
  phoneHref: "tel:+526865556149",
  email: "centrocristianobereamxli@gmail.com",
  whatsapp: "686 555 6149",
  mapUrl: "https://maps.google.com/?q=Centro+Cristiano+Berea+Mexicali",
  schedules: [
    { day: "Domingo", time: "11:00 AM a 1:00 PM" },
    { day: "Miércoles", time: "Escuela de Líderes · 8:00 PM" },
    { day: "Jueves", time: "Escuela de Ministerios · 8:00 PM" },
  ],
  scheduleNote: "Duración aproximada: 2 horas",
};

export const SOCIAL_LINKS = [
  { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/centrocristianobereamxli?locale=es_LA" },
  { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/centrocristianoberea/" },
  { platform: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@centrocristianobe" },
];

// Pastoral verificada en el footer actual del sitio (trabajo del propietario).
export const PASTORS = {
  name: "Pastores César y Claudia Villanueva",
  verse:
    "«Y todo lo que hagan, háganlo de corazón, como para el Señor y no para los hombres.» — Colosenses 3:23",
};

// ----------------------------------------------------------------------------
// /visita — texto propuesto, PENDIENTE de validación con el propietario.
// Los horarios, dirección y duración provienen de la tabla `contact`.
// ----------------------------------------------------------------------------
export const VISIT_INTRO = {
  title: "Visítanos",
  subtitle: "Nos encantaría recibirte. Esto es lo que necesitas para tu primera visita.",
  // TODO(contenido): validar estos puntos antes de publicación.
  whatToExpect: [
    "El servicio del domingo dura aproximadamente 2 horas e incluye alabanza y predicación de la Palabra.",
    "Ven tal como eres: no hay un código de vestimenta.",
    "Al llegar encontrarás personas dispuestas a recibirte y orientarte.",
  ],
};

// ----------------------------------------------------------------------------
// /conocenos — textos mínimos para secciones sin contenido en BD.
// ----------------------------------------------------------------------------
export const KNOW_INTRO = {
  title: "Conócenos",
  subtitle: "Quiénes somos, en qué creemos y cómo puedes ser parte de nuestra comunidad.",
  emptyMessage: "Próximamente compartiremos más información aquí.",
};

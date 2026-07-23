\# CHANGELOG

\# Centro Cristiano Berea Platform

Versión del Documento: 1.0

Estado: Activo

\---

\# Objetivo

Registrar cronológicamente todos los cambios importantes realizados durante el desarrollo del proyecto.

El propósito de este documento es mantener un historial claro de la evolución de la plataforma.

No sustituye al control de versiones (Git), sino que documenta cambios funcionales y arquitectónicos relevantes.

\---

\# Formato

Cada actualización utilizará el siguiente formato.

\---

\## Versión

vX.X.X

\### Fecha

AAAA-MM-DD

\### Estado

\- Desarrollo

\- Beta

\- Release Candidate

\- Producción

\### Agregado

Nuevas funcionalidades.

\### Modificado

Cambios importantes.

\### Corregido

Errores solucionados.

\### Eliminado

Funcionalidades retiradas.

\---

\# Historial

\---

\# v0.1.0

\## Fecha

2026-07

\## Estado

Desarrollo

\### Agregado

\- Inicio del proyecto.

\- Definición del alcance.

\- Documento PRD.

\- Arquitectura inicial.

\- Modelo ERD.

\- Design System.

\- Estrategia de Base de Datos.

\- Estrategia Multimedia.

\- Estrategia de Seguridad.

\- Estrategia SEO.

\- Estrategia Performance.

\- Estrategia Deployment.

\- Roadmap.

\- Features.

\- Documentación técnica completa.

\---

\# v0.2.0

\## Fecha

2026-07-20

\## Estado

Desarrollo

\### Agregado

\- Modelo de datos completo (FASE 2.1) con 26 tablas en Drizzle ORM.
\- Esquema de seguridad: users, roles, permissions, role\_permissions, audit\_logs.
\- Esquema de contenido CMS: pages, devotionals, events, ministries, service\_ministries, biblical\_programs, cells, annual\_vision, auditorium, donations, contact.
\- Esquema multimedia: media, media\_attachments, gallery.
\- Esquema SEO y navegación: seo\_metadata, redirects, navigation, navigation\_items.
\- Esquema de configuración: settings (key-value), content\_versions.
\- Relaciones ORM completas para todas las entidades.
\- 30+ índices incluyendo índices compuestos y únicos.
\- Índices Full Text Search (GIN + to\_tsvector) para pages, devotionals, events, ministries y biblical\_programs.
\- Políticas onDelete explícitas en todas las Foreign Keys (cascade, set null, restrict).
\- Soft Delete implementado en 13 entidades según ERD.

\### Corregido

\- Eliminada tabla gallery\_media en favor de media\_attachments (auditoría FASE 2.1).
\- Eliminados metaTitle y metaDescription de pages; SEO centralizado en seo\_metadata (auditoría FASE 2.1).
\- Agregada relación redirects → pages con pageId FK (auditoría FASE 2.1).
\- Documentada decisión de Settings como key-value en DECISIONS.md (DEC-016).

\### Modificado

\- Todas las Foreign Keys ahora definen onDelete explícito.

\---

\# v0.2.1

\## Fecha

2026-07-21

\## Estado

Desarrollo

\### Agregado

- Seeds iniciales (FASE 2.3): roles (5), permisos (22), role-permissions (64).
- Usuario administrador con bcrypt hash (`admin@centrocristianoberea.org`).
- Settings base: `site\_name`, `site\_description`.
- Menús de navegación: `main-menu` (10 ítems), `footer` (vacío).
- Páginas placeholder (14) — `Inicio` en `published`, resto en `draft`.
- Script `npm run db:seed` con soporte idempotente y limpieza automática de role-permissions obsoletas.
- Variables de entorno de seed en `.env.example` (`SEED\_ADMIN\_EMAIL`, `SEED\_ADMIN\_PASSWORD`, `SEED\_ADMIN\_NAME`).
- Documentados mapeos de roles en DECISIONS.md (DEC-018).

\### Modificado

- Eliminado `content.publish` del rol `Editor` — alineado con workflow editorial de `AUTHORIZATION.md`.
- `.env.example`: contraseña por defecto alineada con política de 12 caracteres mínimos.

---

\# v0.3.0

\## Fecha

2026-07-21

\## Estado

Desarrollo

\### Agregado

- Infraestructura de autenticación (FASE 3) con Auth.js v5 + Drizzle ORM + bcryptjs.
- Credentials Provider con email/password. Normalización de email y validación de estado activo.
- Estrategia JWT con `maxAge` 1 hora y `updateAge` 30 minutos (rolling sessions).
- Página de login en `/admin/login` con formulario client-side y server action.
- Middleware (proxy.ts) protegiendo rutas `/admin/:path*` con redirect a login.
- Type augmentation: `Session.user` tipado con `id`, `roleId`, `status`.
- Cookies de sesión configuradas explícitamente: httpOnly, secure (prod), sameSite=lax.
- Variables `AUTH_SECRET` y `AUTH_URL` en `.env.example` y `.env.local`.

\### Pendiente

- Rate limiting en login.
- Auditoría de eventos de autenticación (login/logout/fallos).
- Actualización de `lastLoginAt` en cada inicio de sesión.
- Recuperación de contraseña.

---

\# v0.4.0

\## Fecha

2026-07-22

\## Estado

Desarrollo

\### Agregado

- Shell CMS (FASE 4): layout administrativo con autenticación, sidebar, header, contenido y footer.
- Sidebar con navegación dinámica desde base de datos (prioriza `admin-menu`, fallback a `main-menu`).
- Toggle responsive del sidebar: drawer overlay en móvil, fijo en desktop.
- Breadcrumb entre header y contenido.
- Dashboard con información del usuario autenticado, rol (desde DB), fecha/hora y accesos rápidos.
- Componentes base reutilizables: `PageHeader`, `SectionCard`, `EmptyState`, `LoadingSpinner`, `ErrorState`.
- Manejo de errores: `loading.tsx`, `error.tsx`, `not-found.tsx` en área administrativa.
- Server action `logout()` integrada en header.

\### Pendiente

- Menú `admin-menu` sin sembrar (temporalmente usa `main-menu` como fallback).
- Breadcrumb por página (actualmente estático en layout).

---

\# Próximas Versiones

\## v0.5.0

\## Fecha

2026-07-22

\## Estado

Desarrollo

\### Agregado

- Biblioteca Multimedia (FASE 5): listado con búsqueda y paginación en `/admin/media`.
- Vista detalle de archivos multimedia en `/admin/media/[id]`.
- Componentes: `MediaCard`, `MediaGrid`, `MediaPreview`, `MediaDetails`, `MediaSearch`, `Pagination`.
- Preview por tipo: imagen, video (con `<video>` en detalle), documento.
- Soft delete (`deletedAt IS NULL`), estado vacío, loading y error boundaries.
- Utilidad compartida `formatFileSize` en `src/lib/utils.ts`.

\### Pendiente

- Upload, Cloudflare R2 / Stream, edición, eliminación, galerías, media attachments.
- RBAC y permisos específicos para media.
- Optimización automática de imágenes.

---

\## v0.6.0

\## Fecha

2026-07-22

\## Estado

Desarrollo

\### Agregado

- Upload de archivos con integraci\u00f3n Cloudflare R2 (FASE 6).
- Server action `uploadMedia` con validaciones: tama\u00f1o m\u00e1x 20 MB, MIME whitelist, nombre, autenticaci\u00f3n.
- Cliente S3 para R2 (`@aws-sdk/client-s3`) en `src/lib/storage/r2.ts`.
- Componentes UI: `UploadButton`, `UploadDropzone`, `UploadProgress`, `UploadError`, `UploadArea`.
- Detecci\u00f3n autom\u00e1tica de tipo (image/video/document) desde MIME.
- Generaci\u00f3n de keys \u00fanicas por archivo (`uploads/YYYY/MM/UUID.ext`).
- Refresh autom\u00e1tico del listado al completar una carga exitosa.
- Variables R2 en `.env.local`.

\### Pendiente

- Edici\u00f3n, reemplazo y eliminaci\u00f3n de archivos.
- Cloudflare Stream para video.
- Optimizaci\u00f3n autom\u00e1tica de im\u00e1genes (Sharp).
- Media Attachments y galer\u00edas.

---

\## v0.7.0

\## Fecha

2026-07-22

\## Estado

Desarrollo

\### Agregado

- Sitio p\u00fablico institucional multip\u00e1gina (FASE 7).
- Layout p\u00fablico (`app/(public)/layout.tsx`) con Header, Footer y Container separados del admin.
- Header institucional con navegaci\u00f3n din\u00e1mica desde DB (`main-menu`) y responsive (desktop + m\u00f3vil).
- Footer institucional con enlaces, horarios, contacto y datos desde settings/seeds.
- Paleta institucional: azul navy (#0F2747), dorado (#C9A227), blanco, gris claro.
- Componentes p\u00fablicos reutilizables: `HeroSection`, `PageBanner`, `SectionHeading`, `EmptySection`.
- P\u00e1gina de Inicio completa: Hero, bienvenida, servicios, eventos, ministerios, devocionales, CTA visitanos.
- 14 rutas p\u00fablicas: /, /quienes-somos, /historia, /nuestra-doctrina, /liderazgo, /ministerios-activos, /ministerios-de-servicio, /formacion-biblica, /celulas, /devocionales (listado + detalle), /eventos (listado + detalle), /vision-anual, /auditorio, /donaciones, /contacto.
- Cada p\u00e1gina con encabezado, contenido desde DB cuando existe, estado vac\u00edo contextual cuando no.
- SEO: metadata por ruta con t\u00edtulos y descripciones en espa\u00f1ol.
- HTML sem\u00e1ntico, jerarqu\u00eda de headings, navegaci\u00f3n accesible, responsive.

\### Pendiente

- Integraci\u00f3n Google Maps.
- Contenido real (historia, doctrina completa, fotograf\u00edas de liderazgo, datos bancarios).
- Streaming de video en Auditorio.

\---

\## v0.8.5

\## Fecha

2026-07-22

\## Estado

Desarrollo

\### Agregado

- Middleware de autenticación (`src/proxy.ts`) con protección de rutas `/admin/:path*`.
- Sistema RBAC (`src/lib/auth/rbac.ts`) con verificación de permisos en Server Actions.
- Registro de auditoría (`src/lib/audit/index.ts`) instrumentado en login, logout y subida de archivos.
- Rate limiting en login y subida de archivos (`src/lib/rate-limit.ts`).
- Headers de seguridad: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Validación de inputs con Zod en `login` y `uploadMedia`.
- Validación de archivos por extensión, tipo MIME y magic bytes.
- Índices adicionales: `media.created_at`, `annual_vision(status, year)`, `gallery(entity_type, entity_id)`, `donations.status`.
- Unique constraint en `content_versions(entity_type, entity_id, version_number)`.
- Documentación sincronizada: README, ROADMAP, CHANGELOG actualizados al estado real.

\### Modificado

- `src/lib/auth/index.ts`: audit logs en authorize, actualización de `lastLoginAt`.
- `src/lib/auth/actions.ts`: validación Zod, rate limiting, validación de callbackUrl.
- `src/lib/media/actions.ts`: RBAC + rate limiting + validación de archivos mejorada.
- `next.config.ts`: headers de seguridad, formatos de imagen.

\---

\## v0.10.0

\## Fecha

2026-07-22

\## Estado

Desarrollo

\### Agregado

- Formulario de contacto funcional en /contacto (FASE 10A).
- Validación cliente y servidor con Zod v4.
- Protección contra spam con Cloudflare Turnstile.
- Rate limiting por IP (5 solicitudes/minuto).
- Sanitización de entrada con HTML tag stripping.
- Confirmación visual inmediata tras envío exitoso.
- Email de confirmación automático al remitente (Resend).
- Email de notificación al administrador de nueva solicitud.
- Bandeja de entrada administrativa en /admin/contact.
- Vista detalle de solicitud con metadatos (IP, fecha, estado).
- Respuesta desde el panel con envío de email automático.
- Gestión de estados: pendiente, leído, respondido, archivado.
- Búsqueda y filtrado de solicitudes.
- Paginación en la bandeja de entrada.
- Infraestructura de email transaccional reutilizable (Resend + templates HTML).
- Tabla contact_submissions con índices y soft metadata.
- Tabla notifications para tracking de envíos con reintentos.
- Menú de navegación administrativa (admin-menu) con Dashboard, Contenido, Multimedia y Bandeja de Entrada.
- Permiso contact-submissions.manage asignado a Super Admin y Admin.
- CSP actualizado para permitir Cloudflare Turnstile.
- Variables de entorno para Resend y Turnstile en .env.local.

\### Modificado

- Página /contacto reemplaza placeholder con formulario funcional.
- Seed: agregado menú admin-menu con 4 items de navegación.
- Seed: agregado permiso contact-submissions.manage.
- next.config.ts: CSP actualizado para challenges.cloudflare.com.
- README.md, ROADMAP.md, DOCUMENTATION_INDEX.md sincronizados.

\---

\## v0.11.0

\## Fecha

2026-07-23

\## Estado

Completado

\### Agregado

- Registro público a eventos con control de capacidad (FASE 10B).
- Formulario modal con Turnstile, validación Zod y rate limiting para /eventos/[slug].
- Prevención de registros duplicados (UNIQUE(eventId, email) + check servidor).
- Confirmación por email al asistente y notificación al administrador.
- Panel admin de gestión de registros en /admin/registrations y /admin/events/[id]/registrations.
- Búsqueda por nombre/email, filtro por estado, paginación en listado de asistentes.
- Acciones de estado: confirmado, asistió, no asistió, cancelado, reconfirmar.
- Exportación CSV de registros vía API route.
- Permiso event-registrations.manage asignado a Super Admin y Administrator.
- Tabla event_registrations con índices y FK a events.
- Audit log en registro público y cambios de estado.
- Menú admin con ítem "Registros a Eventos".

\### Modificado

- Seed: admin-menu idempotente (agrega items sin eliminar existentes).
- Seed: agregado permiso event-registrations.manage.
- src/actions/events.ts: nuevas Server Actions para registro y gestión.
- Página /eventos/[slug]: integrado botón de registro y contador de asistentes.

\### Corregido

- Paginación de registros: totalCount ahora respeta filtros de búsqueda y estado.

\### Técnico

- Reutilización completa de infraestructura FASE 10A (email, Turnstile, rate limit, RBAC, audit).
- Server Actions en src/actions/events.ts con patrón useActionState.
- API route independiente para exportación CSV con autenticación RBAC.
- 0 errores lint, 0 errores tsc, 0 errores build.

\---

\## v1.0.0

Primera versión estable.

Publicación oficial del sitio web.

\---

\# Convenciones

\## MAJOR

Cambios incompatibles.

Ejemplo:

1.0.0 → 2.0.0

\---

\## MINOR

Nuevas funcionalidades.

Ejemplo:

1.1.0

\---

\## PATCH

Corrección de errores.

Ejemplo:

1.1.1

\---

\# Reglas

Registrar únicamente cambios relevantes.

No registrar:

\- Cambios menores de formato.

\- Correcciones ortográficas.

\- Ajustes temporales.

\- Comentarios.

\---

\# Criterios

Todo cambio que modifique:

\- Arquitectura.

\- Base de datos.

\- Seguridad.

\- Funcionalidad.

\- UX.

\- API.

\- Deployment.

Deberá registrarse aquí.

\---

\# Principio Final

El CHANGELOG representa la historia oficial de la evolución de Centro Cristiano Berea Platform.

Cada versión deberá reflejar claramente qué cambió, por qué cambió y cuál fue su impacto.

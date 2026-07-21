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

\# Próximas Versiones

\## v0.2.1

Previsto

FASE 2.3 — Seeds iniciales con roles, permisos, admin, settings, navegación y páginas.

\---

\## v0.3.0

Previsto

FASE 3 — Autenticación y Seguridad (Auth.js, Login, RBAC).

\---

\## v0.4.0

Previsto

CMS Core.

\---

\## v0.5.0

Previsto

Biblioteca Multimedia.

\---

\## v0.6.0

Previsto

Contenido institucional.

\---

\## v0.7.0

Previsto

Ministerios.

\---

\## v0.8.0

Previsto

Formación Bíblica.

\---

\## v0.9.0

Previsto

Células.

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

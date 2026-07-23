\# ROADMAP

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Activo

\---

\# Objetivo

Definir el plan oficial de desarrollo del proyecto desde la documentación inicial hasta la publicación en producción.

Cada fase deberá finalizar completamente antes de comenzar la siguiente.

No se permitirá desarrollar funcionalidades fuera del roadmap aprobado.

\---

\# Filosofía

Construir correctamente desde el principio.

La prioridad será siempre:

Arquitectura

↓

Base de Datos

↓

Backend

↓

Frontend

↓

Optimización

↓

Producción

Nunca al revés.

\---

\# Estado Actual

\## FASE 0

Documentación

Estado:

✅ Completada

Incluye:

\- PRD

\- Arquitectura

\- ERD

\- Base de Datos

\- Seguridad

\- Performance

\- Multimedia

\- SEO

\- Design System

\- Features

\- Deployment

\---

\## FASE 0.5

Fortalecimiento Arquitectónico

Estado:

✅ Completada

Incluye:

\- Optimización documental.

\- Multimedia.

\- Performance.

\- SEO.

\- Seguridad.

\- Versionado.

\- Media Relations.

\- Estrategia de Caché.

\- Observabilidad.

\---

\# FASE 1

Fundación del Proyecto

Estado:

✅ Completada

Objetivos

\- Crear proyecto Next.js.

\- Configurar TypeScript.

\- Configurar Tailwind.

\- Configurar ESLint.

\- Configurar Prettier.

\- Configurar Husky.

\- Configurar Git.

\- Configurar Variables de Entorno.

Entregable

Proyecto listo para desarrollo.

\---

\# FASE 2

Base de Datos

Estado:

✅ Completada

Objetivos

\- Neon PostgreSQL.

\- Drizzle ORM.

\- Migraciones.

\- Relaciones.

\- Índices.

\- Seeds.

Entregable

Base de datos completamente funcional.

\---

\# FASE 3

Autenticación y Seguridad

Estado:

✅ Completada

Objetivos

\- Auth.js.

\- Login.

\- Recuperación de contraseña.

\- RBAC.

\- Rate Limiting.

\- Auditoría.

Entregable

CMS protegido.

\---

\# FASE 4

CMS Core

Estado:

✅ Completada

Objetivos

\- Dashboard.

\- Navegación.

\- Layout.

\- Usuarios.

\- Roles.

\- Configuración.

Entregable

CMS operativo.

\---

\# FASE 5

Biblioteca Multimedia (Core)

Estado:

✅ Completada

Incluye:

\- Listado con búsqueda y paginación.
\- Vista detalle con preview por tipo.
\- Componentes reutilizables.
\- Soft delete, estado vacío, loading, error.

Pendiente

\- Subida de archivos.
\- Cloudflare R2 / Stream.
\- Optimización automática.
\- Edición y eliminación.
\- Galerías y Media Attachments.
\- RBAC en media.

Entregable

Biblioteca multimedia funcional (fase core).

\---

\# FASE 6

Contenido Institucional (Sitio P\u00fablico)

Estado:

✅ Completada

Incluye:

\- Layout p\u00fablico separado del admin.
\- Header con navegaci\u00f3n din\u00e1mica desde DB.
\- Footer institucional.
\- 15 rutas p\u00fablicas completas.
\- Componentes p\u00fablicos reutilizables.
\- SEO por ruta.
\- Estados vac\u00edos contextuales.

Pendiente:

\- Contenido real (fotograf\u00edas, historias, doctrina completa).
\- Formulario de contacto funcional.
\- Google Maps.

\---

\# FASE 7

Refinamiento Visual y Design System

Estado:

✅ Completada

Objetivos

\- Ministerios.

\- Ministerios de Servicio.

\- Galerías.

\- Multimedia.

Entregable

Todos los ministerios administrables.

\---

\# FASE 8

Formación Bíblica

Estado:

Pendiente

Objetivos

\- Escuela de Líderes.

\- Escuela de Ministerios.

\- Universidad Holmes.

\- Maestría.

\- Cursos.

Entregable

Toda la formación administrable.

\---

\# FASE 9

Células

Estado:

Pendiente

Objetivos

\- CRUD.

\- Mapa.

\- Filtros.

\- Ubicaciones.

Entregable

Mapa interactivo de células.

\---

\# FASE 10

Interacción Pública — Formulario de Contacto

Estado:

✅ Completada (FASE 10A)

Incluye:

\- Formulario de contacto funcional en /contacto.
\- Validación Zod, Turnstile, rate limiting, sanitización.
\- Confirmación visual y email automático al remitente.
\- Notificación al administrador por email.
\- Bandeja de entrada en /admin/contact.
\- Respuesta desde el panel administrativo.
\- Gestión de estados (pendiente/leído/respondido/archivado).
\- Infraestructura de email transaccional reutilizable.
\- Tablas: contact_submissions, notifications.
\- Menú admin con acceso a Bandeja de Entrada.
\- Permiso contact-submissions.manage.

Completado

\- Registro a eventos (FASE 10B).

Pendiente

\- Solicitudes de ministerios y células (FASE 10C).

\---

\# FASE 10B

Registro a Eventos

Estado:

Completado

Objetivos

\- Registro público a eventos con capacidad.
\- Confirmación por email.
\- Panel de gestión de registros en admin.
\- Exportación de datos.

Logros

\- Tabla event_registrations con UNIQUE(eventId, email), índices y FK a events.
\- Formulario público modal con Turnstile, validación Zod, rate limiting.
\- Control de capacidad con SUM(guests) y verificación en servidor.
\- Prevención de duplicados (UNIQUE constraint + check pre-insert).
\- Dos templates de email reutilizando infraestructura FASE 10A.
\- Panel admin con listado de eventos, búsqueda, filtros, paginación y acciones de estado.
\- Exportación CSV vía API route con autenticación RBAC.
\- Permiso event-registrations.manage asignado a Super Admin y Administrator.
\- Migración 0003_soft_otto_octavius.sql generada.
\- Audit log en cambios de estado y registro público.
\- 0 errores lint, 0 errores tsc, 0 errores build.

\---

\# FASE 10C

Solicitudes de Membresía

Estado:

Pendiente

Objetivos

\- Botón "Quiero unirme" en ministerios, células y programas.
\- Notificación al líder correspondiente.
\- Panel de gestión en admin.

\---

\# FASE 11

Eventos

Estado:

Pendiente

Objetivos

\- Agenda.

\- Calendario.

\- Eventos.

\- Invitados.

\- Multimedia.

Entregable

Agenda completa.

\---

\# FASE 12

Nuevo Auditorio

Estado:

Pendiente

Objetivos

\- Video.

\- Multimedia.

\- Actualizaciones.

Entregable

Sección del Nuevo Auditorio.

\---

\# FASE 13

Sitio Público

Estado:

Pendiente

Objetivos

\- Todas las páginas.

\- Navegación.

\- Responsive.

\- SEO.

Entregable

Sitio completamente navegable.

\---

\# FASE 14

Optimización

Estado:

Pendiente

Objetivos

\- Performance.

\- Caché.

\- Lighthouse.

\- Accesibilidad.

\- SEO Final.

Entregable

Sitio optimizado.

\---

\# FASE 15

Producción

Estado:

Pendiente

Objetivos

\- Deploy.

\- Dominio.

\- SSL.

\- Analytics.

\- Search Console.

Entregable

Producción.

\---

\# FASE 16

Donaciones

Estado:

Pendiente

Objetivos

\- Stripe.

\- Donaciones.

\- Confirmaciones.

\- Administración.

Entregable

Donaciones operativas.

\---

\# FASE 17

Boletos

Estado:

Pendiente

Objetivos

\- Stripe Checkout.

\- Compra.

\- Confirmación.

\- Historial.

Entregable

Venta de boletos.

\---

\# FASE 18

Mejoras Futuras

Estado:

Backlog

Incluye

\- App Móvil.

\- Podcast.

\- Transmisiones.

\- Área Privada.

\- Push Notifications.

\- Multiidioma.

\- Biblioteca Digital.

\- Cursos Online.

\- API Pública.

\---

\# Criterios de Finalización

Una fase únicamente podrá marcarse como terminada cuando:

\- Desarrollo completo.

\- Código revisado.

\- Documentación actualizada.

\- Auditoría aprobada.

\- Sin errores críticos.

\- Deploy validado.

\---

\# Principio Final

El roadmap representa la guía oficial del proyecto.

Toda nueva funcionalidad deberá incorporarse al roadmap antes de comenzar su desarrollo.

El crecimiento de la plataforma deberá ser ordenado, incremental y completamente documentado.

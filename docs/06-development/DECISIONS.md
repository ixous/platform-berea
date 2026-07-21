\# DECISIONS

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Activo

\---

\# Objetivo

Registrar todas las decisiones arquitectónicas importantes tomadas durante el desarrollo del proyecto.

Este documento representa la memoria técnica del proyecto.

Toda decisión que afecte la arquitectura, seguridad, rendimiento o mantenibilidad deberá registrarse aquí.

\---

\# Filosofía

No documentamos únicamente \*\*qué\*\* decidimos.

Documentamos \*\*por qué\*\* lo decidimos.

Las decisiones deberán permanecer disponibles para futuras referencias.

\---

\# Formato

Cada decisión utilizará la siguiente estructura.

\---

\## DEC-001

\### Fecha

AAAA-MM-DD

\### Estado

\- Propuesta

\- Aprobada

\- Rechazada

\- Sustituida

\### Tema

Título corto.

\### Contexto

¿Qué problema existía?

\### Decisión

¿Qué se decidió?

\### Justificación

¿Por qué?

\### Consecuencias

¿Qué beneficios y desventajas tiene?

\---

\# Historial de Decisiones

\---

\## DEC-001

\### Estado

Aprobada

\### Tema

Next.js como Framework Principal

\### Contexto

Era necesario seleccionar un framework moderno para construir la plataforma.

\### Decisión

Se utilizará Next.js App Router.

\### Justificación

\- Excelente SEO.

\- Server Components.

\- Server Actions.

\- Excelente integración con Vercel.

\- Escalable.

\- Gran comunidad.

\### Consecuencias

Toda la arquitectura girará alrededor de Next.js.

\---

\## DEC-002

\### Estado

Aprobada

\### Tema

Base de Datos

\### Decisión

Utilizar Neon PostgreSQL.

\### Justificación

\- PostgreSQL.

\- Serverless.

\- Escalable.

\- Excelente integración con Drizzle.

\---

\## DEC-003

\### Estado

Aprobada

\### Tema

ORM

\### Decisión

Utilizar Drizzle ORM.

\### Justificación

\- Tipado fuerte.

\- Excelente rendimiento.

\- SQL cercano.

\- Migraciones simples.

\---

\## DEC-004

\### Estado

Aprobada

\### Tema

Hosting

\### Decisión

Vercel.

\### Justificación

\- Despliegue sencillo.

\- Excelente integración con Next.js.

\- Edge Functions.

\- Analytics.

\---

\## DEC-005

\### Estado

Aprobada

\### Tema

Autenticación

\### Decisión

Auth.js.

\---

\## DEC-006

\### Estado

Aprobada

\### Tema

Arquitectura Multimedia

\### Decisión

Biblioteca Multimedia centralizada.

Los módulos nunca almacenarán imágenes directamente.

Se utilizará Media + Media Attachments.

\---

\## DEC-007

\### Estado

Aprobada

\### Tema

Versionado

\### Decisión

Todo contenido importante tendrá historial de versiones.

\---

\## DEC-008

\### Estado

Aprobada

\### Tema

Soft Delete

\### Decisión

Toda eliminación será lógica.

Nunca eliminar registros inmediatamente.

\---

\## DEC-009

\### Estado

Aprobada

\### Tema

CMS

\### Decisión

\## Arquitectura del CMS

El CMS será un módulo administrativo protegido dentro de la misma aplicación Next.js.

Compartirá la misma base de código, infraestructura y base de datos que el sitio público, manteniendo una separación lógica mediante autenticación, autorización (RBAC) y rutas protegidas.

Esta arquitectura simplifica el mantenimiento, reduce la complejidad operativa y facilita la evolución futura de la plataforma.

El sitio únicamente consumirá contenido publicado.

\---

\## DEC-010

\### Estado

Aprobada

\### Tema

Seguridad

\### Decisión

Toda autorización utilizará RBAC.

Nunca validar permisos únicamente desde el Frontend.

\---

\## DEC-011

\### Estado

Aprobada

\### Tema

Optimización Multimedia

\### Decisión

Todas las imágenes se convertirán automáticamente a formatos modernos.

Las imágenes originales nunca serán servidas al visitante.

\---

\## DEC-012

\### Estado

Aprobada

\### Tema

SEO

\### Decisión

Toda página pública generará automáticamente:

\- Metadata.

\- Open Graph.

\- Structured Data.

\- Sitemap.

\---

\## DEC-013

\### Estado

Aprobada

\### Tema

Documentación

\### Decisión

Toda nueva funcionalidad deberá documentarse antes de comenzar su desarrollo.

La documentación será parte del producto.

\---

\## DEC-014

\### Estado

Aprobada

\### Tema

Principio de Desarrollo

\### Decisión

Arquitectura primero.

Código después.

Nunca desarrollar funcionalidades sin una arquitectura previamente definida.

\---

\## DEC-016

\### Fecha

2026-07-20

\### Estado

Aprobada

\### Tema

Modelo de Settings como Key-Value

\### Contexto

El ERD describe Settings como "un único registro activo". Durante la implementación de la FASE 2.1 se evaluó si modelarlo como tabla de registro único con columnas fijas o como tabla key-value con múltiples filas.

\### Decisión

Se implementa Settings como tabla key-value (`key` unique, `value` jsonb). Cada clave de configuración es una fila independiente con su propio `id`, `created_at`, `updated_at` y `deleted_at`.

\### Justificación

\- Extensibilidad: agregar nuevas configuraciones no requiere cambios de schema.
\- Versionado compatible: `content_versions` puede versionar cada clave individualmente.
\- CMS intuitivo: cada setting puede tener su propio formulario y validación.
\- Soft Delete por clave: permite desactivar configuraciones específicas sin afectar otras.
\- PostgreSQL jsonb permite almacenar valores complejos (objetos, arrays, strings).

\### Consecuencias

\- Cada configuración se versiona de forma independiente.
\- El concepto "único registro activo" se interpreta como "conjunto activo de claves", no como un registro físico.
\- Las claves deben mantenerse únicas y documentadas como parte del contrato de la API de Settings.

\---

\## DEC-017

\### Fecha

2026-07-20

\### Estado

Aprobada

\### Tema

Política de SQL Custom en Migraciones Drizzle

\### Contexto

Drizzle Kit genera migraciones automáticamente a partir de definiciones `pgTable`. Sin embargo, ciertas características de PostgreSQL como índices GIN, índices parciales, extensiones (pg_trgm, postgis) o triggers no pueden declararse mediante la API nativa de Drizzle. Durante la FASE 2.2 se requirió agregar 5 índices Full Text Search (GIN + to\_tsvector) que Drizzle no pudo incluir en la migración generada.

\### Decisión

Se establece la siguiente política para SQL custom dentro de migraciones:

1\. **Todo lo que Drizzle pueda generar nativamente, debe usar la API de Drizzle.** Esto incluye: tablas, columnas, constraints, foreign keys, índices btree/unique, defaults y composite keys.

2\. **SQL custom solo se permite cuando Drizzle no ofrece una API equivalente.** Ejemplos: índices GIN, índices parciales con WHERE, triggers, extensiones PostgreSQL.

3\. **El SQL custom se escribe directamente en el archivo de migración** generado por `drizzle-kit generate`, después de las sentencias generadas automáticamente y manteniendo el formato `--> statement-breakpoint`.

4\. **Se mantiene un archivo de referencia** (`custom-indexes.ts` dentro del schema) que documenta cada sentencia SQL custom, pero **no se exporta desde el barrel index.ts del schema** para evitar confusión. Drizzle Kit no procesa estos exports.

5\. **El snapshot de Drizzle** (`drizzle/meta/*_snapshot.json`) no incluirá estos índices custom. Esto es aceptable siempre que la migración sea la fuente de verdad para recrear la base de datos.

6\. **Al regenerar migraciones desde cero**, el SQL custom deberá copiarse manualmente desde el archivo de referencia hacia la nueva migración.

7\. **Nunca** modificar una migración ya aplicada en producción. Los cambios deben ir en nuevas migraciones.

\### Justificación

\- Drizzle v0.45.2 no soporta la creación de índices GIN mediante su API declarativa.
\- Mantener el SQL custom dentro de las migraciones (no en el schema) evita falsas expectativas sobre la capacidad de Drizzle de gestionarlos.
\- El archivo de referencia documental asegura que el conocimiento no se pierda.
\- Esta política es compatible con el flujo de trabajo estándar de Drizzle (`generate → revisar → migrar`).

\### Consecuencias

\- Los índices GIN deben mantenerse manualmente si cambian las columnas indexadas.
\- Las migraciones son la única fuente de verdad para recrear la base de datos.
\- El archivo `custom-indexes.ts` es solo documental; nunca debe exportarse desde el barrel del schema.
\- Futuros índices avanzados (partial, BRIN, extensiones) seguirán esta misma política.
\- No hay drift entre schema y base de datos porque la migración es atómica y se aplica completa.

\---

\# Futuras Decisiones

Las siguientes decisiones permanecen pendientes.

\- Proveedor definitivo de video.

\- Integración con Stripe.

\- Servicio SMTP.

\- Servicio de notificaciones.

\- Estrategia de Backups automáticos.

\- Estrategia de búsqueda avanzada.

\- Integración futura con App móvil.

\---

\# Principio Final

Cada decisión tomada deberá facilitar el mantenimiento, la escalabilidad y la evolución de Centro Cristiano Berea Platform durante los próximos años.

La arquitectura deberá evolucionar mediante decisiones documentadas y nunca mediante cambios improvisados.

\---

\## DEC-015

\### Estado

Aprobada

\### Tema

Proveedor de Almacenamiento Multimedia

\### Contexto

La plataforma requiere una solución moderna para almacenar imágenes, documentos y distribuir videos de forma eficiente.

\### Decisión

Se utilizará la siguiente infraestructura:

\- Cloudflare R2 para almacenamiento de imágenes y documentos.

\- Cloudflare Stream para procesamiento y distribución de video.

\### Justificación

\- Excelente integración entre ambos servicios.

\- Streaming adaptativo.

\- Alto rendimiento.

\- Escalabilidad.

\- Reducción del consumo de ancho de banda.

\- Excelente integración con Vercel.

\### Consecuencias

Toda la estrategia multimedia del proyecto estará basada en el ecosistema de Cloudflare.

Las futuras funcionalidades relacionadas con contenido multimedia deberán respetar esta decisión arquitectónica.

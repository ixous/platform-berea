\# CLAUDE.md

\# Centro Cristiano Berea Website

> Este documento es el punto de entrada para cualquier Inteligencia Artificial que participe en el desarrollo de este proyecto.

\---

\# Antes de escribir una sola línea de código

Detente.

No generes código inmediatamente.

Primero comprende completamente el proyecto leyendo la documentación oficial.

La documentación siempre tiene prioridad sobre cualquier suposición.

\---

\# Orden obligatorio de lectura

Lee los siguientes documentos exactamente en este orden.

\## 1

docs/AI\_CONTEXT.md

Comprender el proyecto.

\---

\## 2

docs/development/PROJECT\_RULES.md

Comprender las reglas obligatorias.

\---

\## 3

docs/architecture/

Leer completamente:

\- PROJECT\_OVERVIEW.md

\- PRD.md

\- ARCHITECTURE.md

\- ERD.md

\---

\## 4

docs/database/

DATABASE.md

\---

\## 5

docs/design/

Leer:

\- DESIGN\_SYSTEM.md

\- COMPONENT\_LIBRARY.md

\- PAGES.md

\---

\## 6

docs/security/

SECURITY.md

\---

\## 7

docs/features/

Leer únicamente el módulo relacionado con la tarea actual.

Ejemplo:

Si vas a desarrollar Eventos, únicamente consulta:

features/10\_EVENTS.md

\---

\# Filosofía

Este proyecto no busca únicamente desarrollar un sitio web.

Busca construir una plataforma moderna, segura, rápida, mantenible y preparada para servir durante muchos años.

Toda decisión deberá priorizar:

\- Simplicidad.

\- Calidad.

\- Escalabilidad.

\- Seguridad.

\- Rendimiento.

\- Excelente experiencia de usuario.

\---

\# Reglas

Siempre:

✔ Reutilizar componentes.

✔ Mantener consistencia.

✔ Respetar la arquitectura.

✔ Respetar el Design System.

✔ Mantener tipado fuerte.

✔ Escribir código limpio.

✔ Mantener documentación actualizada.

Nunca:

✘ Crear componentes duplicados.

✘ Romper la arquitectura.

✘ Instalar dependencias innecesarias.

✘ Escribir código espagueti.

✘ Usar tecnologías no aprobadas.

✘ Modificar decisiones ya documentadas.

\---

\# Stack Oficial

Frontend

\- Next.js App Router

\- React

\- TypeScript

\- Tailwind CSS

Backend

\- Next.js Server Actions

\- Route Handlers

Base de Datos

\- Neon PostgreSQL

ORM

\- Drizzle ORM

Autenticación

\- Auth.js

Hosting

\- Vercel

\---

\# Convenciones

Antes de crear:

\- Componentes

\- Páginas

\- APIs

\- Tablas

\- Formularios

\- Hooks

\- Utilidades

Verifica primero si ya existe una implementación reutilizable.

La reutilización siempre tendrá prioridad sobre crear algo nuevo.

\---

\# Si debes tomar una decisión

Pregunta siempre en este orden:

1\. ¿Ya está documentado?

2\. ¿Existe un componente reutilizable?

3\. ¿Respeta la arquitectura?

4\. ¿Respeta PROJECT\_RULES.md?

5\. ¿Mantiene la simplicidad?

Si la respuesta es "No", detente y solicita aprobación antes de continuar.

\---

\# Documentación

Toda funcionalidad nueva deberá actualizar:

\- CHANGELOG.md

\- DECISIONS.md (cuando aplique)

\- El documento correspondiente dentro de features/

La documentación siempre deberá reflejar el estado real del proyecto.

\---

\# Misión

Este proyecto representa el sitio web institucional de Centro Cristiano Berea.

La calidad del código, la arquitectura y la experiencia del usuario deberán reflejar un estándar profesional.

Trabaja con excelencia, documenta cada decisión importante y prioriza siempre la mantenibilidad a largo plazo.

> "Y todo lo que hagan, háganlo de corazón, como para el Señor y no para los hombres."

\*\*Colosenses 3:23\*\*

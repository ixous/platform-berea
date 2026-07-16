\# 02 - SOFTWARE ARCHITECTURE

\# Centro Cristiano Berea Website

Versión: 1.0

Estado: Planeación

\---

\# Objetivo

Definir la arquitectura general del proyecto para garantizar un desarrollo ordenado, escalable, seguro y fácil de mantener.

La arquitectura deberá permitir agregar nuevas funcionalidades en el futuro sin afectar el funcionamiento existente.

\---

\# Filosofía de Arquitectura

Toda decisión técnica deberá cumplir con los siguientes principios:

\- Simplicidad.

\- Escalabilidad.

\- Bajo acoplamiento.

\- Alta cohesión.

\- Código reutilizable.

\- Seguridad por defecto.

\- Alto rendimiento.

\- Excelente experiencia de usuario.

\- Fácil mantenimiento.

\---

\# Arquitectura General

El proyecto estará dividido en capas claramente definidas.

Frontend

↓

Backend

↓

Base de Datos

↓

Almacenamiento Multimedia

↓

Servicios Externos

Cada capa deberá ser independiente de las demás para facilitar futuras modificaciones.

\---

\# Frontend

Responsable de mostrar la interfaz del usuario.

Funciones:

\- Renderizar páginas.

\- Mostrar contenido.

\- Navegación.

\- Formularios.

\- Panel Administrativo.

\- Consumo de APIs.

No deberá contener lógica de negocio.

\---

\---

\# Service Layer \& Repository Pattern

\## Objetivo

Desacoplar la lógica de negocio del acceso a datos para mantener una arquitectura limpia, escalable y fácil de mantener.

La aplicación seguirá la siguiente estructura:

Presentation Layer

↓

Server Actions

↓

Application Services

↓

Repositories

↓

Drizzle ORM

↓

Neon PostgreSQL

\---

\## Responsabilidades

\### Presentation Layer

\- Componentes React.

\- Server Components.

\- Client Components.

\- Formularios.

\- Navegación.

No contendrá lógica de negocio.

\---

\### Server Actions

Reciben la solicitud del usuario.

Validan permisos.

Validan entrada.

Delegan la lógica al Service correspondiente.

\---

\### Application Services

Contienen toda la lógica de negocio.

Ejemplos:

\- Crear Evento.

\- Publicar Devocional.

\- Actualizar Ministerio.

\- Registrar Donación.

No accederán directamente a la base de datos.

\---

\### Repositories

Única capa autorizada para comunicarse con Drizzle ORM.

Responsabilidades:

\- Consultas.

\- Inserciones.

\- Actualizaciones.

\- Eliminaciones lógicas.

No contendrán lógica de negocio.

\---

\### Drizzle ORM

Responsable únicamente del acceso a la base de datos.

\---

\## Beneficios

\- Bajo acoplamiento.

\- Mayor mantenibilidad.

\- Código reutilizable.

\- Mejor capacidad de pruebas.

\- Preparado para futuras APIs y aplicación móvil.

\---

\## Principio

Ningún componente React ni Server Action accederá directamente a Drizzle ORM.

Toda interacción con la base de datos deberá realizarse mediante la capa Repository.

\---

\# Backend

Responsable de:

\- Procesar información.

\- Validaciones.

\- Seguridad.

\- Autenticación.

\- Autorización.

\- Reglas del negocio.

\- Administración del CMS.

Todo acceso a la base de datos deberá pasar por esta capa.

\---

\# Base de Datos

La base de datos almacenará únicamente información estructurada.

Ejemplos:

Usuarios

Roles

Ministerios

Eventos

Devocionales

Células

Información institucional

Videos

Imágenes

Configuraciones

Nunca almacenará archivos multimedia directamente.

\---

\# Almacenamiento Multimedia

Las imágenes y videos deberán almacenarse en un servicio especializado.

La base de datos únicamente almacenará referencias a dichos archivos.

Todo el contenido multimedia deberá optimizarse automáticamente antes de mostrarse al visitante.

\---

\# Panel Administrativo

\## Arquitectura del CMS

El CMS será un módulo administrativo protegido dentro de la misma aplicación Next.js.

Compartirá la misma base de código, infraestructura y base de datos que el sitio público, manteniendo una separación lógica mediante autenticación, autorización (RBAC) y rutas protegidas.

Esta arquitectura simplifica el mantenimiento, reduce la complejidad operativa y facilita la evolución futura de la plataforma.

\---

\# Roles y Permisos

Toda acción deberá validarse mediante permisos.

Cada usuario únicamente podrá acceder a los módulos autorizados.

\---

\# Seguridad

La seguridad será un requisito obligatorio desde el inicio.

Toda la información sensible deberá protegerse adecuadamente.

No deberán existir accesos directos a información crítica.

Toda entrada del usuario deberá validarse.

\---

\# Optimización

El sitio deberá priorizar:

Carga rápida.

Optimización automática de imágenes.

Optimización de videos.

Carga diferida.

Excelente rendimiento en dispositivos móviles.

\---

\# SEO

Toda página deberá construirse pensando en posicionamiento orgánico.

Cada sección deberá poder administrar:

Título.

Descripción.

Imagen.

URL.

Metadatos.

\---

\# Accesibilidad

El sitio deberá ser accesible para la mayor cantidad posible de personas.

Se priorizará:

Navegación clara.

Buen contraste.

Compatibilidad móvil.

Diseño responsive.

\---

\# Escalabilidad

La arquitectura deberá permitir agregar nuevos módulos sin modificar la estructura existente.

Todo nuevo módulo deberá seguir la misma arquitectura del proyecto.

\---

\# Mantenibilidad

Todo componente deberá ser reutilizable.

No se permitirá duplicar lógica innecesariamente.

Cada módulo deberá tener una única responsabilidad.

\---

\# Registro de Cambios

Las acciones importantes realizadas desde el Panel Administrativo deberán poder registrarse para facilitar auditorías futuras.

\---

\# Futuras Integraciones

La arquitectura deberá permitir integrar en el futuro:

Stripe.

Streaming.

Aplicación móvil.

Notificaciones.

Correo electrónico.

Integraciones externas.

Sin necesidad de reconstruir el sistema.

\---

\# Principio General

La arquitectura deberá priorizar siempre la estabilidad, la simplicidad y la facilidad de mantenimiento sobre soluciones complejas o innecesarias.

Todo desarrollo futuro deberá respetar esta arquitectura.

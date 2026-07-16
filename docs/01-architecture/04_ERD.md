# 04 - ENTITY RELATIONSHIP DESIGN (ERD)

# Centro Cristiano Berea Website

Versión: 1.1

Estado: Planeación

---

# Objetivo

Definir las entidades principales del sistema y las relaciones existentes entre ellas antes del desarrollo de la base de datos.

Este documento servirá como referencia para la construcción del esquema de base de datos y garantizará una arquitectura limpia, escalable y consistente.

---

# Entidades Principales

## Seguridad

### Users

Representa los usuarios con acceso al Panel Administrativo.

Relaciones:

- pertenece a un Rol
- puede crear contenido
- puede administrar contenido
- puede realizar acciones registradas en Auditoría

---

### Roles

Define el conjunto de permisos disponibles para cada usuario.

Ejemplos:

- Administrador General
- Pastor
- Liderazgo
- Multimedia
- Editor

Un Rol puede pertenecer a muchos usuarios.

---

### Permissions

Listado de permisos del sistema.

Ejemplos:

- Crear
- Editar
- Eliminar
- Publicar
- Administrar Usuarios
- Administrar Configuración

Los permisos podrán asignarse a uno o varios Roles.

---

### Audit Logs

Registro de acciones administrativas.

Ejemplos:

- Crear
- Editar
- Eliminar
- Publicar
- Iniciar sesión
- Cerrar sesión
- Cambio de configuración

---

## Contenido CMS

### Pages

Información institucional.

Ejemplos:

- Inicio
- Quiénes Somos
- Historia
- Doctrina
- Contacto

Cada página podrá contener múltiples recursos multimedia.

---

### Devotionals

Devocionales.

Relaciones:

- pertenece a un Usuario
- puede tener Imagen Principal
- puede tener Galería

---

### Events

Eventos.

Cada evento podrá contener:

- Imagen Principal
- Galería
- Ubicación
- Fecha
- Hora
- Descripción
- Tipo
- Estado

---

### Ministries

Ministerios Activos.

Relaciones:

- Responsable
- Horarios
- Galería
- Estado

---

### Service Ministries

Ministerios de Servicio.

Su estructura será idéntica a Ministerios Activos.

---

### Biblical Programs

Programas de Formación.

Ejemplos:

- Escuela de Líderes
- Escuela de Ministerios
- Universidad de Teología Holmes
- Maestría

---

### Cells

Células.

Cada célula podrá contener:

- Líder
- Horario
- Dirección
- Ubicación
- Contacto
- Descripción

---

### Annual Vision

Una única visión vigente por año.

Podrá contener:

- Imagen
- Versículo
- Descripción

---

### Auditorium

Representa el módulo del Nuevo Auditorio.

Inicialmente existirá un único video activo.

---

### Donations

Información relacionada con las donaciones.

Preparada para Stripe en futuras fases.

---

### Contact

Información institucional de contacto.

---

## Multimedia

### Media

Repositorio centralizado de recursos.

Tipos:

- Imagen
- Video
- Documento
- Miniatura

Todos los módulos reutilizarán esta entidad.

---

### Media Attachments

Relaciona cualquier recurso multimedia con cualquier módulo.

Cada relación almacenará:

- Entidad
- Entity ID
- Tipo de Relación
- Orden
- Estado

Ejemplos:

- Evento → Imagen Principal
- Ministerio → Galería
- Página → Banner
- Devocional → Imagen Destacada
- Auditorio → Video Principal

---

### Gallery

Galerías reutilizables.

Podrán pertenecer a:

- Eventos
- Ministerios
- Formación
- Auditorio
- Otros

---

## SEO y Navegación

### SEO Metadata

Centraliza toda la información SEO.

Permitirá administrar:

- Meta Title
- Meta Description
- Canonical
- Open Graph
- Twitter Cards
- Robots
- Imagen Social

---

### Redirects

Administración de redirecciones.

Tipos:

- 301
- 302

---

### Navigation

Representa cada menú administrable.

Ejemplos:

- Menú Principal
- Footer
- Enlaces Rápidos
- Redes Sociales

---

### Navigation Items

Representa cada elemento del menú.

Cada elemento podrá contener:

- Título
- URL
- Orden
- Icono
- Padre
- Estado
- Tipo de enlace

---

## Configuración

### Settings

Configuración global del sistema.

Ejemplos:

- Branding
- Redes Sociales
- Contacto
- Donaciones
- SEO
- Analytics
- Configuración CMS

Existirá un único registro activo.

---

## Versionado

### Content Versions

Historial completo de cambios.

Será utilizado por:

- Pages
- Devotionals
- Events
- Ministries
- Biblical Programs
- Settings

Nunca se sobrescribirá información existente.

---

# Relaciones Generales

## Seguridad

Users

↓

Roles

↓

Permissions

---

Users

↓

Audit Logs

---

Users

↓

Devotionals

---

Users

↓

Events

---

## Contenido

Pages

↓

Content Versions

---

Devotionals

↓

Content Versions

---

Events

↓

Content Versions

---

Ministries

↓

Content Versions

---

Biblical Programs

↓

Content Versions

---

Settings

↓

Content Versions

---

## Multimedia

Media

↓

Media Attachments

↓

Pages

Ministries

Service Ministries

Biblical Programs

Devotionals

Events

Annual Vision

Auditorium

---

Gallery

↓

Media Attachments

---

## SEO

SEO Metadata

↓

Pages

Events

Devotionals

Ministries

Biblical Programs

---

Redirects

↓

Pages

---

## Navegación

Navigation

↓

Navigation Items

---

# Cardinalidad

Un Rol

→ muchos Usuarios

---

Un Usuario

→ muchos Devocionales

---

Un Usuario

→ muchos Eventos

---

Una Página

→ muchas Versiones

---

Un Evento

→ muchas Versiones

---

Un Devocional

→ muchas Versiones

---

Un Ministerio

→ muchas Versiones

---

Un Archivo Multimedia

→ muchas Relaciones Multimedia

---

Una Entidad

→ muchas Relaciones Multimedia

---

Una Galería

→ muchos Recursos Multimedia

---

Un Menú

→ muchos Elementos

---

Una Entidad

→ un Registro SEO

---

Una Página

→ muchas Redirecciones

---

# Soft Delete

Las siguientes entidades utilizarán eliminación lógica:

- Users
- Ministries
- Service Ministries
- Biblical Programs
- Cells
- Events
- Devotionals
- Gallery
- Media
- Navigation
- Navigation Items
- Redirects
- Settings

Audit Logs y Content Versions conservarán el historial completo y no utilizarán eliminación lógica.

---

# Futuras Relaciones

La arquitectura permitirá incorporar posteriormente:

- Miembros
- Peticiones de Oración
- Streaming
- Inscripciones
- Boletines
- Aplicación Móvil
- Podcast
- Cursos Online

Sin modificar el modelo principal.

---

# Principio General

Todas las nuevas entidades deberán integrarse respetando la arquitectura existente.

No se permitirá duplicar información ni crear relaciones innecesarias.

El modelo deberá mantenerse limpio, normalizado y preparado para el crecimiento futuro del proyecto.

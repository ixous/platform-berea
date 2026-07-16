\# 03 - DATABASE DESIGN

\# Centro Cristiano Berea Website

Versión: 1.0

Estado: Planeación

\---

Alcance del documento

Este documento describe el modelo conceptual de la base de datos de Centro Cristiano Berea Platform.

No pretende reemplazar el esquema ejecutable (schema.ts) de Drizzle ORM.

Los tipos de datos, constraints, índices y migraciones serán implementados durante la fase de desarrollo siguiendo este modelo conceptual.

\# Objetivo

Definir la estructura de la base de datos del proyecto.

El diseño deberá ser escalable, normalizado y preparado para futuras funcionalidades sin requerir cambios estructurales importantes.

La base de datos será el núcleo del CMS y almacenará toda la información del sitio.

\---

\# Principios

La base de datos deberá cumplir con:

\- Escalabilidad.

\- Integridad.

\- Bajo acoplamiento.

\- Alto rendimiento.

\- Fácil mantenimiento.

\- Seguridad.

\- Consistencia.

\---

\# Convenciones

Todas las tablas deberán utilizar:

\- ID único.

\- created\_at

\- updated\_at

\- deleted\_at (Soft Delete cuando aplique)

Todas las relaciones deberán utilizar claves foráneas.

No deberá duplicarse información.

\---

\# Entidades Principales

\## Users

Usuarios del Panel Administrativo.

Campos principales:

\- Nombre

\- Correo electrónico

\- Contraseña cifrada

\- Estado

\- Último acceso

Relaciones:

\- Un usuario pertenece a un Rol.

\---

\## Roles

Administración de permisos.

Ejemplos:

\- Administrador General

\- Pastor

\- Liderazgo

\- Multimedia

\- Editor

Un rol podrá tener múltiples permisos.

\---

\## Permissions

Lista de permisos del sistema.

Ejemplos:

Crear eventos.

Editar ministerios.

Eliminar devocionales.

Administrar usuarios.

\---

\## Settings

Configuraciones generales del sitio.

Ejemplos:

Nombre del sitio.

Descripción.

Logo.

Redes sociales.

Información de contacto.

SEO global.

\---

\## Pages

Páginas institucionales.

Ejemplos:

Inicio.

Quiénes Somos.

Historia.

Doctrina.

Contacto.

Cada página podrá administrarse desde el CMS.

\---

\## Ministries

Ministerios Activos.

Campos:

Nombre.

Descripción.

Imagen.

Responsable.

Horarios.

Estado.

Orden de visualización.

\---

\## Service Ministries

Ministerios de Servicio.

Misma estructura que Ministerios Activos.

No existe límite de registros.

\---

\## Biblical Programs

Programas de formación.

Ejemplos:

Escuela de Líderes.

Escuela de Ministerios.

Universidad de Teología Holmes.

Maestría.

Cada programa podrá administrarse completamente.

\---

\## Cells

Células.

Campos:

Nombre.

Tipo.

Líder.

Horario.

Dirección.

Ubicación.

Descripción.

Estado.

\---

\## Devotionals

Devocionales.

Campos:

Título.

Autor.

Versículo.

Contenido.

Imagen.

Estado.

Fecha de publicación.

\---

\## Events

Eventos.

Campos:

Título.

Descripción.

Fecha.

Hora.

Ubicación.

Imagen principal.

Estado.

Tipo de evento.

Información adicional.

\---

\## Annual Vision

Visión anual.

Campos:

Nombre.

Versículo.

Descripción.

Imagen.

Año.

\---

\## Auditorium

Nuevo Auditorio Berea.

Campos:

Título.

Descripción.

Video.

Miniatura.

Estado.

\---

\## Donations

Información sobre donaciones.

Campos:

Título.

Descripción.

Información bancaria.

Estado.

\---

\## Contact

Información de contacto.

Campos:

Dirección.

Teléfono.

Correo.

WhatsApp.

Mapa.

Horarios.

Redes sociales.

\---

\## Gallery

Galería multimedia.

Permitirá almacenar:

Fotografías.

Videos.

Categorías.

Descripción.

Fecha.

\---

\## Media

Repositorio multimedia.

Permitirá almacenar referencias de:

Imágenes.

Videos.

Documentos.

Miniaturas.

No almacenará archivos físicos.

\---

\# Relaciones Generales

Users

↓

Roles

↓

Permissions

\---

Pages

↓

Media

\---

Events

↓

Media

\---

Devotionals

↓

Media

\---

Ministries

↓

Media

\---

Gallery

↓

Media

\---

\# Soft Delete

Las siguientes entidades deberán soportar eliminación lógica:

Ministerios.

Eventos.

Devocionales.

Programas.

Galerías.

Usuarios.

Nunca deberán eliminarse físicamente de forma inmediata.

\---

\# Auditoría

Las acciones importantes deberán registrarse.

Ejemplos:

Crear.

Editar.

Eliminar.

Publicar.

Ocultar.

Restaurar.

\---

\# Optimización

La base de datos deberá diseñarse pensando en:

Consultas rápidas.

Índices adecuados.

Relaciones eficientes.

Mínima duplicidad.

\---

\# Futuras Entidades

La arquitectura permitirá agregar posteriormente:

Miembros.

Peticiones de oración.

Streaming.

Inscripciones.

Boletines.

Aplicación móvil.

Sin modificar las tablas existentes.

\---

\# Regla General

Toda nueva entidad deberá seguir las mismas convenciones del proyecto.

No deberán crearse tablas redundantes ni duplicar información ya existente.

La base de datos deberá mantenerse limpia, organizada y preparada para crecer junto con Centro Cristiano Berea durante muchos años.

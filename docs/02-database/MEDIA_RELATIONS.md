\# MEDIA RELATIONS

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la arquitectura oficial para relacionar recursos multimedia con cualquier entidad del sistema mediante un modelo desacoplado, reutilizable y escalable.

Esta estrategia evitará duplicación de imágenes, simplificará el mantenimiento y permitirá reutilizar un mismo recurso multimedia en múltiples módulos del CMS.

\---

\# Filosofía

Los archivos multimedia no pertenecen a una entidad específica.

Los archivos existen de manera independiente.

Las entidades únicamente crean relaciones hacia ellos.

Nunca deberán existir columnas como:

event.image

ministry.image

leader.image

devotional.image

banner.image

En su lugar existirá una única Biblioteca Multimedia centralizada.

\---

\# Arquitectura

Media

↓

Media Attachments

↓

Entidad

Esto permitirá que un mismo recurso pueda utilizarse múltiples veces.

\---

\# Entidad Media

La entidad Media representa el recurso físico.

Ejemplo:

\- Imagen

\- Video

\- Documento

\- Logo

\- Banner

Media únicamente almacena información del archivo.

Nunca conoce quién lo utiliza.

\---

\# Media Attachments

La entidad Media Attachments será responsable de relacionar cualquier recurso multimedia con cualquier contenido del sistema.

Cada registro representará una relación.

Ejemplo:

Media

↓

Devocional

Otro registro

↓

Evento

Otro registro

↓

Ministerio

\---

\# Ventajas

\- No duplicar imágenes.

\- Reutilización.

\- Mayor orden.

\- Menor almacenamiento.

\- Relaciones flexibles.

\- Eliminación segura.

\- Escalabilidad.

\---

\# Entidades Compatibles

Media podrá relacionarse con:

\- Inicio

\- Banners

\- Liderazgo

\- Ministerios

\- Ministerios de Servicio

\- Devocionales

\- Eventos

\- Formación Bíblica

\- Células

\- Visión Anual

\- Nuevo Auditorio

\- Contacto

\- Branding

\- Configuración

\- Donaciones

\- Páginas futuras

Sin modificar la arquitectura.

\---

\# Tipos de Relación

Cada relación deberá indicar su propósito.

Ejemplos:

Principal

Galería

Miniatura

Banner

Logo

Documento

Video

Adjunto

\---

\# Orden

Cada relación tendrá un campo Order.

Permitirá ordenar:

Galerías.

Carruseles.

Banners.

Fotos.

\---

\# Estado

Cada relación podrá encontrarse en:

\- Activa.

\- Oculta.

\- Archivada.

\---

\# Eliminación

Eliminar una relación nunca eliminará el archivo.

Primero deberá verificarse si el recurso sigue siendo utilizado por otra entidad.

\---

\# Reutilización

Desde cualquier módulo el usuario podrá:

Seleccionar

↓

Biblioteca Multimedia

↓

Elegir archivo existente

↓

Relacionar

Sin volver a subirlo.

\---

\# Reemplazo

Cuando un archivo sea reemplazado:

No modificar relaciones.

Simplemente cambiar el recurso asociado.

\---

\# Biblioteca Multimedia

Permitirá:

Buscar.

Filtrar.

Reutilizar.

Archivar.

Eliminar.

Consultar uso.

\---

\# Detección de Uso

Cada recurso podrá indicar:

\- Número de relaciones.

\- Entidades donde aparece.

\- Fecha de último uso.

\---

\# Archivos Huérfanos

El sistema deberá detectar archivos sin relaciones activas.

Podrán:

\- Archivarse.

\- Eliminarse posteriormente.

Nunca automáticamente.

\---

\# Auditoría

Registrar:

\- Nueva relación.

\- Eliminación.

\- Reemplazo.

\- Cambio de orden.

\- Cambio de tipo.

\---

\# Restricciones

No permitir:

Duplicar imágenes innecesariamente.

Eliminar recursos utilizados.

Relaciones inválidas.

Archivos inexistentes.

\---

\# Beneficios

\- Arquitectura desacoplada.

\- CMS profesional.

\- Menor almacenamiento.

\- Mayor flexibilidad.

\- Reutilización.

\- Escalabilidad.

\---

\# Criterios de Aceptación

La estrategia será considerada correcta cuando:

\- Un recurso pueda utilizarse en múltiples módulos.

\- No existan columnas específicas de imagen dentro de otras entidades.

\- La eliminación sea segura.

\- Exista trazabilidad del uso de cada archivo.

\- El CMS permita reutilizar contenido multimedia.

\---

\# Principio Final

Los archivos multimedia serán ciudadanos de primera clase dentro de la plataforma.

Las entidades no poseerán archivos.

Únicamente mantendrán relaciones hacia ellos mediante una arquitectura reutilizable y completamente desacoplada.

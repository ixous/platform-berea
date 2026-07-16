\# STRUCTURED DATA

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial para implementar datos estructurados (Schema.org) en todo el sitio web.

El propósito es mejorar la comprensión del contenido por parte de los motores de búsqueda y habilitar Rich Results en Google y otros buscadores.

\---

\# Filosofía

Toda página pública deberá describir su contenido no únicamente para las personas, sino también para los motores de búsqueda.

Los datos estructurados deberán generarse automáticamente.

Nunca deberán escribirse manualmente página por página.

\---

\# Estándar

Toda la implementación utilizará:

JSON-LD

No utilizar Microdata.

No utilizar RDFa.

\---

\# Organización

Todo el sitio deberá incluir información estructurada de la organización.

Tipo:

Organization

Información mínima:

\- Nombre.

\- Logo.

\- URL.

\- Redes Sociales.

\- Correo.

\- Teléfono.

\---

\# Iglesia

El sitio utilizará además:

Church

Información:

\- Nombre.

\- Dirección.

\- Horarios.

\- Teléfono.

\- Ubicación.

\- Sitio Web.

\- Redes Sociales.

\---

\# Sitio Web

Toda la plataforma declarará:

WebSite

Incluyendo:

\- Nombre.

\- URL.

\- Idioma.

\- Motor de búsqueda interno (cuando exista).

\---

\# Página Principal

Tipo:

WebPage

Deberá incluir:

\- Organización.

\- Iglesia.

\- Breadcrumb.

\- Imagen principal.

\---

\# Devocionales

Cada devocional utilizará:

Article

Información:

\- Autor.

\- Fecha.

\- Fecha de actualización.

\- Imagen.

\- Título.

\- Descripción.

\---

\# Eventos

Cada evento utilizará:

Event

Información:

\- Nombre.

\- Fecha.

\- Hora.

\- Lugar.

\- Imagen.

\- Organizador.

\- Estado.

\- Descripción.

\---

\# Formación Bíblica

Cada programa utilizará:

Course

Información:

\- Nombre.

\- Descripción.

\- Instructor.

\- Duración.

\- Modalidad.

\---

\# Ministerios

Cada ministerio utilizará:

Organization

o

Service

Dependiendo de su naturaleza.

\---

\# Liderazgo

Cada integrante podrá utilizar:

Person

Información:

\- Nombre.

\- Cargo.

\- Fotografía.

\- Organización.

\---

\# Videos

Los videos públicos utilizarán:

VideoObject

Información:

\- Nombre.

\- Descripción.

\- Miniatura.

\- Fecha.

\- Duración.

\- URL.

\---

\# Imágenes

Las imágenes importantes deberán estar relacionadas con:

ImageObject

\---

\# Navegación

Todas las páginas internas utilizarán:

BreadcrumbList

Generado automáticamente.

\---

\# Contacto

La página Contacto utilizará:

ContactPage

\---

\# Donaciones

La página Donaciones utilizará:

WebPage

Hasta que exista un Schema más específico aplicable al flujo definitivo.

\---

\# Búsqueda

Cuando exista buscador:

SearchAction

\---

\# Preguntas Frecuentes

Cuando exista una sección FAQ:

FAQPage

\---

\# Página 404

No deberá generar Structured Data.

\---

\# Páginas Privadas

El CMS nunca deberá generar Structured Data.

\---

\# Automatización

Todo Structured Data deberá generarse automáticamente utilizando la información almacenada en la base de datos.

Nunca duplicar información manualmente.

\---

\# Validación

Antes de producción validar utilizando:

\- Google Rich Results Test.

\- Schema.org Validator.

\---

\# Rendimiento

La generación de JSON-LD no deberá afectar perceptiblemente el tiempo de carga.

\---

\# Mantenimiento

Toda nueva página pública deberá definir:

\- Tipo Schema.

\- Propiedades requeridas.

\- Relación con la organización.

\---

\# Restricciones

No permitir:

\- Schema duplicado.

\- Datos incompletos.

\- Información desactualizada.

\- Tipos incorrectos.

\---

\# Criterios de Aceptación

La estrategia será considerada correcta cuando:

\- Todas las páginas públicas generen Structured Data.

\- Google valide correctamente los tipos implementados.

\- No existan errores de Schema.

\- Los Rich Results sean elegibles cuando corresponda.

\---

\# Principio Final

Todo contenido publicado deberá ser comprensible tanto para los visitantes como para los motores de búsqueda.

La generación de Structured Data será completamente automática, consistente y mantenible.

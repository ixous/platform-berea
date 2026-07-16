\# MEDIA STORAGE

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial para almacenar, organizar, proteger y servir imágenes, videos, miniaturas y documentos utilizados por el sitio público y el CMS.

Los archivos multimedia nunca deberán almacenarse directamente dentro de la base de datos ni dentro del repositorio del proyecto.

La base de datos únicamente conservará metadatos, identificadores y referencias a los archivos almacenados.

\---

\# Alcance

Esta estrategia aplica a:

\- Fotografías institucionales.

\- Imágenes de ministerios.

\- Imágenes de eventos.

\- Imágenes de devocionales.

\- Fotografías de células.

\- Fotografías de liderazgo.

\- Imágenes de la visión anual.

\- Logos.

\- Banners.

\- Miniaturas.

\- Videos del Nuevo Auditorio Berea.

\- Videos de eventos.

\- Documentos descargables.

\- Recursos multimedia futuros.

\---

\# Arquitectura General

El flujo multimedia será:

CMS

↓

Carga directa segura

↓

Proveedor de almacenamiento

↓

Procesamiento y optimización

↓

CDN

↓

Sitio público

La aplicación no deberá servir archivos pesados directamente desde funciones de Next.js.

\---

\# Proveedor de Imágenes y Archivos

El almacenamiento principal para imágenes y documentos será:

\- Cloudflare R2.

Cloudflare R2 deberá utilizarse para:

\- Imágenes originales.

\- Versiones optimizadas.

\- Miniaturas.

\- Logos.

\- Documentos.

\- Recursos descargables.

\- Imágenes de respaldo para videos.

\---

\# Proveedor de Videos

Los videos pesados no deberán almacenarse ni reproducirse directamente desde Cloudflare R2 como archivos convencionales.

El proveedor oficial de video será definido antes de implementar el módulo multimedia.

Opciones permitidas:

\- Cloudflare Stream.

\- YouTube mediante videos no listados.

La decisión final deberá registrarse en:

```text

docs/06-development/DECISIONS.md

```

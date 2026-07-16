\# VIDEO STRATEGY

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial para la administración, procesamiento, almacenamiento y distribución de videos dentro del sitio web de Centro Cristiano Berea.

Los videos representan uno de los recursos multimedia más importantes del proyecto, especialmente para:

\- Nuevo Auditorio Berea.

\- Eventos Especiales.

\- Campamentos.

\- Conferencias.

\- Material Institucional.

\- Contenido futuro.

La estrategia deberá garantizar excelente calidad visual, alto rendimiento y bajos tiempos de carga.

\---

\# Filosofía

El equipo de Multimedia únicamente deberá preocuparse por producir el contenido.

La plataforma será responsable de:

\- Procesar.

\- Convertir.

\- Almacenar.

\- Distribuir.

\- Optimizar.

\- Publicar.

Todo de forma transparente para el usuario.

\---

\# Alcance

La estrategia aplica para:

\- Videos del Nuevo Auditorio.

\- Videos institucionales.

\- Videos promocionales.

\- Videos de eventos.

\- Videos de ministerios.

\- Videos futuros.

\---

\# Arquitectura

El flujo oficial será:

Editor CMS

↓

Carga

↓

Proveedor especializado

↓

Procesamiento

↓

Generación de miniatura

↓

CDN

↓

Sitio Público

\---

\# Proveedor Oficial

Los videos deberán almacenarse utilizando un proveedor especializado.

Opciones aprobadas:

\- Cloudflare Stream

\- YouTube (No listado)

La decisión definitiva deberá registrarse en:

development/DECISIONS.md

\---

\# Razones

Nunca almacenar videos directamente en:

\- Neon PostgreSQL

\- Repositorio Git

\- Vercel

\- Next.js

Los videos deberán servirse desde una infraestructura diseñada específicamente para streaming.

\---

\# Flujo de Publicación

1\. Usuario carga video.

2\. Validación.

3\. Procesamiento.

4\. Conversión automática.

5\. Generación de miniatura.

6\. Registro en Base de Datos.

7\. Publicación.

\---

\# Biblioteca Multimedia

El CMS deberá contar con una biblioteca de videos.

Cada video mostrará:

\- Miniatura.

\- Título.

\- Fecha.

\- Duración.

\- Resolución.

\- Peso.

\- Estado.

\- Autor.

\---

\# Estados

Un video podrá encontrarse en:

\- Pendiente.

\- Subiendo.

\- Procesando.

\- Disponible.

\- Archivado.

\- Eliminado.

No deberá publicarse mientras continúe procesándose.

\---

\# Miniaturas

El sistema deberá generar automáticamente una miniatura.

También deberá permitir reemplazarla manualmente.

\---

\# Formatos

Entrada

\- MP4

\- MOV

\- WebM

Los formatos finales dependerán del proveedor seleccionado.

\---

\# Calidad

El sistema deberá permitir múltiples resoluciones.

Ejemplos:

1080p

720p

480p

360p

El visitante recibirá automáticamente la resolución más adecuada.

\---

\# Streaming Adaptativo

Cuando el proveedor lo permita deberá utilizarse Adaptive Streaming.

El usuario nunca deberá seleccionar manualmente la calidad.

\---

\# Precarga

No precargar videos automáticamente.

Cargar únicamente cuando el usuario interactúe.

\---

\# Reproducción

Los videos no deberán reproducirse automáticamente con sonido.

La reproducción automática solamente será permitida si el video inicia silenciado y mejora la experiencia del usuario.

\---

\# Controles

El reproductor deberá incluir:

\- Play

\- Pause

\- Barra de progreso

\- Pantalla completa

\- Control de volumen

\- Tiempo transcurrido

\- Calidad (si aplica)

\---

\# Accesibilidad

Todo video deberá permitir:

\- Título

\- Descripción

\- Texto alternativo para miniatura

\- Subtítulos (futuro)

\---

\# SEO

Todo video público deberá incluir:

\- Título

\- Descripción

\- Miniatura

\- Structured Data

\- Open Graph

\---

\# Caché

Los videos deberán aprovechar:

\- CDN

\- Edge Cache

Nunca utilizar caché del navegador para contenido dinámico sin control de versiones.

\---

\# Seguridad

No exponer credenciales.

No permitir acceso a videos privados.

Validar permisos antes de generar URLs privadas.

\---

\# Auditoría

Registrar:

\- Carga.

\- Procesamiento.

\- Publicación.

\- Reemplazo.

\- Eliminación.

\- Restauración.

\- Errores.

\---

\# Biblioteca

El usuario deberá poder:

\- Buscar videos.

\- Filtrar.

\- Reutilizar.

\- Reemplazar.

\- Archivar.

\- Eliminar.

\- Restaurar.

\---

\# Eliminación

La eliminación será:

Lógica

↓

Retención

↓

Eliminación Física

Nunca eliminar inmediatamente.

\---

\# Videos del Nuevo Auditorio

Esta sección utilizará un único video destacado.

El equipo de Multimedia podrá:

\- Reemplazar el video actual.

\- Cambiar el título.

\- Cambiar la descripción.

\- Cambiar la fecha.

\- Cambiar la miniatura.

No será necesario modificar código.

\---

\# Compatibilidad

El sistema deberá funcionar correctamente en:

\- Desktop.

\- Tablet.

\- Smartphone.

\---

\# Rendimiento

El visitante nunca deberá descargar el archivo completo antes de comenzar la reproducción.

El proveedor deberá utilizar streaming optimizado.

\---

\# Futuro

La arquitectura permitirá incorporar posteriormente:

\- Transmisiones en vivo.

\- Biblioteca de predicaciones.

\- Podcasts.

\- Series.

\- Devocionales en video.

\- Cursos bíblicos.

Sin modificar la arquitectura principal.

\---

\# Restricciones

No permitir:

\- Videos sin procesar.

\- Videos dentro del repositorio.

\- Videos almacenados en Neon.

\- Videos servidos directamente desde Next.js.

\- Publicación antes de terminar el procesamiento.

\---

\# Criterios de Aceptación

La estrategia será considerada correcta cuando:

\- El almacenamiento sea externo.

\- El streaming sea optimizado.

\- Exista biblioteca multimedia.

\- Los videos puedan reutilizarse.

\- El CMS permita administrarlos completamente.

\- El sitio mantenga excelente rendimiento.

\---

\# Principio Final

El equipo de Multimedia únicamente deberá subir el video.

La plataforma será responsable de transformarlo en una experiencia rápida, moderna y optimizada para cualquier visitante, independientemente del dispositivo o la velocidad de conexión.

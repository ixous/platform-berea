\# CACHE STRATEGY

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial de caché para maximizar el rendimiento del sitio web, reducir tiempos de carga y minimizar consultas innecesarias.

La estrategia deberá aprovechar las capacidades nativas de Next.js, Vercel y Cloudflare.

\---

\# Filosofía

El visitante nunca deberá esperar por información que ya pueda entregarse desde caché.

La información únicamente deberá consultarse desde la base de datos cuando realmente sea necesario.

\---

\# Capas de Caché

La plataforma utilizará múltiples niveles de caché.

Browser Cache

↓

CDN Cache

↓

Edge Cache

↓

Next.js Data Cache

↓

Neon PostgreSQL

Cada capa deberá reducir la carga de la siguiente.

\---

\# Browser Cache

Los recursos estáticos deberán almacenarse en el navegador.

Aplicable a:

\- Logos.

\- Iconos.

\- CSS.

\- JavaScript.

\- Fuentes.

\- Imágenes optimizadas.

\---

\# CDN Cache

Todo contenido público deberá distribuirse mediante CDN.

Ejemplos:

\- Imágenes.

\- Videos.

\- Archivos estáticos.

\- Documentos.

\---

\# Edge Cache

Las páginas públicas deberán aprovechar Edge Cache cuando sea posible.

Especialmente:

\- Inicio.

\- Ministerios.

\- Doctrina.

\- Contacto.

\---

\# Next.js Data Cache

Las consultas públicas utilizarán Data Cache.

No consultar la base de datos innecesariamente.

\---

\# ISR

Utilizar Incremental Static Regeneration cuando el contenido cambie ocasionalmente.

Ejemplos:

\- Devocionales.

\- Eventos.

\- Formación Bíblica.

\- Células.

\- Ministerios.

\---

\# Dynamic Rendering

Utilizar renderizado dinámico únicamente cuando sea necesario.

Ejemplos:

\- CMS.

\- Dashboard.

\- Administración.

\---

\# Server Components

Priorizar Server Components.

Reducir JavaScript enviado al navegador.

\---

\# Client Components

Utilizar únicamente cuando exista interacción.

No convertir páginas completas en Client Components.

\---

\# Revalidation

Toda actualización del CMS deberá invalidar únicamente el contenido relacionado.

Ejemplo:

Editar Evento

↓

Invalidar:

\- Página del evento.

\- Listado de eventos.

\- Home (si aparece destacado).

No invalidar todo el sitio.

\---

\# Etiquetas de Caché

Utilizar Cache Tags.

Ejemplos:

events

ministries

cells

devotionals

leadership

home

settings

\---

\# Revalidate Path

Utilizar cuando cambie una ruta específica.

\---

\# Revalidate Tag

Utilizar cuando múltiples páginas compartan información.

\---

\# Multimedia

Las imágenes utilizarán:

\- CDN.

\- Browser Cache.

\- Versionado.

Nunca servir imágenes originales.

\---

\# Videos

Los videos dependerán del proveedor.

No almacenar videos en caché del servidor de Next.js.

\---

\# CMS

El CMS nunca deberá utilizar caché para información crítica.

Siempre mostrar información actualizada.

\---

\# Formularios

Nunca cachear:

\- Login.

\- Contacto.

\- Donaciones.

\- Panel Administrativo.

\---

\# SEO

Las páginas indexables deberán generarse lo más rápido posible.

Reducir TTFB.

\---

\# Headers

Configurar correctamente:

Cache-Control

ETag

Last-Modified

\---

\# Tiempo de Vida

Los tiempos deberán ser configurables.

Ejemplo inicial:

Branding

30 días.

Ministerios

24 horas.

Eventos

30 minutos.

Devocionales

1 hora.

Configuración

24 horas.

\---

\# Invalidación

Toda modificación desde el CMS deberá:

Actualizar Base de Datos

↓

Invalidar Caché

↓

Actualizar CDN

↓

Publicar cambios

Todo automáticamente.

\---

\# Beneficios

\- Menor carga al servidor.

\- Menor consumo de base de datos.

\- Mayor velocidad.

\- Mejor SEO.

\- Mejor Core Web Vitals.

\- Excelente experiencia móvil.

\---

\# Monitoreo

Registrar:

\- Cache Hits.

\- Cache Miss.

\- Tiempo de respuesta.

\- Revalidaciones.

\- Invalidaciones.

\---

\# Restricciones

No cachear:

\- Información privada.

\- Usuarios autenticados.

\- Dashboard.

\- CMS.

\- Formularios.

\---

\# Criterios de Aceptación

La estrategia será correcta cuando:

\- El sitio cargue rápidamente.

\- Las páginas públicas utilicen caché.

\- El CMS siempre muestre datos actualizados.

\- Las revalidaciones sean automáticas.

\- No existan inconsistencias entre caché y base de datos.

\---

\# Principio Final

El sistema deberá entregar siempre la información más rápida posible sin comprometer la consistencia de los datos.

La caché deberá ser transparente para el usuario y completamente administrada por la plataforma.

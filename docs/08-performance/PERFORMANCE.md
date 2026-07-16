\# PERFORMANCE

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir los estándares oficiales de rendimiento del proyecto.

Toda nueva funcionalidad deberá cumplir con este documento antes de publicarse en producción.

El rendimiento será considerado un requisito funcional del sistema.

\---

\# Filosofía

La velocidad forma parte de la experiencia del usuario.

Un sitio rápido transmite calidad, profesionalismo y confianza.

La plataforma deberá sentirse instantánea tanto en equipos modernos como en dispositivos móviles de gama media o baja.

\---

\# Objetivos

\- Excelente experiencia móvil.

\- Excelente experiencia desktop.

\- Excelente SEO.

\- Excelente Core Web Vitals.

\- Consumo mínimo de recursos.

\- Navegación fluida.

\---

\# Lighthouse

Objetivo mínimo:

Performance

95+

Accessibility

95+

Best Practices

100

SEO

100

No desplegar una versión con puntuaciones inferiores sin autorización.

\---

\# Core Web Vitals

\## Largest Contentful Paint (LCP)

Objetivo:

Menor a 2.5 segundos.

\---

\## Interaction to Next Paint (INP)

Objetivo:

Menor a 200 ms.

\---

\## Cumulative Layout Shift (CLS)

Objetivo:

Menor a 0.1

\---

\## First Contentful Paint (FCP)

Objetivo:

Menor a 1.8 segundos.

\---

\## Time To First Byte (TTFB)

Objetivo:

Menor a 800 ms.

\---

\# JavaScript

Reducir JavaScript enviado al navegador.

Priorizar:

\- React Server Components.

\- Server Actions.

\- Componentes reutilizables.

Evitar JavaScript innecesario.

\---

\# Code Splitting

Toda funcionalidad deberá cargarse únicamente cuando sea necesaria.

No enviar módulos completos si el usuario no los utilizará.

\---

\# Lazy Loading

Aplicar Lazy Loading a:

\- Imágenes.

\- Videos.

\- Galerías.

\- Componentes pesados.

\- Mapas.

\- Scripts de terceros.

\---

\# Imágenes

Todas las imágenes deberán:

\- Optimizarse automáticamente.

\- Utilizar formatos modernos.

\- Utilizar srcset.

\- Utilizar sizes.

\- Generar miniaturas.

\- Aprovechar CDN.

\---

\# Videos

No cargar videos automáticamente.

Cargar únicamente cuando el usuario interactúe.

\---

\# Tipografía

Utilizar:

next/font

Evitar solicitudes innecesarias a proveedores externos.

\---

\# Scripts de Terceros

Todo script externo deberá justificarse.

Antes de agregar uno nuevo evaluar:

\- Impacto en rendimiento.

\- Impacto en privacidad.

\- Beneficio real.

\---

\# Dependencias

Instalar únicamente librerías necesarias.

Eliminar dependencias sin uso.

Revisar periódicamente el tamaño del proyecto.

\---

\# Renderizado

Priorizar:

Server Components.

Utilizar Client Components únicamente cuando exista interacción.

\---

\# Consultas

Reducir consultas innecesarias.

Consultar únicamente la información requerida.

Evitar sobrecarga de datos.

\---

\# Base de Datos

Optimizar:

\- Índices.

\- Relaciones.

\- Consultas.

\- Paginación.

Nunca cargar grandes cantidades de registros innecesariamente.

\---

\# Paginación

Todo listado grande deberá utilizar:

\- Paginación.

\- Carga incremental.

\- Filtros.

\---

\# Multimedia

Nunca servir archivos originales.

Siempre utilizar versiones optimizadas.

\---

\# Caché

Implementar la estrategia definida en:

CACHE\_STRATEGY.md

\---

\# Bundle Size

Reducir el tamaño del bundle principal.

No incorporar librerías pesadas cuando existan alternativas más ligeras.

\---

\# Animaciones

Las animaciones deberán:

\- Ser fluidas.

\- Mejorar la experiencia.

\- No afectar el rendimiento.

Respetar la preferencia:

prefers-reduced-motion

\---

\# Responsive

El rendimiento deberá mantenerse en:

\- Desktop.

\- Tablet.

\- Smartphone.

\---

\# Accesibilidad

La optimización nunca deberá comprometer la accesibilidad.

\---

\# Monitoreo

Registrar:

\- Tiempo de carga.

\- Tiempo de renderizado.

\- Core Web Vitals.

\- Errores JavaScript.

\- Consumo de recursos.

\---

\# Herramientas

Durante el desarrollo utilizar:

\- Lighthouse.

\- Chrome DevTools.

\- Vercel Analytics.

\- Sentry.

\---

\# Presupuesto de Rendimiento

\## JavaScript inicial

Menor a 200 KB comprimido.

\---

\## CSS inicial

Menor a 100 KB comprimido.

\---

\## Imagen Hero

Menor a 300 KB.

\---

\## Imágenes de tarjetas

Menor a 150 KB.

\---

\## Miniaturas

Menor a 50 KB.

\---

\## Primera carga

Menor a 2 segundos en conexiones rápidas.

\---

\# Restricciones

No permitir:

\- Librerías innecesarias.

\- Bundle excesivo.

\- Imágenes sin optimizar.

\- Videos embebidos incorrectamente.

\- Consultas repetidas.

\- Componentes duplicados.

\---

\# Auditoría

Antes de cada despliegue verificar:

\- Lighthouse.

\- Core Web Vitals.

\- Bundle Size.

\- Consultas.

\- Caché.

\- Multimedia.

\- Accesibilidad.

\---

\# Criterios de Aceptación

El rendimiento será considerado correcto cuando:

\- Lighthouse alcance los objetivos establecidos.

\- Core Web Vitals se mantengan dentro de los valores recomendados.

\- El sitio sea rápido en dispositivos móviles.

\- No existan cuellos de botella significativos.

\- La experiencia sea fluida en todas las páginas.

\---

\# Principio Final

Cada nueva funcionalidad deberá mantener o mejorar el rendimiento general de la plataforma.

Nunca se sacrificará el rendimiento por incorporar una funcionalidad que pueda resolverse de forma más eficiente.

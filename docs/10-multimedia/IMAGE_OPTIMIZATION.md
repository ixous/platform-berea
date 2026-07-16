\# IMAGE OPTIMIZATION

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial para el procesamiento, optimización y entrega de imágenes utilizadas por el sitio web y el CMS.

Toda imagen cargada al sistema deberá procesarse automáticamente antes de ser publicada.

El usuario nunca deberá preocuparse por tamaños, formatos o compresión.

El sistema será responsable de entregar siempre la mejor versión posible según el dispositivo y navegador del visitante.

\---

\# Filosofía

El equipo de Multimedia deberá concentrarse en crear contenido.

La plataforma será responsable de:

\- Optimizar.

\- Comprimir.

\- Redimensionar.

\- Convertir formatos.

\- Generar miniaturas.

\- Servir la versión correcta.

Todo esto deberá ocurrir automáticamente.

\---

\# Objetivos

\- Mantener el sitio extremadamente rápido.

\- Reducir consumo de ancho de banda.

\- Reducir tiempos de carga.

\- Mejorar Core Web Vitals.

\- Mejorar SEO.

\- Ahorrar almacenamiento.

\- Mantener excelente calidad visual.

\---

\# Flujo General

Usuario

↓

Selecciona imagen

↓

Validación

↓

Carga

↓

Procesamiento

↓

Optimización

↓

Generación de versiones

↓

Cloudflare R2

↓

CDN

↓

Sitio Web

\---

\# Formatos Permitidos

Entrada

\- JPG

\- JPEG

\- PNG

\- WebP

\- AVIF

Salida

Preferentemente:

\- AVIF

\- WebP

Manteniendo JPG únicamente cuando el navegador no soporte formatos modernos.

\---

\# Conversión Automática

Todas las imágenes deberán convertirse automáticamente al formato más eficiente compatible.

Orden de preferencia:

1\. AVIF

2\. WebP

3\. JPEG

El visitante nunca deberá elegir el formato.

\---

\# Motor de Optimización

El procesamiento utilizará:

\- Sharp

No deberán utilizarse librerías innecesarias.

\---

\# Compresión

La compresión deberá buscar el equilibrio entre:

\- Calidad visual.

\- Peso.

\- Rendimiento.

Nunca deberá degradarse perceptiblemente una imagen.

\---

\# Versiones Generadas

Cada imagen podrá generar automáticamente:

Original

↓

Large

↓

Medium

↓

Small

↓

Thumbnail

Las dimensiones exactas serán definidas durante la implementación.

\---

\# Responsive Images

Todas las imágenes deberán servirse mediante:

\- srcset

\- sizes

El navegador elegirá automáticamente la versión más adecuada.

\---

\# Lazy Loading

Toda imagen fuera del primer viewport deberá utilizar carga diferida.

Excepciones:

\- Logo principal.

\- Hero principal.

\- Imagen LCP.

\---

\# LCP

La imagen principal de la página deberá optimizarse especialmente para mejorar:

Largest Contentful Paint.

\---

\# Dimensiones

No deberán publicarse imágenes originales innecesariamente grandes.

Si una imagen supera las dimensiones recomendadas:

El sistema deberá redimensionarla automáticamente.

\---

\# Orientación

El sistema deberá respetar automáticamente la orientación EXIF.

Nunca mostrar imágenes rotadas incorrectamente.

\---

\# Eliminación de Metadatos

Eliminar automáticamente:

\- Información EXIF innecesaria.

\- Datos de cámara.

\- Coordenadas GPS.

\- Información privada.

Conservar únicamente la información necesaria.

\---

\# Miniaturas

Generar automáticamente miniaturas para:

\- CMS.

\- Biblioteca Multimedia.

\- Galerías.

\- Tarjetas.

\- Eventos.

\- Devocionales.

No generar miniaturas manualmente.

\---

\# Branding

Los logos institucionales deberán conservar transparencia cuando corresponda.

Nunca convertir PNG transparente a formatos que pierdan transparencia.

\---

\# Calidad

La calidad deberá ser configurable.

El sistema deberá permitir modificar:

\- Calidad.

\- Compresión.

\- Dimensiones.

Sin modificar el código.

\---

\# Caché

Las imágenes públicas deberán aprovechar:

\- CDN.

\- Browser Cache.

\- Edge Cache.

Las imágenes modificadas deberán invalidar automáticamente la versión anterior.

\---

\# Versionado

Nunca sobrescribir una imagen publicada.

Cuando un archivo cambie:

Generar un nuevo identificador.

Actualizar referencias.

Mantener historial.

\---

\# Watermarks

La primera versión del proyecto NO utilizará marcas de agua.

La arquitectura deberá permitir incorporarlas en el futuro.

\---

\# Accesibilidad

Toda imagen deberá permitir:

Texto alternativo.

Título.

Descripción.

Pie de foto.

Créditos.

Estos campos serán editables desde el CMS.

\---

\# SEO

Toda imagen pública deberá incluir:

\- Alt Text

\- Nombre descriptivo

\- Tamaño optimizado

\- Formato moderno

Nunca publicar imágenes sin texto alternativo.

\---

\# Biblioteca Multimedia

La biblioteca deberá mostrar:

Miniatura.

Dimensiones.

Peso.

Formato.

Fecha.

Autor.

Uso actual.

Estado.

\---

\# Validaciones

Antes del procesamiento validar:

\- Formato.

\- Tipo MIME.

\- Tamaño.

\- Resolución.

\- Integridad del archivo.

\---

\# Límites

Los valores deberán ser configurables.

Valores iniciales recomendados:

Peso máximo:

20 MB

Resolución máxima:

8000 x 8000 px

\---

\# Imágenes del Hero

Las imágenes utilizadas en Hero deberán tener una optimización específica.

Prioridad alta.

Precarga cuando corresponda.

\---

\# Galerías

Las galerías utilizarán:

Miniaturas.

Carga progresiva.

Lazy Loading.

Lightbox.

No cargar todas las imágenes simultáneamente.

\---

\# Error de Procesamiento

Si una imagen falla:

\- Registrar error.

\- Notificar al usuario.

\- No publicar.

\- Permitir reintentar.

\---

\# Auditoría

Registrar:

Carga.

Procesamiento.

Conversión.

Reemplazo.

Eliminación.

Restauración.

Errores.

\---

\# Monitoreo

Registrar métricas:

Tiempo de procesamiento.

Peso original.

Peso optimizado.

Porcentaje de ahorro.

Formato generado.

\---

\# Beneficios Esperados

\- Menor consumo de datos.

\- Mayor velocidad.

\- Mejor SEO.

\- Excelente experiencia móvil.

\- Menor costo de almacenamiento.

\- Menor ancho de banda.

\---

\# Restricciones

No permitir:

\- Imágenes sin optimizar.

\- PNG gigantes innecesarios.

\- Archivos corruptos.

\- Imágenes sin texto alternativo.

\- Publicación directa del archivo original.

\---

\# Criterios de Aceptación

La estrategia será considerada correcta cuando:

\- Todas las imágenes se optimicen automáticamente.

\- Se generen formatos modernos.

\- Se creen miniaturas.

\- Exista soporte responsive.

\- Se eliminen metadatos innecesarios.

\- Se utilice lazy loading.

\- Se mejore el rendimiento sin intervención del usuario.

\- El CMS permita administrar toda la información asociada.

\---

\# Principio Final

El equipo de Multimedia únicamente deberá preocuparse por capturar buenas fotografías.

La plataforma será responsable de transformarlas automáticamente en recursos optimizados, ligeros y preparados para ofrecer la mejor experiencia posible en cualquier dispositivo.

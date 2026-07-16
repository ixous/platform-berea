\# URL STRATEGY

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial de URLs del proyecto para garantizar una navegación consistente, una excelente indexación en buscadores y una arquitectura preparada para crecer durante muchos años.

Las URLs deberán permanecer estables en el tiempo.

Nunca deberán modificarse sin una razón justificada.

\---

\# Filosofía

Las URLs forman parte de la identidad del sitio.

Deben ser:

\- Claras.

\- Cortas.

\- Legibles.

\- Permanentes.

\- Predecibles.

Una URL debe describir claramente el contenido antes de que el usuario ingrese.

\---

\# Principios

Toda URL deberá cumplir:

\- HTTPS.

\- Minúsculas.

\- Sin espacios.

\- Sin caracteres especiales.

\- Sin acentos.

\- Sin parámetros innecesarios.

\- Sin IDs visibles cuando sea posible.

\---

\# Idioma

Las URLs oficiales utilizarán español.

Ejemplos:

/ministerios

/eventos

/devocionales

/contacto

\---

\# URLs Públicas

\## Inicio

/

\---

\## Quiénes Somos

/quienes-somos

\---

\## Historia

/quienes-somos/historia

\---

\## Doctrina

/quienes-somos/doctrina

\---

\## Liderazgo

/quienes-somos/liderazgo

\---

\## Ministerios

/ministerios

\---

\## Ministerio

/ministerios/{slug}

Ejemplo:

/ministerios/alabanza

\---

\## Formación Bíblica

/formacion-biblica

\---

\## Programa

/formacion-biblica/{slug}

\---

\## Células

/celulas

\---

\## Célula

/celulas/{slug}

\---

\## Devocionales

/devocionales

\---

\## Devocional

/devocionales/{slug}

Ejemplo:

/devocionales/el-amor-de-dios

\---

\## Eventos

/eventos

\---

\## Evento

/eventos/{slug}

Ejemplo:

/eventos/noche-mexicana-2026

\---

\## Visión Anual

/vision-anual

\---

\## Nuevo Auditorio

/nuevo-auditorio

\---

\## Donaciones

/donaciones

\---

\## Contacto

/contacto

\---

\# URLs del CMS

Nunca deberán indexarse.

Ejemplos:

/admin

/admin/login

/admin/dashboard

/admin/eventos

/admin/devocionales

/admin/media

/admin/usuarios

\---

\# Slugs

Todo contenido público utilizará Slugs.

Ejemplos:

ministerio-infantil

escuela-de-lideres

noche-mexicana-2026

No utilizar IDs como URL pública.

\---

\# Generación

Los Slugs deberán generarse automáticamente.

El usuario podrá modificarlos cuando sea necesario.

\---

\# Validación

Cada slug deberá ser:

Único.

Legible.

Compatible con SEO.

\---

\# Caracteres Permitidos

Solo permitir:

a-z

0-9

guion (-)

\---

\# Caracteres No Permitidos

No permitir:

Espacios.

Acentos.

Ñ.

Símbolos especiales.

Guiones bajos.

\---

\# Longitud

Máximo recomendado:

80 caracteres.

\---

\# Cambio de URL

Cuando cambie un slug:

Generar automáticamente una redirección permanente (301).

Nunca romper enlaces existentes.

\---

\# Redirecciones

Tipos permitidos:

301

Cambio permanente.

302

Cambio temporal.

\---

\# URLs Canónicas

Toda página deberá declarar su URL canónica.

Evitar contenido duplicado.

\---

\# Paginación

Cuando existan listados:

/devocionales?page=2

/eventos?page=3

No crear rutas innecesarias.

\---

\# Filtros

Utilizar parámetros únicamente cuando sean temporales.

Ejemplo:

/eventos?mes=septiembre

No indexar filtros.

\---

\# Búsquedas

Las búsquedas no deberán indexarse.

Ejemplo:

/buscar?q=amor

\---

\# Recursos Multimedia

Las URLs públicas deberán utilizar:

CDN

Nunca servir archivos desde rutas internas del proyecto.

\---

\# Compatibilidad Futura

La estrategia permitirá incorporar posteriormente:

Idiomas.

/en/events

Sin modificar las URLs actuales.

\---

\# Sitemap

Toda URL pública deberá registrarse automáticamente en:

sitemap.xml

\---

\# Robots

Bloquear:

/admin

/api

/login

/papelera

/borradores

\---

\# Analytics

Las URLs deberán mantenerse estables para facilitar el análisis histórico.

\---

\# Restricciones

No permitir:

\- IDs visibles innecesarios.

\- URLs duplicadas.

\- Slugs repetidos.

\- Parámetros permanentes.

\- URLs extremadamente largas.

\---

\# Criterios de Aceptación

La estrategia será considerada correcta cuando:

\- Todas las URLs sean amigables.

\- Existan Slugs únicos.

\- Las redirecciones funcionen correctamente.

\- No existan enlaces rotos.

\- El sitemap se actualice automáticamente.

\- Los motores de búsqueda indexen únicamente contenido público.

\---

\# Principio Final

Una URL deberá permanecer estable durante toda la vida útil del contenido.

Las URLs deberán ser simples para las personas, claras para los motores de búsqueda y fáciles de mantener para el equipo de desarrollo.

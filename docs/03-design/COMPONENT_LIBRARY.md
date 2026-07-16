# COMPONENT LIBRARY

# Centro Cristiano Berea Website

Versión: 1.0

Estado: Planeación

---

# Objetivo

Definir la biblioteca oficial de componentes reutilizables del proyecto.

Todos los componentes deberán utilizarse de forma consistente en todo el sistema.

No deberán existir componentes duplicados que realicen la misma función.

Todo nuevo componente deberá evaluarse antes de incorporarse a esta biblioteca.

---

# Filosofía

El objetivo es construir una interfaz consistente.

Cada componente deberá:

- Tener una única responsabilidad.
- Ser reutilizable.
- Ser configurable mediante propiedades.
- Ser responsive.
- Ser accesible.
- Mantener la identidad visual del proyecto.

---

# Organización

Los componentes estarán agrupados por categorías.

---

# LAYOUT

## Header

Descripción

Barra superior del sitio.

Funciones

- Logo
- Navegación
- Menú responsive
- Botón principal
- Cambio de idioma (futuro)

Utilizado en:

Todo el sitio público.

---

## Footer

Descripción

Pie de página institucional.

Contenido

- Logo
- Dirección
- Teléfono
- Correo
- Redes sociales
- Horarios
- Copyright
- Aviso de privacidad

---

## Container

Contenedor principal.

Controla el ancho máximo del contenido.

---

## Section

Sección reutilizable.

Controla espaciado vertical.

---

## Page Header

Encabezado reutilizable para páginas internas.

Contendrá:

Título

Descripción

Imagen opcional

Breadcrumb

---

# NAVEGACIÓN

## Navbar

## Mobile Menu

## Breadcrumb

## Pagination

## Tabs

---

# BOTONES

## Primary Button

Acción principal.

---

## Secondary Button

---

## Outline Button

---

## Ghost Button

---

## Danger Button

---

## Icon Button

---

## Floating Action Button (Futuro)

---

Todos compartirán:

- Tamaño
- Tipografía
- Animaciones
- Estados
- Border Radius

---

# TARJETAS

## Ministry Card

Mostrará:

Imagen

Nombre

Descripción

Botón Ver Más

---

## Event Card

Mostrará:

Imagen

Fecha

Hora

Lugar

Descripción corta

Botón

---

## Devotional Card

Mostrará:

Imagen

Título

Versículo

Autor

Fecha

---

## Cell Card

Mostrará:

Nombre

Líder

Zona

Horario

Botón Cómo Llegar

---

## Program Card

Para Formación Bíblica.

---

## Leadership Card

Fotografía

Nombre

Cargo

Descripción

---

## Gallery Card

---

## Video Card

---

# HERO

## Home Hero

Hero principal del sitio.

Permitirá:

Imagen

Video

Título

Subtítulo

Botones

Overlay

---

# FORMULARIOS

## Text Input

---

## TextArea

---

## Select

---

## Checkbox

---

## Radio Button

---

## Date Picker

---

## Time Picker

---

## Image Upload

Permitirá:

Arrastrar

Seleccionar

Vista previa

Eliminar

Reemplazar

---

## Video Upload

Permitirá:

Subida

Vista previa

Eliminar

Reemplazar

Estado de procesamiento

---

## Rich Text Editor

Editor reutilizable.

Permitirá:

Negritas

Cursivas

Listas

Versículos

Links

Imágenes

Videos

Tablas

Separadores

---

# MODALES

## Confirm Modal

Eliminar

Publicar

Archivar

---

## Preview Modal

Vista previa.

---

## Image Viewer

---

## Video Player

---

# MENSAJES

## Success Alert

---

## Error Alert

---

## Warning Alert

---

## Information Alert

---

## Toast

Notificaciones temporales.

---

# GALERÍA

## Image Gallery

---

## Carousel

---

## Lightbox

---

# MAPAS

## Google Maps Component

Permitirá:

Ubicación

Marcadores

Cómo Llegar

---

# CALENDARIO

## Event Calendar

Permitirá:

Vista mensual

Vista semanal

Vista agenda

Filtros

---

# MULTIMEDIA

## Image Component

Optimización automática.

Carga diferida.

Responsive.

---

## Video Component

Streaming optimizado.

Miniatura.

Play.

Pantalla completa.

---

# CMS

## Dashboard Card

---

## Statistics Card

---

## Data Table

Permitirá:

Buscar

Filtrar

Ordenar

Paginación

Acciones

---

## Empty State

Cuando no existan registros.

---

## Loading State

Skeleton Loader.

---

## Search Box

---

## Filters Panel

---

## Status Badge

Estados:

Publicado

Borrador

Archivado

Oculto

---

## Action Menu

Editar

Duplicar

Publicar

Ocultar

Eliminar

---

# SEO

## Meta Preview Card

Permitirá visualizar cómo aparecerá una página en Google.

---

# DONACIONES

## Donation Card

---

## Suggested Amount Button

---

## Donation Success

(Fase futura)

---

# EVENTOS

## Countdown

Para eventos importantes.

---

## Guest Card

Predicadores.

Pastores.

Invitados.

---

# NUEVO AUDITORIO

## Featured Video

Video principal.

---

# UTILIDADES

## Divider

---

## Badge

---

## Chip

---

## Avatar

---

## Tooltip

---

## Accordion

---

## Collapse

---

## Spinner

---

## Skeleton

---

## Progress Bar

---

## Empty State

---

# ESTÁNDARES

Todos los componentes deberán cumplir con:

- Responsive.
- Accesibilidad.
- Reutilización.
- Tipado fuerte.
- Alto rendimiento.
- Compatibilidad móvil.
- Consistencia visual.
- Optimización.

---

# REGLA GENERAL

Antes de crear un nuevo componente deberá verificarse si ya existe uno que pueda reutilizarse.

La reutilización será siempre la primera opción.

Solo se crearán nuevos componentes cuando realmente aporten una funcionalidad distinta.

La biblioteca de componentes deberá mantenerse organizada, documentada y preparada para crecer junto con el proyecto.

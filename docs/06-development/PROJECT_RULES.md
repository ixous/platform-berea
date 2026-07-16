\# PROJECT RULES

\# Centro Cristiano Berea Website

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Este documento define las reglas oficiales que deberán respetarse durante todo el desarrollo del proyecto.

Estas reglas aplican para cualquier desarrollador, colaborador o Inteligencia Artificial que participe en el desarrollo del sitio web.

Ninguna regla deberá romperse sin una justificación técnica documentada.

\---

\# FILOSOFÍA DEL PROYECTO

El objetivo principal no es desarrollar únicamente un sitio web.

El objetivo es construir una plataforma moderna, segura, escalable y fácil de administrar que pueda servir durante muchos años a Centro Cristiano Berea.

Siempre deberá privilegiarse:

\- Simplicidad.

\- Calidad.

\- Seguridad.

\- Escalabilidad.

\- Rendimiento.

\- Mantenibilidad.

\- Excelente experiencia de usuario.

Nunca se desarrollará una solución únicamente porque sea más rápida de implementar.

Siempre deberá elegirse la solución más limpia y profesional.

\---

\# DOCUMENTACIÓN

Toda funcionalidad deberá documentarse antes de desarrollarse.

La documentación será considerada la fuente oficial del proyecto.

No deberá desarrollarse ninguna funcionalidad que no haya sido previamente aprobada y documentada.

\---

\# ARQUITECTURA

Toda nueva funcionalidad deberá respetar la arquitectura existente.

No deberán desarrollarse soluciones aisladas.

Todo módulo deberá integrarse correctamente con el resto del sistema.

No deberá existir código espagueti.

\---

\# CÓDIGO

Todo el código deberá ser:

\- Limpio.

\- Legible.

\- Reutilizable.

\- Modular.

\- Escalable.

\- Fácil de mantener.

El código deberá leerse como un libro.

\---

\# COMPONENTES

Todo componente deberá tener una única responsabilidad.

No deberán existir componentes gigantes.

Cuando un componente crezca demasiado deberá dividirse.

\---

\# REUTILIZACIÓN

Nunca deberá duplicarse código.

Si una funcionalidad puede reutilizarse deberá convertirse en un componente compartido.

\---

\# TYPESCRIPT

No utilizar:

any

excepto cuando exista una justificación documentada.

Siempre deberán definirse tipos claros.

\---

\# VALIDACIONES

Toda información recibida deberá validarse.

Nunca deberá confiarse en información enviada por el cliente.

Todas las validaciones importantes deberán ejecutarse también en el servidor.

\---

\# SEGURIDAD

La seguridad será prioridad desde el primer día.

Nunca deberán almacenarse secretos en el código fuente.

Nunca deberán exponerse variables sensibles.

Toda información sensible deberá protegerse adecuadamente.

\---

\# CONTRASEÑAS

Las contraseñas nunca deberán almacenarse en texto plano.

Siempre deberán almacenarse utilizando algoritmos seguros.

\---

\# PERMISOS

Toda acción administrativa deberá validar permisos.

Nunca deberá mostrarse información para la cual el usuario no tenga autorización.

\---

\# BASE DE DATOS

No duplicar información.

Mantener relaciones claras.

Utilizar claves foráneas.

Utilizar índices cuando sean necesarios.

Mantener la base de datos normalizada.

\---

\# SOFT DELETE

Siempre que sea posible utilizar eliminación lógica.

Evitar eliminar información definitivamente.

\---

\# AUDITORÍA

Las acciones importantes deberán registrarse.

Ejemplos:

Crear

Editar

Eliminar

Publicar

Archivar

Restaurar

Configuraciones

Usuarios

Permisos

\---

\# MULTIMEDIA

Nunca almacenar imágenes o videos directamente en la base de datos.

La base de datos únicamente almacenará referencias.

\---

\# IMÁGENES

Toda imagen deberá optimizarse automáticamente.

Generar formatos modernos.

Generar miniaturas.

Reducir tamaño sin pérdida visual significativa.

\---

\# VIDEOS

Todo video deberá procesarse automáticamente.

Nunca mostrar archivos pesados directamente.

El visitante siempre deberá recibir una versión optimizada.

\---

\# RENDIMIENTO

Toda decisión deberá considerar el rendimiento.

Evitar consultas innecesarias.

Evitar renderizados innecesarios.

Optimizar recursos.

Priorizar dispositivos móviles.

\---

\# SEO

Todas las páginas deberán construirse pensando en SEO.

Toda página deberá permitir administrar:

Título

Descripción

Imagen

URL

Metadatos

\---

\# ACCESIBILIDAD

Todo componente deberá cumplir buenas prácticas de accesibilidad.

Utilizar etiquetas semánticas.

Mantener contraste adecuado.

Permitir navegación mediante teclado.

\---

\# RESPONSIVE

Todo deberá funcionar correctamente en:

Desktop

Tablet

Móvil

No se aceptarán diseños exclusivos para escritorio.

\---

\# CMS

Todo contenido deberá administrarse desde el Panel Administrativo.

Nunca depender del desarrollador para modificar contenido.

\---

\# CONSISTENCIA

Todos los formularios deberán mantener el mismo diseño.

Todos los botones deberán mantener el mismo comportamiento.

Todos los modales deberán seguir el mismo patrón.

Todos los listados deberán seguir el mismo estilo.

\---

\# EXPERIENCIA DE USUARIO

El usuario deberá comprender fácilmente qué hacer.

Reducir clics innecesarios.

Mostrar mensajes claros.

Evitar interfaces complejas.

\---

\# MENSAJES

Todos los mensajes del sistema deberán ser claros.

Nunca mostrar errores técnicos al usuario final.

\---

\# REGISTROS

Toda modificación importante deberá quedar registrada.

Registrar:

Usuario

Fecha

Hora

Acción

Módulo

\---

\# DISEÑO

Todo el sitio deberá seguir un único Design System.

No deberán existir estilos diferentes entre módulos.

\---

\# CAMBIOS

Toda decisión importante deberá registrarse en:

development/DECISIONS.md

\---

\# CHANGELOG

Toda nueva funcionalidad deberá registrarse en:

development/CHANGELOG.md

\---

\# COMMITS

Utilizar Commits Semánticos.

Ejemplos:

feat:

fix:

refactor:

docs:

style:

perf:

chore:

\---

\# DEPENDENCIAS

No instalar librerías innecesarias.

Toda nueva dependencia deberá justificarse.

Preferir siempre soluciones nativas cuando sea posible.

\---

\# IA

Toda Inteligencia Artificial utilizada durante el desarrollo deberá respetar este documento.

Ninguna IA podrá modificar la arquitectura sin actualizar previamente la documentación.

\---

\# PRINCIPIO DE EXCELENCIA

Este proyecto representa el sitio web institucional de Centro Cristiano Berea.

Cada decisión deberá tomarse buscando la excelencia, la simplicidad y la calidad.

No se aceptarán soluciones improvisadas.

Todo deberá desarrollarse con el mayor cuidado posible, procurando que el resultado final sea una plataforma sólida, profesional y preparada para servir durante muchos años.

\---

\# CITA DEL PROYECTO

"Y todo lo que hagan, háganlo de corazón, como para el Señor y no para los hombres."

\*\*Colosenses 3:23\*\*

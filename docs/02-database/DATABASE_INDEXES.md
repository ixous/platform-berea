\# DATABASE INDEXES

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial de indexación de la base de datos para garantizar consultas rápidas, escalabilidad y alto rendimiento durante toda la vida útil de la plataforma.

Los índices deberán diseñarse antes del desarrollo de la base de datos para evitar problemas de rendimiento futuros.

\---

\# Filosofía

Los índices existen para acelerar las consultas, no para resolver problemas de diseño.

Cada índice deberá tener una justificación clara.

Nunca crear índices innecesarios.

\---

\# Principios

\- Priorizar lectura.

\- Minimizar duplicidad.

\- Optimizar búsquedas.

\- Optimizar filtros.

\- Optimizar ordenamientos.

\- Mantener equilibrio entre lectura y escritura.

\---

\# Tipos de Índices

La plataforma utilizará:

\- Primary Key

\- Unique Index

\- Composite Index

\- Foreign Key Index

\- Full Text Search

\- Partial Index (cuando aplique)

\---

\# Índices Primarios

Todas las tablas deberán utilizar:

UUID

Como Primary Key.

Nunca utilizar IDs autoincrementales públicos.

\---

\# Foreign Keys

Toda Foreign Key deberá estar indexada.

Ejemplo:

author\_id

event\_id

media\_id

category\_id

role\_id

user\_id

\---

\# Índices Únicos

Aplicar Unique Index a:

Usuarios

\- email

Roles

\- name

Permisos

\- slug

Ministerios

\- slug

Devocionales

\- slug

Eventos

\- slug

Páginas

\- slug

Células

\- slug

Programas

\- slug

\---

\# Índices Compuestos

Crear Composite Index cuando una consulta utilice frecuentemente múltiples columnas.

Ejemplos:

(status, published\_at)

(type, published)

(role, active)

(parent\_id, order)

(entity\_type, entity\_id)

\---

\# Publicaciones

Optimizar consultas como:

Contenido publicado

↓

Ordenado por fecha

↓

Visible al público

\---

\# Multimedia

Optimizar consultas:

entity\_type

entity\_id

relation\_type

order

\---

\# Devocionales

Optimizar:

published

published\_at

author\_id

slug

\---

\# Eventos

Optimizar:

start\_date

end\_date

published

featured

slug

\---

\# Formación Bíblica

Optimizar:

published

order

slug

\---

\# Ministerios

Optimizar:

active

order

slug

\---

\# Células

Optimizar:

active

city

meeting\_day

\---

\# Usuarios

Optimizar:

email

role

active

\---

\# Auditoría

Optimizar:

user\_id

created\_at

action

resource

\---

\# Full Text Search

Implementar búsqueda de texto para:

Devocionales.

Eventos.

Ministerios.

Programas.

Páginas.

La búsqueda deberá considerar:

Título.

Descripción.

Contenido.

\---

\# Ordenamientos

Optimizar:

created\_at

updated\_at

published\_at

order

priority

\---

\# Soft Delete

Las consultas públicas nunca deberán incluir registros eliminados.

Utilizar índices parciales cuando sea posible.

Ejemplo:

WHERE deleted\_at IS NULL

\---

\# Paginación

Toda consulta paginada deberá utilizar índices compatibles con:

ORDER BY

LIMIT

OFFSET

\---

\# Dashboard

Optimizar consultas utilizadas frecuentemente por el CMS.

Ejemplos:

Últimos eventos.

Últimos devocionales.

Contenido pendiente.

Usuarios activos.

\---

\# Estadísticas

Optimizar consultas utilizadas por:

Dashboard.

Reportes.

Auditoría.

\---

\# Consultas Prohibidas

Evitar:

SELECT \*

Sobre tablas grandes.

Siempre seleccionar únicamente las columnas necesarias.

\---

\# Índices No Permitidos

No crear índices:

Duplicados.

Sin uso.

Temporales.

Especulativos.

\---

\# Mantenimiento

Revisar periódicamente:

Índices sin uso.

Índices duplicados.

Consultas lentas.

Plan de ejecución.

\---

\# Monitoreo

Registrar:

Tiempo promedio de consultas.

Consultas lentas.

Índices utilizados.

Índices ignorados.

\---

\# Escalabilidad

La estrategia deberá soportar:

\- Decenas de miles de devocionales.

\- Miles de eventos.

\- Miles de imágenes.

\- Miles de usuarios.

\- Miles de registros de auditoría.

Sin degradación significativa.

\---

\# Beneficios

\- Consultas rápidas.

\- Menor carga en Neon.

\- Mejor experiencia de usuario.

\- Menor consumo de recursos.

\- Mayor escalabilidad.

\---

\# Restricciones

No crear índices automáticamente sin analizar su impacto.

Toda modificación deberá documentarse en:

development/DECISIONS.md

\---

\# Criterios de Aceptación

La estrategia será considerada correcta cuando:

\- Todas las consultas críticas utilicen índices adecuados.

\- Las búsquedas sean rápidas.

\- Las relaciones estén optimizadas.

\- No existan índices redundantes.

\- La plataforma mantenga un excelente rendimiento conforme crezca.

\---

\# Principio Final

Los índices deberán responder a patrones reales de uso.

Una base de datos bien indexada permitirá que Centro Cristiano Berea Platform mantenga un rendimiento consistente durante muchos años sin necesidad de rediseñar su arquitectura.

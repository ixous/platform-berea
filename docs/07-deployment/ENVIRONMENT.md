\# ENVIRONMENT

\# Centro Cristiano Berea Website

Versión: 1.0

Estado: Producción

\---

\# Objetivo

Documentar todas las variables de entorno utilizadas por el proyecto.

Nunca deberán almacenarse secretos dentro del repositorio.

\---

\# Reglas

\- Nunca subir archivos .env al repositorio.

\- Nunca compartir secretos por chat.

\- Utilizar variables distintas para desarrollo y producción.

\- Rotar secretos cuando sea necesario.

\---

\# Variables Generales

\## Aplicación

APP\_NAME

APP\_URL

NODE\_ENV

NEXT\_PUBLIC\_APP\_URL

\---

\## Base de Datos

DATABASE\_URL

DATABASE\_POOL\_URL

\---

\## Autenticación

AUTH\_SECRET

AUTH\_URL

\---

\## Multimedia

MEDIA\_STORAGE\_PROVIDER

MEDIA\_BUCKET

MEDIA\_REGION

MEDIA\_PUBLIC\_URL

\---

\## Videos

VIDEO\_PROVIDER

VIDEO\_API\_KEY

VIDEO\_WEBHOOK\_SECRET

\---

\## Donaciones

STRIPE\_SECRET\_KEY

STRIPE\_WEBHOOK\_SECRET

NEXT\_PUBLIC\_STRIPE\_KEY

\---

\## Correos

SMTP\_HOST

SMTP\_PORT

SMTP\_USER

SMTP\_PASSWORD

MAIL\_FROM

\---

\## Google Maps

GOOGLE\_MAPS\_API\_KEY

\---

\## Analítica

GOOGLE\_ANALYTICS\_ID

\---

\## Seguridad

ENCRYPTION\_KEY

JWT\_SECRET

SESSION\_SECRET

\---

\# Variables Públicas

Toda variable pública deberá iniciar con:

NEXT\_PUBLIC\_

Nunca colocar información sensible en variables públicas.

\---

\# Variables Privadas

Solo estarán disponibles en el servidor.

Nunca deberán enviarse al navegador.

\---

\# Gestión

Todas las variables deberán administrarse desde el proveedor de hosting.

Nunca desde el código.

\---

\# Rotación

Las claves sensibles deberán rotarse cuando exista sospecha de compromiso.

\---

\# Documentación

Toda nueva variable deberá agregarse inmediatamente a este documento.

\---

\# Regla General

Si una variable no está documentada aquí, no deberá utilizarse dentro del proyecto.

\# RATE LIMITING

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial de protección contra abuso, ataques automatizados y uso excesivo del sistema.

El Rate Limiting protegerá tanto el sitio público como el CMS.

\---

\# Principios

\- Secure by Default.

\- Zero Trust.

\- Protección gradual.

\- Denegación temporal.

\- Registro de incidentes.

\---

\# Tecnología

Se utilizará:

\- Upstash Redis

\- Middleware de Next.js

Toda validación deberá ejecutarse antes de llegar a la lógica de negocio.

\---

\# Recursos Protegidos

Aplicar Rate Limiting a:

\- Login.

\- Recuperación de contraseña.

\- Formulario de contacto.

\- Donaciones.

\- API pública.

\- APIs privadas.

\- Subida de archivos.

\- CMS.

\- Búsquedas.

\---

\# Estrategia

Cada endpoint tendrá su propio límite.

No existirá un límite global único.

\---

\# Login

Máximo:

5 intentos

Cada:

15 minutos

Después:

Bloqueo temporal.

\---

\# Recuperación de Contraseña

Máximo:

3 solicitudes

Cada:

30 minutos.

\---

\# Formulario de Contacto

Máximo:

5 envíos

Cada:

1 hora.

\---

\# Donaciones

Máximo:

10 solicitudes

Cada:

30 minutos.

\---

\# Subida de Imágenes

Máximo:

50 imágenes

Cada:

1 hora.

\---

\# Subida de Videos

Máximo:

10 videos

Cada:

24 horas.

\---

\# APIs Públicas

Límite configurable.

Valor inicial:

100 solicitudes

Cada minuto.

\---

\# APIs Privadas

Mayor límite.

Dependerá del rol.

\---

\# CMS

El límite dependerá del usuario autenticado.

No únicamente de la IP.

\---

\# Identificación

El sistema utilizará:

\- Usuario autenticado.

\- Dirección IP.

\- Token de sesión.

\---

\# Excepciones

Administrador General.

Podrá tener límites superiores.

Nunca ilimitados.

\---

\# Respuesta

Cuando se alcance el límite:

HTTP 429

Mensaje amigable.

Tiempo restante.

\---

\# Cabeceras

Las respuestas incluirán:

\- Límite.

\- Solicitudes restantes.

\- Tiempo para reinicio.

\---

\# Registro

Registrar:

\- Endpoint.

\- Usuario.

\- IP.

\- Fecha.

\- Hora.

\- Veces bloqueado.

\---

\# Monitoreo

Detectar:

\- Ataques.

\- Bots.

\- Fuerza bruta.

\- Spam.

\---

\# Bloqueos

Los bloqueos serán:

Temporales.

Nunca permanentes automáticamente.

\---

\# Lista Blanca

Permitir excepciones para:

\- Administradores.

\- Servicios internos.

\- Integraciones autorizadas.

\---

\# Configuración

Todos los límites deberán poder modificarse sin cambiar código.

\---

\# Seguridad

Nunca revelar información sensible cuando ocurra un bloqueo.

\---

\# Auditoría

Toda denegación deberá quedar registrada.

\---

\# Criterios de Aceptación

El sistema deberá:

\- Limitar abuso.

\- Registrar incidentes.

\- Mantener disponibilidad.

\- No afectar usuarios legítimos.

\- Permitir ajustes futuros.

\---

\# Principio Final

El Rate Limiting deberá proteger la plataforma sin afectar la experiencia de uso de los visitantes y del equipo administrativo.

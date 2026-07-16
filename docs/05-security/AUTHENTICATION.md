\# AUTHENTICATION

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir la estrategia oficial de autenticación para el Panel Administrativo (CMS).

El sitio público no requerirá autenticación.

Únicamente el CMS utilizará autenticación.

\---

\# Principios

\- Secure by Default.

\- Zero Trust.

\- Least Privilege.

\- Defense in Depth.

\---

\# Tecnología

La autenticación oficial utilizará:

\- Auth.js

\- JWT

\- Cookies Seguras

\- Neon PostgreSQL

\---

\# Acceso

El acceso al CMS estará disponible únicamente mediante:

/admin

No existirán accesos administrativos públicos adicionales.

\---

\# Inicio de Sesión

Cada usuario iniciará sesión mediante:

\- Correo electrónico.

\- Contraseña.

\---

\# Recuperación de Contraseña

El sistema permitirá:

\- Solicitar recuperación.

\- Enviar enlace temporal.

\- Restablecer contraseña.

\- Invalidar enlaces utilizados.

\---

\# Contraseñas

Las contraseñas deberán:

\- Almacenarse cifradas.

\- Nunca guardarse en texto plano.

\- Nunca mostrarse al usuario.

\- Nunca registrarse en logs.

\---

\# Requisitos de Contraseña

Configurables.

Valores iniciales:

\- Mínimo 12 caracteres.

\- Una mayúscula.

\- Una minúscula.

\- Un número.

\- Un carácter especial.

\---

\# Sesiones

Las sesiones deberán:

\- Tener expiración.

\- Renovarse automáticamente.

\- Invalidarse al cerrar sesión.

\---

\# Cierre de Sesión

Al cerrar sesión deberá:

\- Invalidarse la sesión.

\- Eliminar cookies.

\- Invalidar tokens.

\- Redirigir al Login.

\---

\# Cookies

Todas las cookies deberán:

\- HttpOnly.

\- Secure.

\- SameSite.

\- Firmadas.

\---

\# JWT

Nunca almacenar información sensible dentro del JWT.

El JWT únicamente contendrá:

\- ID Usuario.

\- Rol.

\- Estado.

\- Expiración.

\---

\# Estado de Usuario

Cada usuario podrá encontrarse en:

\- Activo.

\- Suspendido.

\- Bloqueado.

\- Eliminado.

Los usuarios suspendidos o bloqueados no podrán autenticarse.

\---

\# Intentos Fallidos

Registrar intentos fallidos.

Al superar el límite configurado:

\- Bloquear temporalmente.

\- Registrar auditoría.

\---

\# Tiempo de Bloqueo

Configurable.

Valor inicial recomendado:

15 minutos.

\---

\# Cierre Automático

Las sesiones inactivas deberán cerrarse automáticamente.

Tiempo inicial recomendado:

60 minutos.

\---

\# Dispositivos

Cada sesión deberá registrar:

\- Navegador.

\- Sistema Operativo.

\- Dirección IP.

\- Fecha.

\- Hora.

\---

\# Auditoría

Registrar:

\- Login exitoso.

\- Login fallido.

\- Logout.

\- Recuperación de contraseña.

\- Cambio de contraseña.

\- Bloqueo.

\- Desbloqueo.

\---

\# Protección

La autenticación deberá protegerse contra:

\- Fuerza bruta.

\- Credential Stuffing.

\- Session Hijacking.

\- Replay Attacks.

\---

\# HTTPS

Toda autenticación deberá realizarse exclusivamente mediante HTTPS.

\---

\# CSRF

Todo formulario de autenticación deberá protegerse contra ataques CSRF.

\---

\# Rate Limiting

Aplicar límites especialmente a:

\- Login.

\- Recuperación de contraseña.

\---

\# Futuro

La arquitectura permitirá incorporar posteriormente:

\- MFA (Autenticación Multifactor).

\- Passkeys.

\- SSO.

\- OAuth.

Sin modificar la arquitectura principal.

\---

\# Restricciones

No permitir:

\- Contraseñas débiles.

\- Sesiones permanentes.

\- Cookies inseguras.

\- Tokens expuestos.

\- Inicio de sesión sin HTTPS.

\---

\# Criterios de Aceptación

La autenticación será considerada correcta cuando:

\- Todos los accesos estén protegidos.

\- Las sesiones expiren correctamente.

\- Existan registros de auditoría.

\- Las contraseñas permanezcan cifradas.

\- Los intentos fallidos sean controlados.

\- La recuperación de contraseña sea segura.

\---

\# Principio Final

La autenticación será la primera barrera de protección del CMS y deberá garantizar que únicamente usuarios autorizados puedan acceder a la plataforma administrativa.

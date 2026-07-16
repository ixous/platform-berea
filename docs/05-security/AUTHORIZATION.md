\# AUTHORIZATION

\# Centro Cristiano Berea Platform

Versión: 1.0

Estado: Obligatorio

\---

\# Objetivo

Definir el modelo oficial de autorización del CMS.

La autorización determinará qué acciones puede realizar cada usuario dentro del sistema.

Toda autorización será controlada mediante Roles y Permisos.

\---

\# Principios

\- Least Privilege.

\- Role Based Access Control (RBAC).

\- Negación por defecto.

\- Verificación en servidor.

\- Permisos granulares.

\---

\# Roles Oficiales

\## Administrador General

Acceso total al sistema.

Puede administrar:

\- Usuarios

\- Roles

\- Configuración

\- Branding

\- Multimedia

\- Devocionales

\- Eventos

\- Ministerios

\- Formación Bíblica

\- Células

\- Donaciones

\- Auditoría

\- SEO

\- Navegación

\- Papelera

\---

\## Pastor

Puede administrar contenido pastoral.

Acceso:

\- Devocionales

\- Doctrina

\- Visión Anual

\- Eventos

\- Mensajes

\- Nuevo Auditorio

No administra usuarios ni configuración técnica.

\---

\## Multimedia

Responsable del contenido visual.

Acceso:

\- Biblioteca Multimedia

\- Eventos

\- Banners

\- Galerías

\- Videos

\- Nuevo Auditorio

\- Página de Inicio

No administra usuarios.

No administra permisos.

\---

\## Editor

Puede crear y editar contenido.

No puede publicarlo.

\---

\## Revisor

Puede revisar contenido.

Puede aprobar o rechazar.

No puede modificar configuración.

\---

\## Invitado CMS

Acceso únicamente de lectura.

\---

\# Permisos Base

Cada módulo utilizará los siguientes permisos:

\- View

\- Create

\- Edit

\- Delete

\- Publish

\- Archive

\- Restore

\- Manage

\---

\# Matriz General

| Módulo | Admin | Pastor | Multimedia | Editor | Revisor |

|---------|:----:|:------:|:----------:|:------:|:--------:|

| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |

| Usuarios | ✅ | ❌ | ❌ | ❌ | ❌ |

| Roles | ✅ | ❌ | ❌ | ❌ | ❌ |

| Configuración | ✅ | ❌ | ❌ | ❌ | ❌ |

| Multimedia | ✅ | 👁 | ✅ | 👁 | 👁 |

| Devocionales | ✅ | ✅ | 👁 | ✅ | ✅ |

| Eventos | ✅ | ✅ | ✅ | ✅ | ✅ |

| Ministerios | ✅ | ✅ | 👁 | ✅ | ✅ |

| Formación Bíblica | ✅ | ✅ | 👁 | ✅ | ✅ |

| Células | ✅ | 👁 | 👁 | ✅ | 👁 |

| Doctrina | ✅ | ✅ | 👁 | ❌ | 👁 |

| Donaciones | ✅ | 👁 | ❌ | ❌ | 👁 |

| SEO | ✅ | ❌ | ❌ | ❌ | ❌ |

| Auditoría | ✅ | ❌ | ❌ | ❌ | ❌ |

Leyenda:

✅ Administración completa

👁 Solo lectura

❌ Sin acceso

\---

\# Workflow Editorial

Todo contenido seguirá el siguiente flujo:

Borrador

↓

En Revisión

↓

Aprobado

↓

Publicado

↓

Archivado

↓

Papelera

\---

\# Quién puede cambiar cada estado

\## Editor

Puede:

Crear

Editar

Enviar a revisión

\---

\## Revisor

Puede:

Aprobar

Rechazar

Devolver al editor

\---

\## Pastor

Puede:

Aprobar

Publicar

Archivar

\---

\## Administrador

Puede realizar cualquier transición.

\---

\# Publicación

Ningún Editor podrá publicar directamente.

La publicación requerirá:

\- Revisor

\- Pastor

\- Administrador

\---

\# Eliminación

Toda eliminación será Soft Delete.

La eliminación física únicamente podrá realizarla:

Administrador General.

\---

\# Papelera

Los registros eliminados permanecerán durante el período de retención.

Podrán:

\- Restaurarse.

\- Eliminarse definitivamente.

\---

\# Permisos Especiales

Solo Administrador podrá:

\- Crear usuarios.

\- Cambiar roles.

\- Configurar Stripe.

\- Configurar dominio.

\- Configurar SEO global.

\- Configurar Branding.

\- Gestionar auditoría.

\---

\# Validación

Toda autorización deberá validarse:

Frontend.

Backend.

Base de datos cuando aplique.

Nunca confiar únicamente en la interfaz.

\---

\# Registro

Toda acción protegida deberá registrarse.

Registrar:

Usuario.

Rol.

Acción.

Fecha.

Hora.

IP.

Resultado.

\---

\# Principio Final

La autenticación responde:

"¿Quién eres?"

La autorización responde:

"¿Qué puedes hacer?"

Ninguna operación del CMS podrá ejecutarse sin validar ambos procesos.

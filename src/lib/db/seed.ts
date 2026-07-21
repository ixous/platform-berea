import { eq, and } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedRoles() {
  const roles = [
    {
      name: "Super Administrator",
      description: "Acceso total al sistema. Control completo de usuarios, roles y configuración.",
    },
    {
      name: "Administrator",
      description:
        "Administración general del CMS. Gestión de contenido, usuarios y configuración.",
    },
    {
      name: "Editor",
      description: "Creación, edición y publicación de contenido en todos los módulos del CMS.",
    },
    {
      name: "Ministry Leader",
      description:
        "Gestión de ministerios, contenido multimedia y publicación de contenido propio.",
    },
    {
      name: "Viewer",
      description:
        "Acceso de solo lectura. Consulta de contenido y configuración sin capacidad de edición.",
    },
  ];

  const created: string[] = [];
  for (const role of roles) {
    const existing = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.name, role.name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.roles).values(role);
      created.push(role.name);
    }
  }

  return created;
}

async function seedPermissions() {
  const permissions = [
    {
      name: "Manage Users",
      slug: "users.manage",
      description: "Crear, editar, suspender y eliminar usuarios del CMS.",
    },
    {
      name: "Manage Roles",
      slug: "roles.manage",
      description: "Crear, editar y eliminar roles. Asignar permisos a roles.",
    },
    {
      name: "View Permissions",
      slug: "permissions.read",
      description: "Consultar la lista de permisos del sistema.",
    },
    {
      name: "Manage Settings",
      slug: "settings.manage",
      description: "Leer y modificar la configuración general del sitio.",
    },
    {
      name: "Manage Navigation",
      slug: "navigation.manage",
      description: "Crear, editar, reordenar y eliminar elementos del menú.",
    },
    {
      name: "Manage Pages",
      slug: "pages.manage",
      description: "Crear, editar, publicar y eliminar páginas institucionales.",
    },
    {
      name: "Manage Devotionals",
      slug: "devotionals.manage",
      description: "Crear, editar, publicar y eliminar devocionales.",
    },
    {
      name: "Manage Events",
      slug: "events.manage",
      description: "Crear, editar, publicar y eliminar eventos.",
    },
    {
      name: "Manage Ministries",
      slug: "ministries.manage",
      description: "Crear, editar, publicar y eliminar ministerios activos.",
    },
    {
      name: "Manage Service Ministries",
      slug: "service-ministries.manage",
      description: "Crear, editar, publicar y eliminar ministerios de servicio.",
    },
    {
      name: "Manage Biblical Programs",
      slug: "biblical-programs.manage",
      description: "Crear, editar, publicar y eliminar programas de formación.",
    },
    {
      name: "Manage Cells",
      slug: "cells.manage",
      description: "Crear, editar, publicar y eliminar células.",
    },
    {
      name: "Manage Annual Vision",
      slug: "annual-vision.manage",
      description: "Crear, editar y publicar la visión anual.",
    },
    {
      name: "Manage Auditorium",
      slug: "auditorium.manage",
      description: "Administrar el contenido del módulo del Nuevo Auditorio.",
    },
    {
      name: "Manage Donations",
      slug: "donations.manage",
      description: "Editar información y configuraciones de donaciones.",
    },
    {
      name: "Manage Contact",
      slug: "contact.manage",
      description: "Editar información de contacto institucional.",
    },
    {
      name: "Manage Media",
      slug: "media.manage",
      description: "Subir, editar, archivar y eliminar recursos multimedia.",
    },
    {
      name: "Manage Gallery",
      slug: "gallery.manage",
      description: "Crear, editar y eliminar galerías multimedia.",
    },
    {
      name: "Manage Redirects",
      slug: "redirects.manage",
      description: "Crear, editar y eliminar redirecciones.",
    },
    {
      name: "Manage SEO",
      slug: "seo.manage",
      description: "Administrar metadatos SEO de todas las entidades.",
    },
    {
      name: "View Audit Logs",
      slug: "audit.read",
      description: "Consultar el registro de auditoría del sistema.",
    },
    {
      name: "Publish Content",
      slug: "content.publish",
      description: "Publicar, despublicar y archivar contenido.",
    },
  ];

  const created: string[] = [];
  for (const perm of permissions) {
    const existing = await db
      .select()
      .from(schema.permissions)
      .where(eq(schema.permissions.slug, perm.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.permissions).values(perm);
      created.push(perm.slug);
    }
  }

  return created;
}

async function seedRolePermissions() {
  const allRoles = await db.select().from(schema.roles);
  const allPermissions = await db.select().from(schema.permissions);

  const roleMap = new Map(allRoles.map((r) => [r.name, r.id]));
  const permMap = new Map(allPermissions.map((p) => [p.slug, p.id]));

  const rolePermissionMap: Record<string, string[]> = {
    "Super Administrator": allPermissions.map((p) => p.slug),
    Administrator: allPermissions.filter((p) => p.slug !== "roles.manage").map((p) => p.slug),
    Editor: [
      "pages.manage",
      "devotionals.manage",
      "events.manage",
      "ministries.manage",
      "service-ministries.manage",
      "biblical-programs.manage",
      "cells.manage",
      "annual-vision.manage",
      "auditorium.manage",
      "donations.manage",
      "contact.manage",
      "media.manage",
      "gallery.manage",
      "redirects.manage",
      "seo.manage",
      "navigation.manage",
      "content.publish",
    ],
    "Ministry Leader": [
      "ministries.manage",
      "service-ministries.manage",
      "media.manage",
      "content.publish",
    ],
    Viewer: ["permissions.read"],
  };

  let created = 0;
  for (const [roleName, permSlugs] of Object.entries(rolePermissionMap)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;

    for (const permSlug of permSlugs) {
      const permId = permMap.get(permSlug);
      if (!permId) continue;

      const existing = await db
        .select()
        .from(schema.rolePermissions)
        .where(
          and(
            eq(schema.rolePermissions.roleId, roleId),
            eq(schema.rolePermissions.permissionId, permId)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        await db.insert(schema.rolePermissions).values({ roleId, permissionId: permId });
        created++;
      }
    }
  }

  return created;
}

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      "  ⚠ SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD no configurados. Saltando usuario admin."
    );
    return null;
  }

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return null;
  }

  const superAdminRole = await db
    .select()
    .from(schema.roles)
    .where(eq(schema.roles.name, "Super Administrator"))
    .limit(1);

  if (superAdminRole.length === 0) {
    console.log("  ⚠ Rol 'Super Administrator' no encontrado. Saltando usuario admin.");
    return null;
  }

  const hashedPassword = await hash(password, 12);
  const name = process.env.SEED_ADMIN_NAME || "Admin";

  await db.insert(schema.users).values({
    name,
    email,
    password: hashedPassword,
    roleId: superAdminRole[0].id,
    status: "active",
  });

  return email;
}

async function seedSettings() {
  const settings = [
    {
      key: "site_name",
      value: { es: "Centro Cristiano Berea" },
      description: "Nombre oficial del sitio.",
    },
    {
      key: "site_description",
      value: {
        es: "Sitio web oficial de Centro Cristiano Berea — Mexicali, Baja California, México.",
      },
      description: "Descripción por defecto del sitio.",
    },
  ];

  const created: string[] = [];
  for (const setting of settings) {
    const existing = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, setting.key))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.settings).values(setting);
      created.push(setting.key);
    }
  }

  return created;
}

async function seedNavigation() {
  const menus = [
    {
      name: "Main Menu",
      slug: "main-menu",
      description: "Menú principal de navegación del sitio.",
    },
    { name: "Footer", slug: "footer", description: "Enlaces del pie de página." },
  ];

  const created: string[] = [];
  for (const menu of menus) {
    const existing = await db
      .select()
      .from(schema.navigation)
      .where(eq(schema.navigation.slug, menu.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.navigation).values(menu);
      created.push(menu.slug);
    }
  }

  return created;
}

async function seedNavigationItems() {
  const mainMenu = await db
    .select()
    .from(schema.navigation)
    .where(eq(schema.navigation.slug, "main-menu"))
    .limit(1);

  if (mainMenu.length === 0) return 0;

  const existing = await db
    .select()
    .from(schema.navigationItems)
    .where(eq(schema.navigationItems.navigationId, mainMenu[0].id));

  if (existing.length > 0) return 0;

  const items = [
    { title: "Inicio", url: "/", linkType: "internal" as const, displayOrder: 1 },
    {
      title: "Quienes Somos",
      url: "/quienes-somos",
      linkType: "internal" as const,
      displayOrder: 2,
    },
    { title: "Doctrina", url: "/nuestra-doctrina", linkType: "internal" as const, displayOrder: 3 },
    {
      title: "Ministerios",
      url: "/ministerios-activos",
      linkType: "internal" as const,
      displayOrder: 4,
    },
    {
      title: "Formacion Biblica",
      url: "/formacion-biblica",
      linkType: "internal" as const,
      displayOrder: 5,
    },
    { title: "Celulas", url: "/celulas", linkType: "internal" as const, displayOrder: 6 },
    { title: "Devocionales", url: "/devocionales", linkType: "internal" as const, displayOrder: 7 },
    { title: "Eventos", url: "/eventos", linkType: "internal" as const, displayOrder: 8 },
    { title: "Donaciones", url: "/donaciones", linkType: "internal" as const, displayOrder: 9 },
    { title: "Contacto", url: "/contacto", linkType: "internal" as const, displayOrder: 10 },
  ];

  let created = 0;
  for (const item of items) {
    await db.insert(schema.navigationItems).values({
      ...item,
      navigationId: mainMenu[0].id,
      status: "active",
    });
    created++;
  }

  return created;
}

async function seedPages() {
  const pagesList = [
    { title: "Inicio", slug: "inicio", status: "published" as const },
    { title: "Quienes Somos", slug: "quienes-somos", status: "draft" as const },
    { title: "Nuestra Historia", slug: "nuestra-historia", status: "draft" as const },
    { title: "Nuestra Doctrina", slug: "nuestra-doctrina", status: "draft" as const },
    { title: "Ministerios Activos", slug: "ministerios-activos", status: "draft" as const },
    { title: "Ministerios de Servicio", slug: "ministerios-de-servicio", status: "draft" as const },
    { title: "Formacion Biblica", slug: "formacion-biblica", status: "draft" as const },
    { title: "Celulas", slug: "celulas", status: "draft" as const },
    { title: "Devocionales", slug: "devocionales", status: "draft" as const },
    { title: "Eventos", slug: "eventos", status: "draft" as const },
    { title: "Vision Anual", slug: "vision-anual", status: "draft" as const },
    { title: "Nuevo Auditorio Berea", slug: "nuevo-auditorio-berea", status: "draft" as const },
    { title: "Donaciones", slug: "donaciones", status: "draft" as const },
    { title: "Contacto", slug: "contacto", status: "draft" as const },
  ];

  const created: string[] = [];
  for (const page of pagesList) {
    const existing = await db
      .select()
      .from(schema.pages)
      .where(eq(schema.pages.slug, page.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.pages).values({
        ...page,
        publishedAt: page.status === "published" ? new Date() : null,
      });
      created.push(page.slug);
    }
  }

  return created;
}

async function main() {
  console.log("🌱 Iniciando seeds...\n");

  const roles = await seedRoles();
  console.log(`  Roles: ${roles.length} creados (${roles.join(", ") || "ninguno nuevo"})`);

  const permissions = await seedPermissions();
  console.log(`  Permisos: ${permissions.length} creados (${permissions.length} nuevos)`);

  const rolePerms = await seedRolePermissions();
  console.log(`  Role-Permissions: ${rolePerms} asignaciones creadas`);

  const admin = await seedAdminUser();
  console.log(`  Admin user: ${admin || "ninguno creado"}`);

  const settings = await seedSettings();
  console.log(`  Settings: ${settings.length} creados (${settings.join(", ") || "ninguno nuevo"})`);

  const nav = await seedNavigation();
  console.log(`  Navigation: ${nav.length} menus creados (${nav.join(", ") || "ninguno nuevo"})`);

  const navItems = await seedNavigationItems();
  console.log(`  Navigation Items: ${navItems} items creados`);

  const pages = await seedPages();
  console.log(`  Pages: ${pages.length} paginas creadas (${pages.length} nuevas)`);

  console.log("\n✅ Seeds completados.\n");
}

main().catch((err) => {
  console.error("❌ Error ejecutando seeds:", err);
  process.exit(1);
});

export {
  seedRoles,
  seedPermissions,
  seedRolePermissions,
  seedAdminUser,
  seedSettings,
  seedNavigation,
  seedPages,
};

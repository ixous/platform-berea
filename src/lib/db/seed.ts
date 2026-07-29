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

    if (!existing) {
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
      name: "Manage Contact Submissions",
      slug: "contact-submissions.manage",
      description: "Gestionar solicitudes de contacto recibidas.",
    },
    {
      name: "Manage Event Registrations",
      slug: "event-registrations.manage",
      description: "Gestionar registros a eventos.",
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
    {
      name: "Manage Homepage",
      slug: "homepage.manage",
      description: "Administrar el contenido de la página de inicio.",
    },
  ];

  const created: string[] = [];
  for (const perm of permissions) {
    const existing = await db
      .select()
      .from(schema.permissions)
      .where(eq(schema.permissions.slug, perm.slug))
      .limit(1);

    if (!existing) {
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
      "homepage.manage",
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
  let removed = 0;

  const expectedPairs = new Set<string>();
  for (const [roleName, permSlugs] of Object.entries(rolePermissionMap)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;

    for (const permSlug of permSlugs) {
      const permId = permMap.get(permSlug);
      if (!permId) continue;
      expectedPairs.add(`${roleId}:${permId}`);
    }
  }

  const existingRolePerms = await db.select().from(schema.rolePermissions);
  for (const rp of existingRolePerms) {
    const key = `${rp.roleId}:${rp.permissionId}`;
    if (!expectedPairs.has(key)) {
      await db
        .delete(schema.rolePermissions)
        .where(
          and(
            eq(schema.rolePermissions.roleId, rp.roleId),
            eq(schema.rolePermissions.permissionId, rp.permissionId)
          )
        );
      removed++;
    }
  }

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

      if (!existing) {
        await db.insert(schema.rolePermissions).values({ roleId, permissionId: permId });
        created++;
      }
    }
  }

  return { created, removed };
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

    if (!existing) {
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
    {
      name: "Admin Menu",
      slug: "admin-menu",
      description: "Menú de navegación del panel administrativo.",
    },
  ];

  const created: string[] = [];
  for (const menu of menus) {
    const existing = await db
      .select()
      .from(schema.navigation)
      .where(eq(schema.navigation.slug, menu.slug))
      .limit(1);

    if (!existing) {
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
      title: "Ministerios de Servicio",
      url: "/ministerios-de-servicio",
      linkType: "internal" as const,
      displayOrder: 5,
    },
    {
      title: "Formacion Biblica",
      url: "/formacion-biblica",
      linkType: "internal" as const,
      displayOrder: 6,
    },
    { title: "Celulas", url: "/celulas", linkType: "internal" as const, displayOrder: 7 },
    { title: "Devocionales", url: "/devocionales", linkType: "internal" as const, displayOrder: 8 },
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

    if (!existing) {
      await db.insert(schema.pages).values({
        ...page,
        publishedAt: page.status === "published" ? new Date() : null,
      });
      created.push(page.slug);
    }
  }

  return created;
}

async function seedAdminNavigationItems() {
  const adminMenu = await db
    .select()
    .from(schema.navigation)
    .where(eq(schema.navigation.slug, "admin-menu"))
    .limit(1);

  if (adminMenu.length === 0) return 0;

  const items = [
    { title: "Dashboard", url: "/admin", linkType: "internal" as const, displayOrder: 1 },
    {
      title: "Gestión de Contenido",
      url: "/admin/content",
      linkType: "internal" as const,
      displayOrder: 2,
    },
    {
      title: "Biblioteca Multimedia",
      url: "/admin/media",
      linkType: "internal" as const,
      displayOrder: 3,
    },
    {
      title: "Bandeja de Entrada",
      url: "/admin/contact",
      linkType: "internal" as const,
      displayOrder: 4,
    },
    {
      title: "Registros a Eventos",
      url: "/admin/registrations",
      linkType: "internal" as const,
      displayOrder: 5,
    },
  ];

  let created = 0;
  for (const item of items) {
    const existing = await db
      .select()
      .from(schema.navigationItems)
      .where(
        and(
          eq(schema.navigationItems.navigationId, adminMenu[0].id),
          eq(schema.navigationItems.title, item.title)
        )
      )
      .limit(1);

    if (!existing) {
      await db.insert(schema.navigationItems).values({
        ...item,
        navigationId: adminMenu[0].id,
        status: "active",
      });
      created++;
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
  const rpMsg = [`${rolePerms.created} asignaciones creadas`];
  if (rolePerms.removed > 0) rpMsg.push(`${rolePerms.removed} obsoletas eliminadas`);
  console.log(`  Role-Permissions: ${rpMsg.join(", ")}`);

  const admin = await seedAdminUser();
  console.log(`  Admin user: ${admin || "ninguno creado"}`);

  const settings = await seedSettings();
  console.log(`  Settings: ${settings.length} creados (${settings.join(", ") || "ninguno nuevo"})`);

  const nav = await seedNavigation();
  console.log(`  Navigation: ${nav.length} menus creados (${nav.join(", ") || "ninguno nuevo"})`);

  const navItems = await seedNavigationItems();
  console.log(`  Navigation Items: ${navItems} items creados (main-menu)`);

  const adminNavItems = await seedAdminNavigationItems();
  console.log(`  Admin Navigation Items: ${adminNavItems} items creados (admin-menu)`);

  const pages = await seedPages();
  console.log(`  Pages: ${pages.length} paginas creadas (${pages.length} nuevas)`);

  const milestones = await seedHistoryMilestones();
  console.log(`  History Milestones: ${milestones.length} creados`);

  const leaders = await seedLeaders();
  console.log(`  Leaders: ${leaders.length} creados`);

  const svcMinistries = await seedServiceMinistries();
  console.log(`  Service Ministries: ${svcMinistries.length} creados`);

  const demoUser = await seedDemoUser();
  console.log(`  Demo user: ${demoUser || "ya existe"}`);

  const seededMinistries = await seedFiveMinistries();
  console.log(`  Five Ministries: ${seededMinistries.length} creados`);

  const seededCells = await seedCells();
  console.log(`  Cells: ${seededCells.length} creados`);

  const seededPrograms = await seedBiblicalPrograms();
  console.log(`  Biblical Programs: ${seededPrograms.length} creados`);

  const seededEvents = await seedEvents();
  console.log(`  Events: ${seededEvents.length} creados`);

  const seededDevos = await seedDevotionals();
  console.log(`  Devotionals: ${seededDevos.length} creados`);

  const instPages = await seedInstitutionalPages();
  console.log(`  Institutional Pages: ${instPages.length} creados`);

  const instSections = await seedInstitutionalSections();
  console.log(`  Institutional Sections: ${instSections.length} creados`);

  const seededDoctrines = await seedDoctrines();
  console.log(`  Doctrines: ${seededDoctrines.length} creados`);

  const seededContact = await seedContact();
  console.log(`  Contact: ${seededContact ? 1 : 0} configurado`);

  const seededDonations = await seedDonations();
  console.log(`  Donations: ${seededDonations ? 1 : 0} configurado`);

  const homepage = await seedHomepageData();
  console.log(
    `  Homepage: settings=${homepage.settings ? 1 : 0}, sections=${homepage.sections}, services=${homepage.services}`
  );

  console.log("\n✅ Seeds completados.\n");
}

main().catch((err) => {
  console.error("❌ Error ejecutando seeds:", err);
  process.exit(1);
});

async function seedHistoryMilestones() {
  const existing = await db
    .select({ id: schema.historyMilestones.id })
    .from(schema.historyMilestones)
    .limit(1);
  if (existing.length > 0) return [];

  const milestones = [
    {
      year: "2010",
      title: "Fundación",
      description:
        "Centro Cristiano Berea nace con una visión clara: ser una iglesia fundamentada en la Palabra de Dios, comprometida con la enseñanza bíblica y la formación de discípulos. Un pequeño grupo de creyentes se reúne con el deseo de ver vidas transformadas por el evangelio.",
      imageUrl: "/images/banner-quienes-somos.png",
      displayOrder: 1,
      status: "published",
    },
    {
      year: "2013",
      title: "Crecimiento y Consolidación",
      description:
        "La iglesia experimenta un crecimiento significativo. Se establecen los primeros ministerios y la congregación se fortalece. La Escuela de Líderes y la Escuela de Ministerios comienzan a formar a una nueva generación de siervos comprometidos con la obra de Dios.",
      imageUrl: "/images/banner-ministerios.png",
      displayOrder: 2,
      status: "published",
    },
    {
      year: "2016",
      title: "Expansión Ministerial",
      description:
        "Se multiplican los ministerios de servicio y alcance comunitario. Las células de discipulado se convierten en el motor de la iglesia, llegando a diferentes colonias de Mexicali con el mensaje de esperanza y amor de Cristo.",
      imageUrl: "/images/banner-formacion-biblica.png",
      displayOrder: 3,
      status: "published",
    },
    {
      year: "2020",
      title: "Fe en Tiempos de Prueba",
      description:
        "En medio de desafíos globales, la iglesia demuestra su resiliencia. La transmisión digital de servicios permite alcanzar a personas más allá de las fronteras de Mexicali. La comunidad se mantiene unida a través de la oración, los devocionales en línea y el cuidado pastoral.",
      imageUrl: "/images/banner-devocionales.png",
      displayOrder: 4,
      status: "published",
    },
    {
      year: "2024",
      title: "Una Visión de Futuro",
      description:
        "Berea continúa su caminar con una visión renovada. El proyecto del nuevo auditorio representa un paso de fe hacia el futuro. La iglesia sigue creciendo, alcanzando más vidas y preparándose para lo que Dios tiene preparado.",
      imageUrl: "/images/banner-eventos.png",
      displayOrder: 5,
      status: "published",
    },
  ];

  const created: string[] = [];
  for (const m of milestones) {
    await db.insert(schema.historyMilestones).values(m);
    created.push(m.title);
  }
  return created;
}

async function seedLeaders() {
  const existing = await db.select({ id: schema.leaders.id }).from(schema.leaders).limit(1);
  if (existing.length > 0) return [];

  const entries = [
    {
      name: "Ps. Juan Pérez",
      position: "Pastor Principal",
      biography: "Liderando la iglesia con dedicación y amor desde su fundación.",
      imageUrl: "",
      displayOrder: 1,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "Ps. María García",
      position: "Pastora Asociada",
      biography: "Apoyando el crecimiento espiritual de la congregación.",
      imageUrl: "",
      displayOrder: 2,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "Hno. Carlos López",
      position: "Líder de Alabanza",
      biography: "Guiando al equipo de adoración con pasión y excelencia.",
      imageUrl: "",
      displayOrder: 3,
      status: "published",
      publishedAt: new Date(),
    },
  ];

  const created: string[] = [];
  for (const l of entries) {
    await db.insert(schema.leaders).values(l);
    created.push(l.name);
  }
  return created;
}

async function seedServiceMinistries() {
  const existing = await db
    .select({ id: schema.serviceMinistries.id })
    .from(schema.serviceMinistries)
    .limit(1);
  if (existing.length > 0) return [];

  const entries = [
    {
      name: "Alabanza",
      slug: "alabanza",
      description:
        "Ministerio dedicado a la adoración a través de la música, guiando a la congregación en la presencia de Dios.",
      leader: "Hno. Carlos López",
      imageUrl: "",
      schedule: "Ensayos: Sábados 4:00 PM",
      location: "Templo Principal",
      displayOrder: 1,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "Niños",
      slug: "ninos",
      description:
        "Ministerio enfocado en la formación espiritual de los niños, enseñándoles los principios bíblicos de una manera divertida y creativa.",
      leader: "Hna. Laura Martínez",
      imageUrl: "",
      schedule: "Domingos 10:00 AM",
      location: "Edificio Infantil",
      displayOrder: 2,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "Multimedia",
      slug: "multimedia",
      description:
        "Ministerio responsable de la producción audiovisual, transmisión en vivo y contenido digital de la iglesia.",
      leader: "Hno. Roberto Sánchez",
      imageUrl: "",
      schedule: "Reunión mensual primer sábado",
      location: "Cabina de Sonido",
      displayOrder: 3,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "Ujieres",
      slug: "ujieres",
      description:
        "Ministerio de servicio encargado de la recepción y atención a los asistentes, asegurando un ambiente de orden y hospitalidad.",
      leader: "Hna. Patricia Torres",
      imageUrl: "",
      schedule: "Domingos 8:00 AM",
      location: "Templo Principal",
      displayOrder: 4,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "Intercesión",
      slug: "intercesion",
      description:
        "Ministerio dedicado a la oración e intercesión por la iglesia, la ciudad y las naciones.",
      leader: "Ps. Juan Pérez",
      imageUrl: "",
      schedule: "Miércoles 6:00 AM",
      location: "Sala de Oración",
      displayOrder: 5,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "Danza",
      slug: "danza",
      description:
        "Ministerio de danza dedicado a la adoración a través del movimiento, expresando nuestro amor y gratitud a Dios con todo nuestro ser.",
      leader: "",
      imageUrl: "",
      schedule: "",
      location: "",
      displayOrder: 6,
      status: "published",
      publishedAt: new Date(),
    },
  ];

  const created: string[] = [];
  for (const m of entries) {
    const [existing] = await db
      .select({ id: schema.serviceMinistries.id })
      .from(schema.serviceMinistries)
      .where(eq(schema.serviceMinistries.slug, m.slug))
      .limit(1);
    if (!existing) {
      await db.insert(schema.serviceMinistries).values(m);
      created.push(m.name);
    }
  }
  return created;
}

async function seedDemoUser() {
  const existing = await db.select({ id: schema.users.id }).from(schema.users).limit(1);
  if (existing.length > 0) return null;

  const adminRole = await db
    .select()
    .from(schema.roles)
    .where(eq(schema.roles.name, "Super Administrator"))
    .limit(1);

  if (adminRole.length === 0) return null;

  const { hash } = await import("bcryptjs");
  const hashedPassword = await hash("demo123456", 12);

  await db.insert(schema.users).values({
    name: "Content Manager",
    email: "content@berea.test",
    password: hashedPassword,
    roleId: adminRole[0].id,
    status: "active",
  });

  return "content@berea.test";
}

async function seedFiveMinistries() {
  const existing = await db.select({ id: schema.ministries.id }).from(schema.ministries).limit(1);
  if (existing.length > 0) return [];

  const entries = [
    {
      name: "Apóstoles",
      slug: "apostoles",
      description:
        "Los apóstoles son enviados por Dios para establecer fundamentos doctrinales, abrir nuevos campos ministeriales y velar por el crecimiento espiritual de la iglesia. Tienen la capacidad de levantar líderes, impartir visión y extender el Reino de Dios más allá de las fronteras locales, asegurando que cada obra esté alineada con el propósito divino.",
      leader: "Ps. Juan Pérez",
      schedule: "Reunión mensual de líderes",
      location: "Templo Principal",
      displayOrder: 1,
      status: "active",
    },
    {
      name: "Profetas",
      slug: "profetas",
      description:
        "Los profetas son portavoces de Dios que traen revelación, dirección y edificación al cuerpo de Cristo. Su ministerio fortalece la fe de la congregación al confirmar la voluntad de Dios, advertir sobre peligros espirituales y preparar los corazones para los tiempos que vienen.",
      leader: "Ps. María García",
      schedule: "Vigilias mensuales",
      location: "Templo Principal",
      displayOrder: 2,
      status: "active",
    },
    {
      name: "Evangelistas",
      slug: "evangelistas",
      description:
        "Los evangelistas tienen el don y la pasión de compartir el Evangelio con los perdidos. Su ministerio se enfoca en alcanzar almas para Cristo, organizar campañas evangelísticas y movilizar a la iglesia para cumplir la Gran Comisión.",
      leader: "Hno. Roberto Sánchez",
      schedule: "Campañas trimestrales",
      location: "Comunidad",
      displayOrder: 3,
      status: "active",
    },
    {
      name: "Pastores",
      slug: "pastores",
      description:
        "Los pastores son llamados a cuidar, guiar y pastorear el rebaño de Dios. Su corazón está puesto en el discipulado, la consejería y el acompañamiento espiritual de cada miembro. Se dedican a velar por la salud espiritual de la congregación.",
      leader: "Ps. Juan Pérez",
      schedule: "Domingos 10:00 AM",
      location: "Templo Principal",
      displayOrder: 4,
      status: "active",
    },
    {
      name: "Maestros",
      slug: "maestros",
      description:
        "Los maestros tienen la capacidad de explicar y aplicar la Palabra de Dios con claridad y profundidad. Su ministerio consiste en formar discípulos mediante la enseñanza sistemática de la Biblia, preparando a los creyentes para defender su fe.",
      leader: "Hno. Carlos López",
      schedule: "Miércoles 7:00 PM",
      location: "Salón de Conferencias",
      displayOrder: 5,
      status: "active",
    },
  ];

  const created: string[] = [];
  for (const m of entries) {
    await db.insert(schema.ministries).values(m);
    created.push(m.name);
  }
  return created;
}

async function seedCells() {
  const entries = [
    {
      name: "Célula de Fe y Esperanza",
      slug: "celula-fe-esperanza",
      type: "mixta",
      leader: "Hno. Pedro Hernández",
      meetingDay: "martes",
      meetingTime: "19:00",
      address: "Calle principal #123, Colonia Centro",
      city: "Mexicali",
      description:
        "Grupo mixto donde estudiamos la Palabra, compartimos experiencias y crecemos juntos en comunidad.",
      capacity: 15,
      status: "active",
    },
    {
      name: "Mujeres de Propósito",
      slug: "mujeres-proposito",
      type: "mujeres",
      leader: "Hna. Laura Martínez",
      meetingDay: "jueves",
      meetingTime: "10:00",
      address: "Av. Reforma #456, Colonia Nueva",
      city: "Mexicali",
      description:
        "Célula de mujeres enfocada en el crecimiento espiritual, la oración y el compañerismo.",
      capacity: 12,
      status: "active",
    },
    {
      name: "Varones de Valor",
      slug: "varones-valor",
      type: "varones",
      leader: "Hno. Carlos López",
      meetingDay: "sabado",
      meetingTime: "08:00",
      address: "Templo Principal, Salón 2",
      city: "Mexicali",
      description:
        "Grupo de varones dedicados a fortalecer su fe, su liderazgo familiar y su caminar con Dios.",
      capacity: 20,
      status: "active",
    },
  ];

  const created: string[] = [];
  for (const c of entries) {
    const [existing] = await db
      .select({ id: schema.cells.id })
      .from(schema.cells)
      .where(eq(schema.cells.slug, c.slug))
      .limit(1);
    if (!existing) {
      await db.insert(schema.cells).values(c);
      created.push(c.name);
    }
  }
  return created;
}

async function seedBiblicalPrograms() {
  const existing = await db
    .select({ id: schema.biblicalPrograms.id })
    .from(schema.biblicalPrograms)
    .limit(1);
  if (existing.length > 0) return [];

  const entries = [
    {
      name: "Escuela de Líderes",
      slug: "escuela-de-lideres",
      description:
        "Programa diseñado para formar líderes con carácter cristiano, fundamento bíblico y visión ministerial. Incluye módulos de liderazgo, administración eclesiástica, consejería y homilética.",
      instructor: "Ps. Juan Pérez",
      duration: "12 meses",
      modality: "presencial",
      schedule: "Sábados 9:00 AM - 1:00 PM",
      status: "published",
      displayOrder: 1,
    },
    {
      name: "Escuela de Ministerios",
      slug: "escuela-de-ministerios",
      description:
        "Capacitación especializada para quienes desean servir en ministerios específicos dentro de la iglesia. Con áreas de alabanza, enseñanza, intercesión y servicio.",
      instructor: "Ps. María García",
      duration: "9 meses",
      modality: "presencial",
      schedule: "Sábados 9:00 AM - 1:00 PM",
      status: "published",
      displayOrder: 2,
    },
    {
      name: "Universidad de Teología Holmes",
      slug: "universidad-teologia-holmes",
      description:
        "Formación teológica de nivel profesional, avalada por una institución reconocida internacionalmente. Programas de certificado, licenciatura y maestría en estudios teológicos.",
      instructor: "Dr. Roberto Sánchez",
      duration: "4 años",
      modality: "hibrido",
      schedule: "Coordinación directa",
      status: "published",
      displayOrder: 3,
    },
    {
      name: "Maestría en Teología",
      slug: "maestria-teologia",
      description:
        "Estudios avanzados para profundizar en el conocimiento teológico y la aplicación ministerial. Enfocado en exégesis bíblica, teología sistemática y liderazgo eclesiástico.",
      instructor: "Dr. Roberto Sánchez",
      duration: "18 meses",
      modality: "hibrido",
      schedule: "Coordinación directa",
      status: "published",
      displayOrder: 4,
    },
  ];

  const created: string[] = [];
  for (const p of entries) {
    await db.insert(schema.biblicalPrograms).values(p);
    created.push(p.name);
  }
  return created;
}

async function seedEvents() {
  const existing = await db.select({ id: schema.events.id }).from(schema.events).limit(1);
  if (existing.length > 0) return [];

  const now = new Date();
  const future = (daysFromNow: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };

  const entries = [
    {
      title: "Noche Mexicana",
      slug: "noche-mexicana",
      description:
        "Una noche llena de color, sabor y tradición mexicana. Celebraremos juntos nuestras raíces con música en vivo, bailes folclóricos, antojitos mexicanos y un ambiente de convivencia familiar. Habrá platillos típicos como pozole, tamales, tacos y aguas frescas, además de juegos tradicionales y sorpresas para todas las edades. Ven con tu familia y disfruta de una velada inolvidable donde celebramos la herencia que Dios nos ha dado como pueblo.",
      startDate: future(30),
      time: "6:00 PM",
      location: "Centro Cristiano Berea",
      eventType: "Celebración",
      status: "published",
    },
    {
      title: "Bautizmos",
      slug: "bautizmos",
      description:
        "Un día especial para celebrar la decisión de fe de aquellos que han decidido seguir a Cristo mediante el bautismo en agua. Este servicio es un momento de profundo significado espiritual, donde testigos presenciales serán edificados al ver vidas transformadas por el poder del Evangelio. Habrá testimonios, alabanzas y un ambiente de gozo celestial.",
      startDate: future(60),
      time: "11:00 AM",
      location: "Centro Cristiano Berea",
      eventType: "Servicio Especial",
      status: "published",
    },
    {
      title: "Posada Navideña",
      slug: "posada-navidena",
      description:
        "Cerramos el año con una posada llena de alegría, amor y el verdadero espíritu navideño. Habrá piñatas, aguinaldos, ponche caliente, dulces típicos y un ambiente de confraternidad que recordará a grandes y pequeños el verdadero significado de la Navidad: el nacimiento de nuestro Salvador Jesucristo.",
      startDate: future(120),
      time: "6:00 PM",
      location: "Centro Cristiano Berea",
      eventType: "Celebración",
      status: "published",
    },
  ];

  const created: string[] = [];
  for (const e of entries) {
    await db.insert(schema.events).values(e);
    created.push(e.title);
  }
  return created;
}

async function seedDevotionals() {
  const author = await db.select({ id: schema.users.id }).from(schema.users).limit(1);
  if (author.length === 0) return [];

  const authorId = author[0].id;

  const entries = [
    {
      title: "El Fundamento de Nuestra Fe",
      slug: "el-fundamento-de-nuestra-fe",
      verse:
        "Mateo 7:24 — 'Todo aquel que oye estas palabras mías y las pone en práctica, será semejante a un hombre prudente que edificó su casa sobre la roca.'",
      content:
        "La Palabra de Dios es la roca sólida sobre la cual edificamos nuestra vida espiritual. En un mundo de constantes cambios y doctrinas variables, la Biblia permanece como nuestra guía infalible y nuestra fuente de verdad eterna. Cada página nos revela el carácter de Dios, su amor por la humanidad y su plan perfecto de redención. Al meditar en las Escrituras, encontramos dirección para cada decisión, consuelo en medio de la prueba y esperanza para el futuro. Te invitamos a hacer de la lectura bíblica un hábito diario y a permitir que la Palabra transforme tu vida.",
      excerpt:
        "La Palabra de Dios es la roca sólida sobre la cual edificamos nuestra vida espiritual.",
      authorId,
      status: "published",
      publishedAt: new Date(),
    },
    {
      title: "El Poder de la Oración",
      slug: "el-poder-de-la-oracion",
      verse:
        "Filipenses 4:6-7 — 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.'",
      content:
        "La oración no es solo una práctica religiosa; es el medio por el cual nos conectamos con el Dios vivo. Es el puente que une nuestro corazón con el corazón del Padre. A través de la oración, depositamos nuestras cargas, recibimos dirección celestial y experimentamos la paz que sobrepasa todo entendimiento. La oración persistente y sincera tiene el poder de transformar circunstancias, renovar mentes y abrir puertas que parecían cerradas. No subestimes el poder de una vida de oración constante.",
      excerpt:
        "La oración no es solo una práctica religiosa; es el medio por el cual nos conectamos con el Dios vivo.",
      authorId,
      status: "published",
      publishedAt: new Date(),
    },
    {
      title: "El Gozo del Servicio",
      slug: "el-gozo-del-servicio",
      verse:
        "1 Pedro 4:10 — 'Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios.'",
      content:
        "Servir a Dios y a los demás no es una carga, sino un privilegio que trae gozo y satisfacción al alma. Cuando usamos nuestros dones y talentos para bendecir a otros, experimentamos la alegría que viene de sembrar en el Reino de Dios. El servicio desinteresado nos transforma, nos hace más parecidos a Cristo y nos permite ser parte de lo que Dios está haciendo en el mundo. Encuentra tu lugar de servicio y descubre la alegría de ser instrumento en las manos de Dios.",
      excerpt:
        "Servir a Dios y a los demás no es una carga, sino un privilegio que trae gozo y satisfacción al alma.",
      authorId,
      status: "published",
      publishedAt: new Date(),
    },
  ];

  const created: string[] = [];
  for (const d of entries) {
    const [existing] = await db
      .select({ id: schema.devotionals.id })
      .from(schema.devotionals)
      .where(eq(schema.devotionals.slug, d.slug))
      .limit(1);
    if (!existing) {
      await db.insert(schema.devotionals).values(d);
      created.push(d.title);
    }
  }
  return created;
}

async function seedHomepageData() {
  let settingsCreated = false;
  let sectionsCount = 0;
  let servicesCount = 0;

  const [existingSettings] = await db
    .select({ id: schema.homepageSettings.id })
    .from(schema.homepageSettings)
    .limit(1);
  if (!existingSettings) {
    await db.insert(schema.homepageSettings).values({
      heroTagline: "BIENVENIDOS",
      heroTitle: "Centro Cristiano Berea",
      heroSubtitle: "Un lugar para conocer a Cristo, crecer en Su Palabra y servir con propósito.",
      heroCtaText: "Conócenos",
      heroCtaHref: "/quienes-somos",
      heroSecondaryCtaText: "Horarios de Servicio",
      heroSecondaryCtaHref: "/contacto",
      heroBackgroundImage: "/images/banner-berea.png",
      heroImageAlt: "Centro Cristiano Berea",
      welcomeTitle: "Una familia que vive para Cristo",
      welcomeDescription:
        "En Centro Cristiano Berea creemos que cada persona puede encontrar esperanza, propósito y una familia espiritual en Cristo. Nuestra misión es enseñar fielmente la Palabra de Dios, formar discípulos y servir a nuestra comunidad con amor.",
      welcomeCtaText: "Quienes Somos",
      welcomeCtaHref: "/quienes-somos",
      welcomeCtaSecondaryText: "Ubicación y contacto",
      welcomeCtaSecondaryHref: "/contacto",
      ctaTitle: "Visítanos",
      ctaDescription:
        "Nos encantaría recibirte en nuestra iglesia. Ven tal como eres y descubre una comunidad que te amará y te apoyará en tu caminar con Cristo.",
      ctaButtonText: "Ubicación y horarios",
      ctaButtonHref: "/contacto",
      status: "active",
    });
    settingsCreated = true;
  }

  const sectionDefs = [
    {
      sectionKey: "welcome",
      title: "Una familia que vive para Cristo",
      visible: true,
      displayOrder: 1,
    },
    { sectionKey: "services", title: "Nuestros Servicios", visible: true, displayOrder: 2 },
    {
      sectionKey: "events",
      title: "Próximos Eventos",
      subtitle: "Mantente al día con nuestras actividades.",
      visible: true,
      displayOrder: 3,
    },
    {
      sectionKey: "ministries",
      title: "Ministerios",
      subtitle: "Descubre las diferentes áreas donde puedes servir.",
      visible: true,
      displayOrder: 4,
    },
    {
      sectionKey: "devotionals",
      title: "Devocionales",
      subtitle: "Reflexiones bíblicas para edificar tu vida espiritual.",
      visible: true,
      displayOrder: 5,
    },
    { sectionKey: "cta", title: "Visítanos", visible: true, displayOrder: 6 },
  ];

  for (const sd of sectionDefs) {
    const existing = await db
      .select({ id: schema.homepageSections.id })
      .from(schema.homepageSections)
      .where(eq(schema.homepageSections.sectionKey, sd.sectionKey))
      .limit(1);
    if (!existing) {
      await db.insert(schema.homepageSections).values(sd);
      sectionsCount++;
    }
  }

  const serviceEntries = [
    {
      title: "Servicios",
      description: "Domingo 11:00 AM",
      icon: "Sparkles",
      displayOrder: 1,
      status: "published",
    },
    {
      title: "Eventos",
      description: "Conferencias y actividades para toda la familia.",
      icon: "CalendarDays",
      displayOrder: 2,
      status: "published",
    },
    {
      title: "Devocionales",
      description: "Reflexiones bíblicas semanales para tu crecimiento.",
      icon: "BookOpen",
      displayOrder: 3,
      status: "published",
    },
    {
      title: "Ministerios",
      description: "Encuentra tu lugar para servir y crecer en la fe.",
      icon: "Church",
      displayOrder: 4,
      status: "published",
    },
  ];

  for (const svc of serviceEntries) {
    const existing = await db
      .select({ id: schema.homepageServices.id })
      .from(schema.homepageServices)
      .where(eq(schema.homepageServices.title, svc.title))
      .limit(1);
    if (!existing) {
      await db.insert(schema.homepageServices).values(svc);
      servicesCount++;
    }
  }

  const allMinistries = await db
    .select({ id: schema.ministries.id })
    .from(schema.ministries)
    .limit(5);
  for (let i = 0; i < allMinistries.length; i++) {
    await db
      .update(schema.ministries)
      .set({ featured: true, featuredOrder: i + 1 })
      .where(eq(schema.ministries.id, allMinistries[i].id));
  }

  const allEvents = await db.select({ id: schema.events.id }).from(schema.events).limit(3);
  for (let i = 0; i < allEvents.length; i++) {
    await db
      .update(schema.events)
      .set({ featured: true, featuredOrder: i + 1 })
      .where(eq(schema.events.id, allEvents[i].id));
  }

  const allDevos = await db.select({ id: schema.devotionals.id }).from(schema.devotionals).limit(3);
  for (let i = 0; i < allDevos.length; i++) {
    await db
      .update(schema.devotionals)
      .set({ featured: true, featuredOrder: i + 1 })
      .where(eq(schema.devotionals.id, allDevos[i].id));
  }

  return { settings: settingsCreated, sections: sectionsCount, services: servicesCount };
}

async function seedInstitutionalPages() {
  const entries = [
    {
      slug: "quienes-somos",
      metaTitle: "Quienes Somos",
      metaDescription:
        "Conoce la identidad, misión y visión de Centro Cristiano Berea en Mexicali, Baja California.",
      bannerTitle: "Quienes Somos",
      bannerSubtitle: "Conoce nuestra identidad, misión y visión.",
      bannerImage: "/images/banner-quienes-somos.png",
      published: true,
    },
    {
      slug: "donaciones",
      metaTitle: "Donaciones",
      metaDescription:
        "Apoya económicamente la obra de Centro Cristiano Berea. Tu ofrenda hace una diferencia.",
      bannerTitle: "Donaciones",
      bannerSubtitle: "Apoya la obra del Señor con tus ofrendas.",
      bannerImage: "/images/banner-donaciones.png",
      published: true,
    },
    {
      slug: "contacto",
      metaTitle: "Contacto",
      metaDescription:
        "Contáctanos. Información de contacto, ubicación y horarios de Centro Cristiano Berea en Mexicali, Baja California.",
      bannerTitle: "Contacto",
      bannerSubtitle: "Nos encantaría saber de ti.",
      bannerImage: "/images/banner-contacto.png",
      published: true,
    },
    {
      slug: "nuestra-doctrina",
      metaTitle: "Nuestra Doctrina",
      metaDescription:
        "Conoce las bases doctrinales de Centro Cristiano Berea. Nuestra fe está fundamentada en la Palabra de Dios.",
      bannerTitle: "Nuestra Doctrina",
      bannerSubtitle: "Los fundamentos de nuestra fe.",
      bannerImage: "/images/banner-doctrina.png",
      published: true,
    },
  ];

  const created: string[] = [];
  for (const entry of entries) {
    const existing = await db
      .select({ id: schema.institutionalPages.id })
      .from(schema.institutionalPages)
      .where(eq(schema.institutionalPages.slug, entry.slug))
      .limit(1);
    if (!existing) {
      await db.insert(schema.institutionalPages).values(entry);
      created.push(entry.slug);
    }
  }
  return created;
}

async function seedInstitutionalSections() {
  const existing = await db
    .select({ id: schema.institutionalSections.id })
    .from(schema.institutionalSections)
    .limit(1);
  if (existing.length > 0) return [];

  const entries = [
    {
      pageSlug: "quienes-somos",
      sectionKey: "identity",
      title: "Nuestra Identidad",
      content:
        "Centro Cristiano Berea es una iglesia cristiana ubicada en Mexicali, Baja California, México. Somos una comunidad de fe comprometida con la Palabra de Dios y con el amor al prójimo. Creemos en el poder transformador del Evangelio y trabajamos para que cada persona pueda experimentar una relación personal con Jesucristo.",
      displayOrder: 1,
      visible: true,
      status: "published",
    },
    {
      pageSlug: "quienes-somos",
      sectionKey: "mission",
      title: "Misión",
      content:
        "Formar discípulos de Cristo, fortalecer familias y extender el Reino de Dios en nuestra comunidad y más allá, a través de la predicación de la Palabra, la adoración genuina y el servicio amoroso. Cada miembro de nuestra congregación es equipado para cumplir el propósito que Dios ha diseñado para su vida.",
      displayOrder: 2,
      visible: true,
      status: "published",
    },
    {
      pageSlug: "quienes-somos",
      sectionKey: "vision",
      title: "Visión",
      content:
        "Ser una iglesia que impacta a Mexicali y al mundo con el mensaje de Cristo, formando líderes comprometidos, familias sólidas y una comunidad que refleje el amor de Dios en cada área de la vida. Anhelamos ver vidas transformadas, hogares restaurados y una ciudad alcanzada por el Evangelio.",
      displayOrder: 3,
      visible: true,
      status: "published",
    },
    {
      pageSlug: "quienes-somos",
      sectionKey: "values",
      title: "Valores",
      content:
        "La Palabra de Dios como fundamento de todo lo que hacemos. La oración como estilo de vida. La unidad del cuerpo de Cristo. El servicio como expresión de amor. La excelencia para la gloria de Dios. Estos valores nos guían en cada decisión y nos mantienen firmes en nuestra identidad como iglesia.",
      displayOrder: 4,
      visible: true,
      status: "published",
    },
  ];

  const created: string[] = [];
  for (const s of entries) {
    await db.insert(schema.institutionalSections).values(s);
    created.push(s.sectionKey);
  }
  return created;
}

async function seedDoctrines() {
  const existing = await db.select({ id: schema.doctrines.id }).from(schema.doctrines).limit(1);
  if (existing.length > 0) return [];

  const entries = [
    {
      title: "La Biblia",
      content:
        "Creemos que la Biblia es la Palabra de Dios, inspirada, infalible y nuestra única regla de fe y conducta.",
      bibleVerses: "2 Timoteo 3:16\n2 Pedro 1:20-21",
      displayOrder: 1,
      status: "published",
    },
    {
      title: "Dios",
      content:
        "Creemos en un solo Dios, eterno, omnipotente, omnisciente y omnipresente, que existe en tres personas: Padre, Hijo y Espíritu Santo.",
      bibleVerses: "Deuteronomio 6:4\nMateo 28:19\n2 Corintios 13:14",
      displayOrder: 2,
      status: "published",
    },
    {
      title: "Jesucristo",
      content:
        "Creemos en la deidad de Jesucristo, su nacimiento virginal, su vida sin pecado, su muerte expiatoria, su resurrección corporal y su Segunda Venida.",
      bibleVerses: "Juan 1:1-14\nFilipenses 2:5-11\nHebreos 1:1-3",
      displayOrder: 3,
      status: "published",
    },
    {
      title: "El Espíritu Santo",
      content:
        "Creemos en la persona y obra del Espíritu Santo, quien convence, regenera, santifica y capacita al creyente.",
      bibleVerses: "Juan 14:16-17\nHechos 1:8\nGálatas 5:22-23",
      displayOrder: 4,
      status: "published",
    },
    {
      title: "La Salvación",
      content: "Creemos que la salvación es por gracia mediante la fe en Jesucristo, no por obras.",
      bibleVerses: "Efesios 2:8-9\nRomanos 10:9-10\nJuan 3:16",
      displayOrder: 5,
      status: "published",
    },
    {
      title: "La Iglesia",
      content:
        "Creemos que la Iglesia es el cuerpo de Cristo, llamada a adorar, edificar y proclamar el Evangelio.",
      bibleVerses: "Efesios 1:22-23\n1 Corintios 12:12-13\nMateo 16:18",
      displayOrder: 6,
      status: "published",
    },
  ];

  const created: string[] = [];
  for (const d of entries) {
    await db.insert(schema.doctrines).values(d);
    created.push(d.title);
  }
  return created;
}

async function seedContact() {
  const existing = await db.select({ id: schema.contact.id }).from(schema.contact).limit(1);
  if (existing.length > 0) return false;

  await db.insert(schema.contact).values({
    churchName: "Centro Cristiano Berea",
    address: "C. Tercera 109, Zona Urbana Xochimilco, Mexicali, Baja California, C.P. 21380",
    phone: "686 555 6149",
    email: "centrocristianobereamxli@gmail.com",
    whatsapp: "+526865556149",
    mapUrl: "https://maps.google.com/?q=Centro+Cristiano+Berea+Mexicali",
    coordinates: JSON.stringify({ lat: 32.6634, lng: -115.4678 }),
    schedules: JSON.stringify([
      { day: "Domingo", time: "11:00 AM a 1:00 PM" },
      { day: "Miércoles", time: "Escuela de Líderes 8:00 PM" },
      { day: "Jueves", time: "Escuela de Ministerios 8:00 PM" },
    ]),
    scheduleNote: "Duración aproximada: 2 horas",
    socialMedia: JSON.stringify([
      { platform: "facebook", url: "https://facebook.com/centrocristianoberea", label: "Facebook" },
      {
        platform: "instagram",
        url: "https://instagram.com/centrocristianoberea",
        label: "Instagram",
      },
      { platform: "youtube", url: "https://youtube.com/@centrocristianoberea", label: "YouTube" },
      { platform: "tiktok", url: "https://tiktok.com/@centrocristianoberea", label: "TikTok" },
      { platform: "spotify", url: "https://open.spotify.com/...", label: "Spotify" },
      { platform: "website", url: "https://centrocristianoberea.org", label: "Sitio Web" },
    ]),
    ctaTitle: "Envíanos un mensaje",
    ctaDescription: "Completa el formulario y te responderemos a la brevedad.",
    ctaButtonText: "Enviar mensaje",
    ctaButtonHref: "#contact-form",
  });
  return true;
}

async function seedDonations() {
  const existing = await db.select({ id: schema.donations.id }).from(schema.donations).limit(1);
  if (existing.length > 0) return false;

  await db.insert(schema.donations).values({
    title: "Ofrenda con un corazón generoso",
    description:
      "Cada aportación contribuye a la obra de Dios, permitiendo que el Evangelio siga siendo predicado.",
    bankInfo: JSON.stringify([
      { bank: "BBVA", account: "1234567890", clabe: "012345678901234567" },
    ]),
    suggestedAmounts: JSON.stringify([
      { label: "$100", value: 100 },
      { label: "$200", value: 200 },
      { label: "$500", value: 500 },
    ]),
    message:
      "Tu generosidad nos ayuda a continuar compartiendo el mensaje de Jesucristo, fortaleciendo los ministerios de la iglesia y sirviendo a nuestra comunidad.",
    ctaButtonText: "Contáctanos",
    ctaButtonHref: "/contacto",
    status: "active",
  });
  return true;
}

export {
  seedRoles,
  seedPermissions,
  seedRolePermissions,
  seedAdminUser,
  seedSettings,
  seedNavigation,
  seedPages,
  seedAdminNavigationItems,
};

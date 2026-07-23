export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "date"
  | "datetime"
  | "time"
  | "url"
  | "email"
  | "select"
  | "json"
  | "image";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  placeholder?: string;
  hidden?: boolean;
}

export interface EntityDef {
  entityType: string;
  schemaTable: string;
  displayName: string;
  pluralName: string;
  permission: string;
  icon: string;
  fields: FieldDef[];
  listSearchFields: string[];
  listColumns: string[];
  softDelete: boolean;
  statusField?: string;
  statusTransitions?: Record<string, string[]>;
  singleRecord?: boolean;
  defaultSort?: { field: string; dir: "asc" | "desc" };
}

export const entityConfigs: Record<string, EntityDef> = {
  pages: {
    entityType: "pages",
    schemaTable: "pages",
    displayName: "Página",
    pluralName: "Páginas",
    permission: "pages.manage",
    icon: "FileText",
    listSearchFields: ["title", "content", "excerpt"],
    listColumns: ["title", "slug", "status", "updatedAt"],
    softDelete: false,
    statusField: "status",
    statusTransitions: {
      draft: ["published", "archived"],
      published: ["draft", "archived"],
      archived: ["draft", "published"],
    },
    defaultSort: { field: "updatedAt", dir: "desc" },
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: true,
        help: "Identificador único para la URL (ej: quienes-somos)",
      },
      {
        name: "content",
        label: "Contenido",
        type: "textarea",
        help: "Contenido HTML de la página",
      },
      { name: "excerpt", label: "Extracto", type: "textarea" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "draft", label: "Borrador" },
          { value: "published", label: "Publicado" },
          { value: "archived", label: "Archivado" },
        ],
      },
      { name: "publishedAt", label: "Fecha de publicación", type: "datetime", hidden: true },
    ],
  },

  devotionals: {
    entityType: "devotionals",
    schemaTable: "devotionals",
    displayName: "Devocional",
    pluralName: "Devocionales",
    permission: "devotionals.manage",
    icon: "BookOpen",
    listSearchFields: ["title", "verse", "content", "excerpt"],
    listColumns: ["title", "status", "authorId", "publishedAt"],
    softDelete: true,
    statusField: "status",
    statusTransitions: {
      draft: ["published", "archived"],
      published: ["draft", "archived"],
      archived: ["draft", "published"],
    },
    defaultSort: { field: "publishedAt", dir: "desc" },
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "verse", label: "Versículo", type: "textarea", help: "Cita bíblica de referencia" },
      { name: "content", label: "Contenido", type: "textarea", required: true },
      { name: "excerpt", label: "Extracto", type: "textarea" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "draft", label: "Borrador" },
          { value: "published", label: "Publicado" },
          { value: "archived", label: "Archivado" },
        ],
      },
      { name: "publishedAt", label: "Fecha de publicación", type: "datetime", hidden: true },
    ],
  },

  events: {
    entityType: "events",
    schemaTable: "events",
    displayName: "Evento",
    pluralName: "Eventos",
    permission: "events.manage",
    icon: "Calendar",
    listSearchFields: ["title", "description", "location"],
    listColumns: ["title", "startDate", "location", "status"],
    softDelete: true,
    statusField: "status",
    statusTransitions: {
      draft: ["published", "archived"],
      published: ["draft", "archived"],
      archived: ["draft", "published"],
    },
    defaultSort: { field: "startDate", dir: "desc" },
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "startDate", label: "Fecha de inicio", type: "datetime", required: true },
      { name: "endDate", label: "Fecha de fin", type: "datetime" },
      { name: "time", label: "Hora", type: "text", placeholder: "Ej: 10:00 AM" },
      { name: "location", label: "Ubicación", type: "text" },
      {
        name: "eventType",
        label: "Tipo de evento",
        type: "select",
        options: [
          { value: "servicio", label: "Servicio" },
          { value: "conferencia", label: "Conferencia" },
          { value: "comunidad", label: "Comunidad" },
          { value: "jovenes", label: "Jóvenes" },
          { value: "ninos", label: "Niños" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        name: "featured",
        label: "Destacado",
        type: "select",
        options: [
          { value: "false", label: "No" },
          { value: "true", label: "Sí" },
        ],
      },
      { name: "cost", label: "Costo", type: "text", placeholder: "Ej: Gratuito, $100 MXN" },
      { name: "capacity", label: "Capacidad", type: "number" },
      { name: "additionalInfo", label: "Información adicional", type: "textarea" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "draft", label: "Borrador" },
          { value: "published", label: "Publicado" },
          { value: "archived", label: "Archivado" },
        ],
      },
    ],
  },

  ministries: {
    entityType: "ministries",
    schemaTable: "ministries",
    displayName: "Ministerio Activo",
    pluralName: "Ministerios Activos",
    permission: "ministries.manage",
    icon: "Church",
    listSearchFields: ["name", "description", "leader"],
    listColumns: ["name", "leader", "status", "displayOrder"],
    softDelete: true,
    statusField: "status",
    statusTransitions: {
      active: ["inactive"],
      inactive: ["active"],
    },
    defaultSort: { field: "displayOrder", dir: "asc" },
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "leader", label: "Líder", type: "text" },
      { name: "schedule", label: "Horario", type: "text" },
      { name: "location", label: "Ubicación", type: "text" },
      { name: "contactInfo", label: "Información de contacto", type: "textarea" },
      { name: "displayOrder", label: "Orden", type: "number" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Activo" },
          { value: "inactive", label: "Inactivo" },
        ],
      },
    ],
  },

  serviceMinistries: {
    entityType: "serviceMinistries",
    schemaTable: "serviceMinistries",
    displayName: "Ministerio de Servicio",
    pluralName: "Ministerios de Servicio",
    permission: "service-ministries.manage",
    icon: "HeartHandshake",
    listSearchFields: ["name", "description", "leader"],
    listColumns: ["name", "leader", "status", "displayOrder"],
    softDelete: true,
    statusField: "status",
    statusTransitions: {
      active: ["inactive"],
      inactive: ["active"],
    },
    defaultSort: { field: "displayOrder", dir: "asc" },
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "leader", label: "Líder", type: "text" },
      { name: "schedule", label: "Horario", type: "text" },
      { name: "location", label: "Ubicación", type: "text" },
      { name: "contactInfo", label: "Información de contacto", type: "textarea" },
      { name: "displayOrder", label: "Orden", type: "number" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Activo" },
          { value: "inactive", label: "Inactivo" },
        ],
      },
    ],
  },

  biblicalPrograms: {
    entityType: "biblicalPrograms",
    schemaTable: "biblicalPrograms",
    displayName: "Programa Bíblico",
    pluralName: "Formación Bíblica",
    permission: "biblical-programs.manage",
    icon: "GraduationCap",
    listSearchFields: ["name", "description", "instructor"],
    listColumns: ["name", "instructor", "modality", "status"],
    softDelete: true,
    statusField: "status",
    statusTransitions: {
      draft: ["published", "archived"],
      published: ["draft", "archived"],
      archived: ["draft", "published"],
    },
    defaultSort: { field: "displayOrder", dir: "asc" },
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "instructor", label: "Instructor", type: "text" },
      { name: "duration", label: "Duración", type: "text", placeholder: "Ej: 6 meses" },
      {
        name: "modality",
        label: "Modalidad",
        type: "select",
        options: [
          { value: "presencial", label: "Presencial" },
          { value: "virtual", label: "Virtual" },
          { value: "hibrido", label: "Híbrido" },
        ],
      },
      { name: "schedule", label: "Horario", type: "text" },
      { name: "startDate", label: "Fecha de inicio", type: "date" },
      { name: "endDate", label: "Fecha de fin", type: "date" },
      { name: "requirements", label: "Requisitos", type: "textarea" },
      { name: "materials", label: "Materiales", type: "textarea" },
      { name: "displayOrder", label: "Orden", type: "number" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "draft", label: "Borrador" },
          { value: "published", label: "Publicado" },
          { value: "archived", label: "Archivado" },
        ],
      },
    ],
  },

  cells: {
    entityType: "cells",
    schemaTable: "cells",
    displayName: "Célula",
    pluralName: "Células",
    permission: "cells.manage",
    icon: "Home",
    listSearchFields: ["name", "leader", "address", "city"],
    listColumns: ["name", "leader", "city", "meetingDay", "status"],
    softDelete: true,
    statusField: "status",
    statusTransitions: {
      active: ["inactive"],
      inactive: ["active"],
    },
    defaultSort: { field: "name", dir: "asc" },
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      {
        name: "type",
        label: "Tipo",
        type: "select",
        options: [
          { value: "mixta", label: "Mixta" },
          { value: "mujeres", label: "Mujeres" },
          { value: "varones", label: "Varones" },
          { value: "jovenes", label: "Jóvenes" },
          { value: "ninos", label: "Niños" },
          { value: "matrimonios", label: "Matrimonios" },
        ],
      },
      { name: "leader", label: "Líder", type: "text" },
      { name: "coLeader", label: "Co-líder", type: "text" },
      {
        name: "meetingDay",
        label: "Día de reunión",
        type: "select",
        options: [
          { value: "lunes", label: "Lunes" },
          { value: "martes", label: "Martes" },
          { value: "miercoles", label: "Miércoles" },
          { value: "jueves", label: "Jueves" },
          { value: "viernes", label: "Viernes" },
          { value: "sabado", label: "Sábado" },
          { value: "domingo", label: "Domingo" },
        ],
      },
      { name: "meetingTime", label: "Hora de reunión", type: "time", placeholder: "Ej: 19:00" },
      { name: "address", label: "Dirección", type: "text" },
      { name: "city", label: "Ciudad", type: "text" },
      { name: "locationMap", label: "Mapa (URL)", type: "url" },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "capacity", label: "Capacidad", type: "number" },
      { name: "additionalInfo", label: "Información adicional", type: "textarea" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Activo" },
          { value: "inactive", label: "Inactivo" },
        ],
      },
    ],
  },

  annualVision: {
    entityType: "annualVision",
    schemaTable: "annualVision",
    displayName: "Visión Anual",
    pluralName: "Visión Anual",
    permission: "annual-vision.manage",
    icon: "Eye",
    listSearchFields: ["name", "verse", "description"],
    listColumns: ["name", "year", "status"],
    softDelete: false,
    statusField: "status",
    statusTransitions: {
      draft: ["published", "archived"],
      published: ["draft", "archived"],
      archived: ["draft", "published"],
    },
    defaultSort: { field: "year", dir: "desc" },
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "verse", label: "Versículo", type: "textarea" },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "year", label: "Año", type: "number", required: true },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "draft", label: "Borrador" },
          { value: "published", label: "Publicado" },
          { value: "archived", label: "Archivado" },
        ],
      },
    ],
  },

  auditorium: {
    entityType: "auditorium",
    schemaTable: "auditorium",
    displayName: "Auditorio",
    pluralName: "Auditorio",
    permission: "auditorium.manage",
    icon: "Building",
    listSearchFields: ["title", "description"],
    listColumns: ["title", "status"],
    softDelete: false,
    statusField: "status",
    singleRecord: true,
    defaultSort: { field: "updatedAt", dir: "desc" },
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "videoUrl", label: "Video (URL)", type: "url", placeholder: "https://..." },
      { name: "thumbnailUrl", label: "Imagen (URL)", type: "image" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Activo" },
          { value: "inactive", label: "Inactivo" },
        ],
      },
    ],
  },

  donations: {
    entityType: "donations",
    schemaTable: "donations",
    displayName: "Donación",
    pluralName: "Donaciones",
    permission: "donations.manage",
    icon: "Heart",
    listSearchFields: ["title", "description"],
    listColumns: ["title", "status"],
    softDelete: false,
    statusField: "status",
    singleRecord: true,
    defaultSort: { field: "updatedAt", dir: "desc" },
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
      {
        name: "bankInfo",
        label: "Información bancaria (JSON)",
        type: "json",
        help: 'Formato: [{"bank":"Banco","account":"1234","clabe":"..."}]',
      },
      {
        name: "suggestedAmounts",
        label: "Montos sugeridos (JSON)",
        type: "json",
        help: 'Formato: [{"label":"$100","value":100}]',
      },
      { name: "message", label: "Mensaje", type: "textarea" },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Activo" },
          { value: "inactive", label: "Inactivo" },
        ],
      },
    ],
  },

  contact: {
    entityType: "contact",
    schemaTable: "contact",
    displayName: "Contacto",
    pluralName: "Contacto",
    permission: "contact.manage",
    icon: "Phone",
    listSearchFields: ["address", "email", "phone"],
    listColumns: ["address", "phone", "email"],
    softDelete: false,
    singleRecord: true,
    defaultSort: { field: "updatedAt", dir: "desc" },
    fields: [
      { name: "address", label: "Dirección", type: "text" },
      { name: "phone", label: "Teléfono", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "whatsapp", label: "WhatsApp", type: "text", placeholder: "+52..." },
      { name: "mapUrl", label: "Google Maps (URL)", type: "url" },
      {
        name: "schedules",
        label: "Horarios (JSON)",
        type: "json",
        help: 'Formato: [{"day":"Domingo","time":"10:00 AM"}]',
      },
      {
        name: "socialMedia",
        label: "Redes sociales (JSON)",
        type: "json",
        help: 'Formato: [{"platform":"facebook","url":"..."}]',
      },
    ],
  },

  leadership: {
    entityType: "leadership",
    schemaTable: "users",
    displayName: "Líder",
    pluralName: "Liderazgo",
    permission: "users.manage",
    icon: "Users",
    listSearchFields: ["name", "email"],
    listColumns: ["name", "email", "status"],
    softDelete: false,
    statusField: "status",
    defaultSort: { field: "name", dir: "asc" },
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Activo" },
          { value: "inactive", label: "Inactivo" },
        ],
      },
    ],
  },
};

export function getEntityConfig(entityType: string): EntityDef | undefined {
  return entityConfigs[entityType];
}

export function getAllEntityConfigs(): EntityDef[] {
  return Object.values(entityConfigs);
}

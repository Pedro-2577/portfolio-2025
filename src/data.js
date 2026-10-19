export const projects = [
  {
    id: 17,
    title: 'citARme',
    slug: 'citarme',
    description: 'Producto web propio en desarrollo. En esta etapa trabajo en la experiencia de uso y la base técnica; los detalles del producto se presentarán con su lanzamiento.',
    shortDescription: 'Producto propio en desarrollo',
    image: './project-citarme.svg',
    github: null,
    live: null,
    featured: true,
    private: true,
    category: 'Proyecto propio',
    titleEn: 'citARme',
    descriptionEn: 'A personal product in development. I am shaping the user experience and technical foundation; product details will be shared after launch.',
    shortDescriptionEn: 'Personal product in development',
    categoryEn: 'Personal project',
    technologies: ['Nuxt', 'Vue.js', 'TypeScript'],
    demoType: 'development',
    startDate: '2026',
    academic: false,
    importance: 4,
  },
  {
    id: 1,
    title: 'VendoAlgo',
    slug: 'vendoalgo',
    technicalCase: {
      "es": {
        "eyebrow": "Decisiones e implementación",
        "title": "Cómo resolví estos problemas en VendoAlgo",
        "intro": "Estos son algunos de los desarrollos de los que me encargué dentro del equipo: operación en tiempo real, suscripciones, facturación y logística.",
        "linkLabel": "Ver mis casos técnicos",
        "cases": [
          {
            "id": "kanban",
            "title": "Órdenes en tiempo real entre operadores",
            "summary": "Respuesta inmediata sin perder el estado confirmado cuando dos personas actúan sobre la misma orden.",
            "tags": [
              "Laravel Reverb",
              "Mercado Pago",
              "Actualización optimista"
            ],
            "flowLabel": "Recorrido de una venta",
            "flow": [
              "Mercado Pago confirma el pago",
              "La venta ingresa al tablero",
              "Operadores sincronizados con Reverb"
            ],
            "sections": [
              {
                "title": "El problema que encontré",
                "body": "Durante las pruebas detecté conflictos frecuentes entre acciones de distintos operadores. Rechazar la operación que llegaba después y corregir la tarjeta conservaba el estado correcto, pero interrumpía el trabajo: alguien podía estar gestionando una orden que otro ya había movido."
              },
              {
                "title": "La decisión",
                "body": "Prioricé reducir la demora de sincronización para que los operadores vieran los cambios cuanto antes. Implementé una actualización optimista: la tarjeta se mueve inmediatamente en la interfaz mientras el servidor procesa la acción."
              },
              {
                "title": "Qué ocurre si dos personas actúan a la vez",
                "body": "Prevalece la primera operación aceptada por el servidor. Si la otra interfaz ya había movido la tarjeta localmente, se corrige al estado confirmado y un toast explica el conflicto. La rapidez reduce las superposiciones; el control de conflictos resuelve las que igualmente suceden."
              },
              {
                "title": "Cómo lo validé",
                "body": "Probé el comportamiento de distintas formas y coordiné acciones simultáneas con un compañero cuando la baja demora hacía difícil reproducirlas manualmente. Verificamos la sincronización, la corrección de las tarjetas y la explicación al operador."
              }
            ]
          },
          {
            "id": "suscripciones",
            "title": "Suscripciones y extras con Rebill",
            "summary": "Cobros recurrentes, módulos opcionales y bonificaciones con reglas distintas para altas y bajas.",
            "tags": [
              "Rebill",
              "Prorrateo",
              "Reglas de negocio"
            ],
            "flowLabel": "Alta de un módulo",
            "flow": [
              "El dueño elige un extra",
              "Paga el importe prorrateado",
              "Se confirma el módulo"
            ],
            "sections": [
              {
                "title": "Mi responsabilidad",
                "body": "Me encargué de la integración de Rebill para cobrar las suscripciones de los dueños de las tiendas, incluyendo las interfaces, errores, fallbacks e historial de pagos y eventos. Los pagos de los compradores usan una integración distinta con Mercado Pago, que también implementé."
              },
              {
                "title": "Las reglas que implementé",
                "items": [
                  "Al agregar un módulo, primero se paga el importe proporcional hasta la próxima renovación. El nuevo módulo se confirma después de ese pago.",
                  "Al quitar un extra, permanece activo hasta la siguiente renovación y después deja de renovarse.",
                  "Incorporé la eximición de pago desde el panel de administración central y su presentación en la tienda, con módulos bonificados e historial de cambios."
                ]
              },
              {
                "title": "Una alternativa que descarté",
                "body": "Evalué permitir que el usuario evitara el prorrateo y programara la activación para la próxima renovación. Descarté esa alternativa porque añadía estados y recorridos con poco valor para este producto. Elegí un alta inmediata condicionada al pago del prorrateo."
              },
              {
                "title": "Conexión con la facturación",
                "body": "Integré la facturación de los cobros de las suscripciones con el mismo servicio ARCA que desarrollé para VendoAlgo y otras plataformas autorizadas."
              }
            ]
          },
          {
            "id": "arca",
            "eyebrow": "Caso técnico",
            "title": "Facturación automática con ARCA",
            "intro": "Desarrollé un servicio de facturación integrado con ARCA para VendoAlgo y otras plataformas autorizadas. Después lo integré en VendoAlgo, desde la emisión automática hasta las interfaces y el tratamiento de errores.",
            "flowLabel": "Esquema de la integración",
            "flow": [
              "VendoAlgo y plataformas autorizadas",
              "Servicio de facturación",
              "ARCA"
            ],
            "sections": [
              {
                "title": "Qué necesitaba resolver",
                "body": "Permitir que distintas plataformas usaran un mismo servicio de facturación, restringiendo su consumo a las plataformas autorizadas. En VendoAlgo, ese servicio debía quedar integrado en el flujo de facturación automática."
              },
              {
                "title": "Qué desarrollé",
                "items": [
                  "El servicio de facturación con ARCA y la restricción de uso para las plataformas autorizadas.",
                  "La integración del servicio en VendoAlgo para emitir facturas automáticamente.",
                  "Las interfaces, los mensajes y el diseño responsive del flujo de facturación."
                ]
              },
              {
                "title": "Cómo responde ante un fallo",
                "body": "Cuando falla la emisión, el mensaje de error llega al feed. El usuario puede revisar el aviso y reintentar la operación estrictamente a mano: el flujo no dispara reintentos automáticos."
              },
              {
                "title": "Qué validé",
                "body": "Probé los casos de uso del servicio y su integración en VendoAlgo, incluyendo permisos, fallos, mensajes de error y recuperación manual. También revisé el comportamiento de las interfaces en móvil y distintos tamaños de pantalla."
              },
              {
                "title": "Resultado",
                "body": "Un servicio de facturación compartido, de uso restringido a las plataformas autorizadas, con emisión automática integrada en VendoAlgo y un recorrido definido para informar errores y permitir el reintento manual."
              }
            ],
            "linkLabel": "Ver caso de facturación",
            "summary": "Un servicio compartido con acceso restringido, emisión automática y recuperación manual ante fallos.",
            "tags": [
              "ARCA",
              "Integración de servicios",
              "Facturación"
            ]
          },
          {
            "id": "logistica",
            "title": "Gestión de envíos sin salir del administrador",
            "summary": "API de Correo Argentino y una automatización complementaria para operaciones que todavía exigían ir a su portal.",
            "tags": [
              "Correo Argentino",
              "Playwright",
              "Docker"
            ],
            "flowLabel": "Operación logística integrada",
            "flow": [
              "Orden en VendoAlgo",
              "API y automatización complementaria",
              "Gestión en Correo Argentino"
            ],
            "sections": [
              {
                "title": "El trabajo manual anterior",
                "body": "La API generaba el envío, pero el operador tenía que abrir el portal de Correo Argentino para confirmarlo y completar su gestión por cada orden."
              },
              {
                "title": "Qué implementé",
                "body": "Integré la API y, mientras no contábamos con la versión que cubría esas operaciones, desarrollé una automatización de navegador con Playwright, ejecutada en Docker. Investigué cómo preparar el contenedor e incorporarlo a la solución."
              },
              {
                "title": "Alcance de esa automatización",
                "body": "La solución iniciaba sesión en el portal y permitía gestionar saldo, confirmar y cancelar envíos y consultar su estado. Era una automatización complementaria, distinta de los endpoints de la API."
              },
              {
                "title": "Resultado para el operador",
                "body": "Esas operaciones quedaron integradas en VendoAlgo, reduciendo pasos manuales y evitando tener que abandonar el administrador para gestionar cada envío. Este caso describe la solución de esa etapa, sin asumir que el portal o la API actuales mantengan el mismo funcionamiento."
              }
            ]
          }
        ],
        "sections": [
          {
            "title": "Usuarios, roles y permisos",
            "body": "También integré Spatie Permission y desarrollé las interfaces para invitar o crear miembros, asignar roles y ajustar permisos individuales por función. Esto permite organizar el trabajo del equipo de cada tienda con accesos acordes a sus tareas."
          },
          {
            "title": "Mi criterio para dar una tarea por terminada",
            "items": [
              "Primero, el código debe superar las pruebas automatizadas con Pest 5.",
              "Después realizo revisión y pruebas asistidas por IA.",
              "Finalmente valido a mano los casos de uso, UX, diseño, mensajes de error, situaciones límite y recuperación. Si encuentro un problema, lo corrijo y repito las verificaciones correspondientes."
            ]
          }
        ]
      },
      "en": {
        "eyebrow": "Decisions and implementation",
        "title": "How I solved these problems at VendoAlgo",
        "intro": "Some of the features I owned within the team: real-time operations, subscriptions, invoicing and shipping.",
        "linkLabel": "View my technical cases",
        "cases": [
          {
            "id": "kanban",
            "title": "Real-time orders across operators",
            "summary": "Immediate feedback while preserving the confirmed state when two people act on the same order.",
            "tags": [
              "Laravel Reverb",
              "Mercado Pago",
              "Optimistic updates"
            ],
            "flowLabel": "Sales workflow",
            "flow": [
              "Mercado Pago confirms payment",
              "The sale enters the board",
              "Operators stay in sync with Reverb"
            ],
            "sections": [
              {
                "title": "The problem I found",
                "body": "During testing, I found frequent conflicts between actions from different operators. Rejecting the later action and correcting its card preserved the correct state, but interrupted work: someone could be handling an order that another operator had already moved."
              },
              {
                "title": "The decision",
                "body": "I focused on reducing synchronization delay so operators would see changes sooner. I implemented optimistic updates: the card moves immediately in the interface while the server processes the action."
              },
              {
                "title": "When two people act at once",
                "body": "The first operation accepted by the server takes precedence. If the other interface has already moved the card locally, it returns to the confirmed state and a toast explains the conflict. Fast updates reduce overlaps; conflict handling resolves those that still occur."
              },
              {
                "title": "How I validated it",
                "body": "I tested the behavior in several ways and coordinated simultaneous actions with a colleague when the low delay made them difficult to reproduce manually. We checked synchronization, card reconciliation and the explanation shown to the operator."
              }
            ]
          },
          {
            "id": "suscripciones",
            "title": "Subscriptions and add-ons with Rebill",
            "summary": "Recurring payments, optional modules and fee exemptions, with different rules for adding and removing features.",
            "tags": [
              "Rebill",
              "Proration",
              "Business rules"
            ],
            "flowLabel": "Adding a module",
            "flow": [
              "The owner chooses an add-on",
              "Pays the prorated amount",
              "The module is confirmed"
            ],
            "sections": [
              {
                "title": "My responsibility",
                "body": "I owned the Rebill integration for store owners' subscriptions, including interfaces, errors, fallback behavior and payment and event history. Buyers' payments use a separate Mercado Pago integration, which I also implemented."
              },
              {
                "title": "The rules I implemented",
                "items": [
                  "Adding a module requires paying the prorated amount through the next renewal date. The new module is confirmed after that payment.",
                  "Removing an add-on keeps it active until the next renewal, when it stops renewing.",
                  "I added payment exemptions through the central administration panel and their store-facing presentation, including waived module charges and a history of changes."
                ]
              },
              {
                "title": "An alternative I rejected",
                "body": "I considered allowing users to skip proration and schedule activation for the next renewal. I rejected that option because it introduced states and flows with little value for this product. I chose immediate activation conditional on payment of the prorated amount."
              },
              {
                "title": "Connecting payments to invoicing",
                "body": "I integrated subscription payment invoicing with the same ARCA service I developed for VendoAlgo and other authorized platforms."
              }
            ]
          },
          {
            "id": "arca",
            "eyebrow": "Technical case",
            "title": "Automatic invoicing with ARCA",
            "intro": "I developed an ARCA-integrated invoicing service for VendoAlgo and other authorized platforms. I then integrated it into VendoAlgo, covering automatic issuance, interfaces and error handling.",
            "flowLabel": "Integration overview",
            "flow": [
              "VendoAlgo and authorized platforms",
              "Invoicing service",
              "ARCA"
            ],
            "sections": [
              {
                "title": "The problem",
                "body": "Allow different platforms to use a shared invoicing service while restricting its use to authorized platforms. In VendoAlgo, the service needed to be integrated into the automatic invoicing workflow."
              },
              {
                "title": "What I developed",
                "items": [
                  "The ARCA invoicing service and restrictions on use by authorized platforms.",
                  "The VendoAlgo integration for automatic invoice issuance.",
                  "The interfaces, user messages and responsive design for the invoicing workflow."
                ]
              },
              {
                "title": "What happens when it fails",
                "body": "If invoice issuance fails, an error message appears in the feed. The user can review the notification and retry the operation manually. The workflow does not trigger automatic retries."
              },
              {
                "title": "What I validated",
                "body": "I tested the service's use cases and its VendoAlgo integration, including permissions, failures, error messages and manual recovery. I also reviewed how the interfaces behave on mobile and across screen sizes."
              },
              {
                "title": "Outcome",
                "body": "A shared invoicing service restricted to authorized platforms, with automatic issuance integrated into VendoAlgo and a defined flow for reporting errors and allowing manual retries."
              }
            ],
            "linkLabel": "View invoicing case",
            "summary": "A shared service with restricted access, automatic issuance and manual recovery when it fails.",
            "tags": [
              "ARCA",
              "Service integration",
              "Invoicing"
            ]
          },
          {
            "id": "logistica",
            "title": "Managing shipments inside the admin",
            "summary": "The Correo Argentino API plus complementary automation for operations that still required visiting its portal.",
            "tags": [
              "Correo Argentino",
              "Playwright",
              "Docker"
            ],
            "flowLabel": "Integrated shipping operations",
            "flow": [
              "Order in VendoAlgo",
              "API and complementary automation",
              "Operations in Correo Argentino"
            ],
            "sections": [
              {
                "title": "The previous manual workflow",
                "body": "The API created the shipment, but the operator had to open Correo Argentino's portal to confirm it and complete its management for each order."
              },
              {
                "title": "What I implemented",
                "body": "I integrated the API and, while we did not yet have the version covering those operations, built browser automation with Playwright running in Docker. I researched how to prepare the container and incorporate it into the solution."
              },
              {
                "title": "The automation's scope",
                "body": "It logged into the portal and supported balance management, shipment confirmation and cancellation, and status checks. This was complementary browser automation, separate from the API endpoints."
              },
              {
                "title": "Outcome for the operator",
                "body": "Those operations became available through VendoAlgo, reducing manual steps and the need to leave the admin for each shipment. This case describes the solution at that stage without assuming the current portal or API behaves the same way."
              }
            ]
          }
        ],
        "sections": [
          {
            "title": "Users, roles and permissions",
            "body": "I also integrated Spatie Permission and built interfaces for inviting or creating members, assigning roles and adjusting individual permissions by function. This lets each store organize its team's access around their responsibilities."
          },
          {
            "title": "My criteria for completing a task",
            "items": [
              "First, the code must pass the automated tests with Pest 5.",
              "Next, I perform AI-assisted review and testing.",
              "Finally, I manually validate use cases, UX, design, error messages, edge cases and recovery. When I find a problem, I fix it and repeat the relevant checks."
            ]
          }
        ]
      }
    },
    description: 'Plataforma para crear y gestionar tiendas online, con catálogo de productos, medios de pago, opciones de envío y personalización de la tienda.',
    shortDescription: 'Mi trabajo actual: desarrollo integral de una plataforma de e-commerce',
    image: './project-vendoalgo.jpg',
    github: null,
    live: 'https://vendoalgo.com',
    featured: true,
    private: false,
    category: 'Trabajo actual',
    titleEn: 'VendoAlgo',
    descriptionEn: 'A platform for creating and managing online stores, with product catalogs, payment methods, shipping options and store customization.',
    shortDescriptionEn: 'My current role: end-to-end development of an e-commerce platform',
    categoryEn: 'Current role',
    technologies: ['Laravel', 'PHP', 'MySQL', 'JavaScript'],
    demoType: 'live',
    startDate: '2025',
    academic: false,
    importance: 1,
    role: 'Programador full stack dentro del equipo de VendoAlgo. Desarrollo de la plataforma desde cero hasta su versión actual, con participación en frontend, backend, APIs, diseño visual, UX y marketing.',
    roleEn: 'Full-stack developer on the VendoAlgo team. Development of the platform from scratch to its current version, contributing to frontend, backend, APIs, visual design, UX and marketing.',
    highlights: ["Suscripciones con Rebill y facturación con ARCA","Órdenes en tiempo real con Reverb e integración de Mercado Pago","Integración logística con Correo Argentino, Playwright y Docker","Gestión de usuarios, roles y permisos con Spatie"],
    highlightsEn: ["Rebill subscriptions and ARCA invoicing","Real-time orders with Reverb and Mercado Pago integration","Shipping integration with Correo Argentino, Playwright and Docker","User, role and permission management with Spatie"],
    outcome: 'Una plataforma de comercio electrónico en producción que desarrollé desde cero dentro del equipo y en la que sigo trabajando actualmente.',
    outcomeEn: 'A production e-commerce platform that I developed from scratch as part of the team and continue to work on today.',
  },
  {
    id: 2,
    title: 'Kalua',
    slug: 'kalua',
    description: 'Demo conceptual de e-commerce para una marca de velas artesanales, con storefront, catálogo por categorías y carrito de compra simulado.',
    shortDescription: 'E-commerce conceptual para una marca artesanal',
    image: './project-kalua.jpg',
    github: null,
    live: 'https://pedro-2577.github.io/Kalua/',
    featured: true,
    private: true,
    category: 'Demo para cliente',
    titleEn: 'Kalua',
    descriptionEn: 'A conceptual e-commerce demo for an artisan candle brand, with a storefront, category-based catalog and simulated shopping cart.',
    shortDescriptionEn: 'Concept e-commerce storefront for an artisan brand',
    categoryEn: 'Client demo',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Firebase'],
    demoType: 'live',
    startDate: '2026',
    academic: false,
    importance: 3,
    role: 'Desarrollo frontend y diseño de interacciones',
    roleEn: 'Frontend development and interaction design',
    highlights: ['Storefront responsive', 'Filtros por categoría', 'Carrito simulado', 'Alcance de demo explícito'],
    highlightsEn: ['Responsive storefront', 'Category filtering', 'Simulated cart flow', 'Clear demo boundaries'],
    outcome: 'Una experiencia de e-commerce revisable que comunica el concepto sin implicar pagos ni pedidos reales.',
    outcomeEn: 'A reviewable e-commerce experience that communicates the concept without implying real payments or orders.',
  },
  {
    id: 3,
    title: 'WeCanAgro',
    slug: 'wecanagro',
    description: 'Rediseño frontend iniciado desde cero y llevado junto al equipo hasta una versión pública independiente, sin intervenir el sitio productivo del cliente.',
    shortDescription: 'Rediseño frontend y experiencia digital para un cliente',
    image: './project-wecanagro.jpg',
    github: null,
    live: 'https://pedro-2577.github.io/wecanagro/',
    featured: true,
    private: true,
    category: 'Proyecto profesional',
    titleEn: 'WeCanAgro',
    descriptionEn: 'A frontend redesign started from scratch and developed with the team into an independent public version, without changing the production website.',
    shortDescriptionEn: 'Frontend redesign and digital experience for a client',
    categoryEn: 'Professional project',
    technologies: ['Vue.js', 'JavaScript', 'CSS'],
    demoType: 'live',
    startDate: '2024',
    academic: false,
    importance: 2,
    role: 'Rediseño frontend y publicación en GitHub Pages',
    roleEn: 'Frontend redesign and GitHub Pages deployment',
    highlights: ['Rediseño completo del sitio público', 'Arquitectura responsive', 'Interfaz español / inglés', 'Catálogo conectado a Firebase'],
    highlightsEn: ['Full public-site redesign', 'Responsive information architecture', 'Spanish / English UI', 'Firebase-backed catalog'],
    outcome: 'Una versión independiente y revisable del trabajo frontend, separada del sitio productivo del cliente.',
    outcomeEn: 'A standalone reviewable version of the frontend work, kept separate from the client production site.',
  },
  {
    id: 4,
    title: 'Portales y Comercio Electrónico',
    slug: 'portales-comercio-electronico',
    description: 'Trabajo final académico de e-commerce con Laravel: catálogo de tecnología, carrito, compras simuladas, historial de pedidos, blog y panel administrativo.',
    shortDescription: 'Tienda de tecnología con Laravel y checkout simulado',
    image: './project-placeholder.svg',
    github: null,
    live: 'https://techstore-academic-demo.onrender.com/',
    featured: false,
    private: true,
    category: 'Proyecto académico',
    titleEn: 'Portals & E-commerce',
    descriptionEn: 'Academic e-commerce capstone built with Laravel: technology catalog, cart, simulated purchases, order history, blog and admin panel.',
    shortDescriptionEn: 'Laravel technology store with simulated checkout',
    categoryEn: 'Academic project',
    technologies: ['Laravel', 'Blade', 'PHP', 'SQLite', 'Alpine.js', 'Tailwind CSS'],
    demoType: 'php',
    startDate: '2024',
    academic: true,
    importance: 6,
  },
  {
    id: 5,
    title: 'Portfolio 2025',
    slug: 'portfolio-2025',
    description: 'Catálogo de proyectos originalmente construido con Laravel, Livewire, Alpine.js y Tailwind CSS. Actualmente migrado a una experiencia estática con Vue y Vite para publicarlo sin costos de hosting.',
    shortDescription: 'Portfolio migrado a Vue y Vite',
    image: './project-portfolio.jpg',
    github: 'https://github.com/Pedro-2577/portfolio-2025',
    live: null,
    currentSite: true,
    featured: true,
    private: false,
    category: 'Portfolio',
    titleEn: 'Portfolio 2025',
    descriptionEn: 'Project catalog originally built with Laravel, Livewire, Alpine.js and Tailwind CSS. It has since been migrated to Vue and Vite for static hosting without PHP hosting costs.',
    shortDescriptionEn: 'Portfolio migrated to Vue and Vite',
    categoryEn: 'Portfolio',
    technologies: ['Vue.js', 'Vite', 'CSS', 'GitHub Pages'],
    demoType: 'live',
    startDate: '2025',
    academic: false,
    importance: 5,
    role: 'Arquitectura, migración y publicación',
    roleEn: 'Architecture, migration and deployment',
    highlights: ['Migración de Laravel a frontend estático', 'Navegación basada en hash', 'Catálogo y filtros de proyectos', 'Deploy automatizado en Pages'],
    highlightsEn: ['Laravel-to-static migration', 'Hash-based navigation', 'Project catalog and filters', 'Automated Pages deploy'],
    outcome: 'Un portfolio accesible sin hosting PHP que conserva el contexto de cada proyecto y sus evidencias directas.',
    outcomeEn: 'A portfolio that remains accessible without PHP hosting, while preserving project context and direct evidence.',
  },
  {
    id: 6,
    title: 'Aplicaciones Híbridas',
    slug: 'aplicaciones-hibridas',
    description: 'Proyecto académico público sobre desarrollo de aplicaciones híbridas e integración con APIs.',
    shortDescription: 'Aplicaciones híbridas e integración de APIs',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/aplicaciones-hibridas-20231C-DWT4AV',
    live: 'https://pedro-2577.github.io/aplicaciones-hibridas-20231C-DWT4AV/',
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'Hybrid Applications',
    descriptionEn: 'Public academic project focused on hybrid application development and API integration.',
    shortDescriptionEn: 'Hybrid applications and API integration',
    categoryEn: 'Academic project',
    technologies: ['JavaScript', 'APIs', 'HTML', 'CSS'],
    demoType: 'static',
    startDate: '2023',
    academic: true,
  },
  {
    id: 7,
    title: 'Aplicaciones Móviles - Vue',
    slug: 'aplicaciones-moviles-vue-parcial-1',
    description: 'Proyecto público de Vue.js realizado durante una materia de aplicaciones para dispositivos móviles.',
    shortDescription: 'Aplicación móvil desarrollada con Vue.js',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/Aplicaciones-para-Dispositivos-Moviles-vue-Parcial-1',
    live: 'https://pedro-2577.github.io/Aplicaciones-para-Dispositivos-Moviles-vue-Parcial-1/',
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'Mobile Applications - Vue',
    descriptionEn: 'Public Vue.js project created for a mobile applications course.',
    shortDescriptionEn: 'Mobile application built with Vue.js',
    categoryEn: 'Academic project',
    technologies: ['Vue.js', 'JavaScript', 'CSS'],
    demoType: 'static',
    startDate: '2022',
    academic: true,
  },
  {
    id: 8,
    title: 'Aplicaciones Móviles - Vue, Parte 2',
    slug: 'aplicaciones-moviles-vue-parcial-2',
    description: 'Segundo proyecto público de Vue.js realizado durante una materia de aplicaciones para dispositivos móviles.',
    shortDescription: 'Segundo proyecto móvil con Vue.js',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/Aplicaciones-para-Dispositivos-Moviles-vue-Parcial-2',
    live: null,
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'Mobile Applications - Vue, Part 2',
    descriptionEn: 'Second public Vue.js project created for a mobile applications course.',
    shortDescriptionEn: 'Second mobile app project with Vue.js',
    categoryEn: 'Academic project',
    technologies: ['Vue.js', 'JavaScript', 'CSS'],
    demoType: 'static',
    startDate: '2022',
    academic: true,
  },
  {
    id: 9,
    title: 'Final PHP',
    slug: 'final-php',
    description: 'Aplicación pública desarrollada como trabajo final de programación, con PHP y base de datos.',
    shortDescription: 'Aplicación web con PHP y base de datos',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/Final-php',
    live: null,
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'Final PHP',
    descriptionEn: 'Public programming capstone application built with PHP and a database.',
    shortDescriptionEn: 'Web application with PHP and a database',
    categoryEn: 'Academic project',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS'],
    demoType: 'php',
    startDate: '2022',
    academic: true,
  },
  {
    id: 10,
    title: 'Aplicación del clima',
    slug: 'pwa-projects',
    description: 'Aplicación web progresiva para consultar el clima de cualquier ciudad, con geolocalización, estado actual y persistencia de la experiencia.',
    shortDescription: 'Consulta del clima en tiempo real',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/Parcial-1-PWA',
    live: 'https://pedro-2577.github.io/Parcial-1-PWA/',
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'Weather App',
    descriptionEn: 'Progressive web app for checking weather in any city, with geolocation, current conditions and a persistent user experience.',
    shortDescriptionEn: 'Real-time weather lookup',
    categoryEn: 'Academic project',
    technologies: ['JavaScript', 'PWA', 'HTML', 'CSS', 'APIs'],
    demoType: 'static',
    startDate: '2021',
    academic: true,
    role: 'Implementación frontend e integración de APIs',
    roleEn: 'Frontend implementation and API integration',
    highlights: ['Integración con Open-Meteo', 'Búsqueda con geocodificación', 'Estados accesibles para el usuario', 'Tarjeta meteorológica responsive'],
    highlightsEn: ['Open-Meteo integration', 'Geocoding search', 'Accessible status updates', 'Responsive weather card'],
    outcome: 'Una demo pública enfocada, sin API key expuesta y con un camino directo desde la búsqueda hasta los datos meteorológicos.',
    outcomeEn: 'A focused public demo with no exposed API key and a fast path from search to useful weather data.',
  },
  {
    id: 11,
    title: 'WordPress Project',
    slug: 'wordpress',
    description: 'Proyecto público de WordPress desarrollado como trabajo final de una materia.',
    shortDescription: 'Proyecto web desarrollado con WordPress',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/wordpress',
    live: null,
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'WordPress Project',
    descriptionEn: 'Public WordPress website created as a course capstone project.',
    shortDescriptionEn: 'Website built with WordPress',
    categoryEn: 'Academic project',
    technologies: ['WordPress', 'PHP', 'CSS'],
    demoType: 'php',
    startDate: '2024',
    academic: true,
  },
  {
    id: 12,
    title: 'PWA Parcial 2',
    slug: 'pwa-parcial-2',
    description: 'Aplicación web progresiva pública desplegada en Vercel como parte de la formación en aplicaciones web progresivas.',
    shortDescription: 'Aplicación web progresiva desplegada',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/parcial-2-pwa-2021',
    live: 'https://parcial-2-pwa-2021.vercel.app',
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'PWA Assignment 2',
    descriptionEn: 'Public progressive web app deployed to Vercel as part of a progressive web applications course.',
    shortDescriptionEn: 'Deployed progressive web app',
    categoryEn: 'Academic project',
    technologies: ['JavaScript', 'PWA', 'HTML', 'CSS'],
    demoType: 'live',
    startDate: '2021',
    academic: true,
  },
  {
    id: 13,
    title: 'API + Base de Datos',
    slug: 'api-base-de-datos',
    description: 'Ejercicio público de backend con Node.js, Express, rutas y persistencia de datos.',
    shortDescription: 'Backend con Node.js, Express y base de datos',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/clase-12',
    live: null,
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'API & Database',
    descriptionEn: 'Public backend exercise using Node.js, Express, routes and data persistence.',
    shortDescriptionEn: 'Node.js and Express backend with a database',
    categoryEn: 'Academic project',
    technologies: ['Node.js', 'JavaScript', 'APIs'],
    demoType: 'node',
    startDate: '2023',
    academic: true,
  },
  {
    id: 14,
    title: 'Aplicaciones Híbridas - Express',
    slug: 'aplicaciones-hibridas-express',
    description: 'Ejercicio público de aplicaciones híbridas con Node.js, Express, controladores y vistas.',
    shortDescription: 'Aplicación Express con arquitectura MVC',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/Aplicaciones_hibiridas_ejercicio_express',
    live: null,
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'Hybrid Applications - Express',
    descriptionEn: 'Public hybrid application exercise using Node.js, Express, controllers and views.',
    shortDescriptionEn: 'Express application using MVC architecture',
    categoryEn: 'Academic project',
    technologies: ['Node.js', 'Express', 'JavaScript'],
    demoType: 'node',
    startDate: '2023',
    academic: true,
  },
  {
    id: 15,
    title: 'Clientes Web',
    slug: 'clientes-web',
    description: 'Trabajo práctico público de desarrollo frontend con Vite, Tailwind CSS y JavaScript.',
    shortDescription: 'Frontend con Vite, Tailwind y JavaScript',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/tp1-clientes-web',
    live: null,
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'Web Clients',
    descriptionEn: 'Public frontend coursework built with Vite, Tailwind CSS and JavaScript.',
    shortDescriptionEn: 'Frontend built with Vite, Tailwind and JavaScript',
    categoryEn: 'Academic project',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Vite'],
    demoType: 'static',
    startDate: '2023',
    academic: true,
  },
  {
    id: 16,
    title: 'Proyecto Git',
    slug: 'proyecto-git',
    description: 'Proyecto público introductorio de HTML para practicar flujo de trabajo y publicación con Git.',
    shortDescription: 'Proyecto introductorio de HTML y Git',
    image: './project-placeholder.svg',
    github: 'https://github.com/Pedro-2577/Proyecto-Git',
    live: 'https://pedro-2577.github.io/Proyecto-Git/',
    featured: false,
    private: false,
    category: 'Proyecto académico',
    titleEn: 'Git Project',
    descriptionEn: 'Public introductory HTML project for practicing workflow and publishing with Git.',
    shortDescriptionEn: 'Introductory HTML and Git project',
    categoryEn: 'Academic project',
    technologies: ['HTML', 'CSS', 'Git'],
    demoType: 'static',
    startDate: '2023',
    academic: true,
  },
  {
    "id": 18,
    "title": "Widget Horas Insightful",
    "slug": "widget-horas-insightful",
    "description": "Extensión de Chrome que desarrollé para calcular mis horas de trabajo de forma más cómoda. Añade una calculadora flotante con un panel para configurar la jornada. Es una utilidad personal sencilla, publicada en Chrome Web Store.",
    "shortDescription": "Calculadora de horas de trabajo que hice para uso personal",
    "image": "./project-widget-horas-insightful.jpg",
    "github": null,
    "live": "https://chromewebstore.google.com/detail/widget-horas-insightful/mjgpnfcmoijpkhgmmifaoeklhmlmdklh",
    "featured": false,
    "private": false,
    "category": "Herramienta personal",
    "titleEn": "Widget Horas Insightful",
    "descriptionEn": "A Chrome extension I built to calculate my working hours more conveniently. It adds a floating calculator with a panel for configuring working hours. It is a simple personal tool published on the Chrome Web Store.",
    "shortDescriptionEn": "A working-hours calculator I built for personal use",
    "categoryEn": "Personal tool",
    "technologies": [
      "Chrome Extensions"
    ],
    "demoType": "extension",
    "startDate": "2026",
    "academic": false,
    "importance": 6,
    "role": "Desarrollo de una utilidad personal y publicación en Chrome Web Store.",
    "roleEn": "Development of a personal tool and publication on the Chrome Web Store.",
    "highlights": [
      "Calculadora de horas flotante integrada en la página",
      "Panel para configurar horas por día, días laborables y feriados",
      "Publicación accesible desde Chrome Web Store"
    ],
    "highlightsEn": [
      "Floating working-hours calculator integrated into the page",
      "Configuration panel for daily hours, working days and holidays",
      "Public listing on the Chrome Web Store"
    ],
    "outcome": "Una extensión publicada que uso para calcular mis horas de trabajo con más comodidad.",
    "outcomeEn": "A published extension that I use to calculate my working hours more conveniently."
  },
];

export const contact = {
  email: 'pedromendezcaraban@gmail.com',
  phone: '+54 9 11-5847-1048',
  whatsapp: '5491158471048',
  github: 'https://github.com/Pedro-2577',
  linkedin: 'https://www.linkedin.com/in/pedro-mendez-caraban/',
  location: 'Buenos Aires, Argentina',
};

# Plan de mejora del portfolio y evidencia técnica

Fecha: 19 de octubre de 2026.
Estado: plan preparado; implementación pendiente.
Complementa [la revisión de contratación anterior](recruiter-review-2026-10-17.md).

## Objetivo

Que la próxima revisión permita comprobar aportes individuales, decisiones técnicas, calidad y capacidad de mantener un producto, además de ver sus interfaces.

Contexto: oportunidad de recomendación interna en Mercado Libre, sin puesto, equipo ni seniority definidos. Preparar una base sólida de desarrollo de software; adaptar el énfasis cuando exista una vacante concreta. El plan no garantiza contratación ni asigna un seniority.

## Reglas de trabajo

- Evidencia antes que afirmaciones. No inventar métricas, automatizaciones, patrones, incidentes ni herramientas.
- Diferenciar experiencia aplicada, conocimientos y temas en profundización.
- Los años de proyectos independientes no equivalen automáticamente a dedicación profesional continua.
- Mantener la separación entre trabajo propio y del equipo, gestión comercial y desarrollo, automatización e IA.
- No publicar código privado, datos fiscales, credenciales, clientes ni detalles sensibles de infraestructura.
- Mantener citARme visible con alcance limitado, sin demo ni repositorio privado.
- Conservar el perfil de inglés acordado, sin atribuir certificaciones o fluidez oral no comprobadas.
- Leer el estado actual de cada repositorio antes de editar y conservar cambios de otras terminales.
- Resolver una etapa por vez y registrar validación y pendientes. No presentar este plan como trabajo terminado.

## Línea de base

Ya existe: experiencia profesional después de la landing; caso ARCA en VendoAlgo; extensión publicada; gestión de FumigAR diferenciada; CV bilingüe generado desde el perfil.

Observado el 19/10:
- El caso ARCA explica alcance y recuperación manual, pero no permite evaluar en profundidad diseño, pruebas u operación.
- El repositorio del portfolio tiene tests de rutas; el workflow revisado instala, construye y publica sin ejecutarlos.
- README básico, sin guía de pruebas o decisiones de arquitectura.
- HTML inicial con contenedor vacío y renderizado por JavaScript; algunos extractores podrían no obtener el perfil.
- La tarjeta de IA remite a actualización de precios de FumigAR, sin evidencia suficiente para atribuir ese proceso a modelos.
- El código profesional más relevante no es públicamente revisable.

## Etapa 1 — Inventario de evidencia y revisión de ARCA (prioridad principal)

Objetivo: separar lo comprobado, lo que necesita contexto y las mejoras reales.

Acciones:
- Identificar los repositorios y componentes del servicio y su integración. Verificar alcance del acceso antes de revisar.
- Revisar diseño e implementación; pedir a Pedro únicamente contexto de negocio o autoría que no pueda inferirse del código.
- Registrar para cada afirmación: evidencia interna, aportación individual/equipo, limitaciones y redacción publicable.
- Revisar autorización de plataformas, aislamiento de datos, validación de entradas, manejo de credenciales y estados de emisión.
- Investigar timeouts, respuesta perdida después de una emisión, errores de validación, concurrencia y reintentos manuales.
- Determinar qué evita duplicados y cómo se conoce el resultado de una operación incierta. No asumir que esté resuelto.
- Identificar pruebas manuales y automatizadas, registros para diagnóstico y proceso de despliegue.
- Recoger una decisión con alternativas y un resultado comprobable; si no hay métricas, usar una descripción cualitativa precisa.

Hecho confirmado: un fallo se informa en el feed y el usuario reintenta estrictamente a mano. No atribuir reintentos automáticos.

Entregable: matriz de evidencia y pendientes. Los detalles sensibles quedan fuera del repositorio público.
Criterio de cierre: poder explicar el recorrido de una emisión, permisos, fallos, pruebas y autoría, indicando explícitamente cualquier incertidumbre.

## Etapa 2 — Caso técnico público de VendoAlgo / ARCA

Depende de la etapa 1.

Contenido:
1. Problema, contexto y restricciones.
2. Responsabilidad individual y colaboración.
3. Diagrama de componentes sin infraestructura sensible.
4. Decisiones y alternativas: por qué se eligió la solución.
5. Tabla de escenarios, respuesta esperada y verificación.
6. Resultados comprobados, límites y posibles mejoras.

Ubicación: ficha de VendoAlgo, accesible directamente desde experiencia y proyectos. Mantener un resumen breve y detalle opcional. CV con una contribución concreta y enlace.

Criterio de cierre: un lector puede entender el aporte sin conocer el producto y un evaluador técnico puede formular preguntas sobre decisiones concretas. ES/EN y CV coherentes; sin exposición de datos privados.

## Etapa 3 — Calidad verificable en el portfolio

Puede avanzar independientemente de los datos privados de ARCA.

- Incorporar ejecución de los tests existentes al pipeline y documentar el comando.
- Agregar pruebas de riesgo real: navegación a proyectos, filtros, cambio de idioma y descarga del CV con nombre y contenido esperados.
- Elegir pruebas unitarias o de navegador según el comportamiento; evitar tests que solo repitan la implementación.
- Actualizar README: ejecución reproducible, arquitectura, datos del perfil, PDF, pruebas, publicación y decisiones.
- Revisar separación de responsabilidades en App.vue y dependencias heredadas; refactorizar solo cuando haya un beneficio concreto y validación.
- Verificar teclado, foco, contraste, movimiento reducido y recorridos en móvil.
- Medir rendimiento con entorno y fecha; corregir problemas relevantes sin perseguir una puntuación decorativa.

Criterio de cierre: un fallo de test bloquea la publicación; instalación, pruebas y build reproducibles; recorridos críticos funcionando; sin regresiones en servicios/precios ni cambios de otras terminales.

## Etapa 4 — Muestra pública de ingeniería actual

Primero evaluar si un repositorio existente puede representar el trabajo actual. Si no, crear una muestra independiente y acotada.

Propuesta provisional: integración de facturación con proveedor simulado, sin conexiones fiscales reales ni código del empleador.

Alcance posible, elegido según vacante y brechas:
- Contrato de API y modelo de estados.
- Autorización y aislamiento entre consumidores.
- Persistencia y validación.
- Tratamiento explícito de fallos y emisiones de resultado incierto.
- Control de operaciones repetidas.
- Pruebas de escenarios importantes, registros útiles y CI.
- README y una o dos decisiones documentadas con alternativas.

No elegir Java, Go o React solo para completar una lista. Aprovechar el stack real; si una vacante exige otra tecnología, planificar práctica y una muestra honesta en esa tecnología.
No agregar microservicios, colas o contenedores sin necesidad demostrable.

Criterio de cierre: alguien ajeno puede clonar, ejecutar y comprobar los escenarios documentados. Pedro puede explicar y modificar la implementación sin depender de un guion.

## Etapa 5 — Posicionamiento, navegación y lectura automática

- Mantener la personalidad de la landing y facilitar el acceso al caso más fuerte.
- Priorizar producto en producción, caso técnico y código verificable; reducir el peso de ejercicios introductorios en el recorrido principal, conservando el archivo académico.
- Presentar FumigAR como gestión freelance, con funciones de programación solo cuando estén comprobadas.
- Aclarar el alcance de React y de seguridad aplicada frente a la investigación ofensiva reciente.
- Revisar la tarjeta de IA: demostrar dónde interviene un modelo, qué se valida y qué ocurre si falla. Si el caso es automatización convencional, describirlo así.
- Si existe un caso real de IA publicable, explicar necesidad, integración, validación, límites y tratamiento de datos.
- Asegurar coherencia entre sitio, PDF y enlaces profesionales.
- Añadir metadatos y vista previa social; evaluar generación estática o prerenderizado para que el contenido esencial sea legible sin ejecutar JavaScript.
- Mantener encabezados, enlaces y PDF como texto extraíble. No prometer compatibilidad con todos los ATS.
- Verificar que la modalidad publicada refleje la disponibilidad real antes de una postulación híbrida.

Criterio de cierre: en una lectura breve se identifica función, experiencia y evidencia principal; un extractor sin JavaScript obtiene información útil y el PDF permite copiar texto y seguir enlaces.

## Etapa 6 — Preparación y nueva revisión independiente

- Recorrer el caso técnico con Pedro como entrevista: decisiones, alternativas, errores, pruebas y mejoras.
- Registrar temas que puede defender, temas que requieren práctica y experiencia todavía no adquirida; no convertir esto en una puntuación pública.
- Preparar ejemplos reales de colaboración, revisión de código y resolución de problemas. No inventar incidentes de producción.
- Practicar fundamentos relevantes: HTTP, autorización, SQL, transacciones, concurrencia, errores y diseño de APIs. Ajustar algoritmos y stack al proceso concreto cuando se conozca.
- Repetir evaluación desde tres perspectivas: selección inicial, revisión técnica y extracción automática.
- Comparar con la línea de base: qué afirmaciones ahora tienen evidencia y qué incertidumbres siguen abiertas.

Criterio de cierre: decisión razonada sobre encaje, límites y mejoras pendientes; ninguna garantía de contratación.

## Condiciones para la próxima revisión

- [ ] Caso ARCA con autoría, decisiones, escenarios y límites verificados.
- [ ] Acceso directo a la evidencia principal desde el recorrido de contratación.
- [ ] Código actual públicamente revisable o una limitación explícita acompañada de evidencia alternativa.
- [ ] Pruebas relevantes ejecutadas en CI y guía reproducible.
- [ ] IA, seguridad, React, fechas y resultados descritos con precisión.
- [ ] CV ES/EN coherente, legible y con enlaces correctos.
- [ ] Lectura básica sin JavaScript y vista previa social comprobadas.
- [ ] Móvil, teclado, movimiento reducido y enlaces importantes verificados.
- [ ] Pedro puede defender las decisiones técnicas publicadas.

## Orden de ejecución

Primero revisar ARCA y preparar su caso público (1–2). Después consolidar calidad del portfolio (3). Elegir la muestra pública con lo aprendido (4). Ajustar presentación y lectura automática (5), y repetir entrevista/revisión (6).

Si aparece una vacante antes, adaptar el orden a sus requisitos y compartir la evidencia ya sólida; no postergar indefinidamente la recomendación por buscar perfección.

## Referencias consultadas

Las búsquedas de frontend y backend de LinkedIn estaban cerradas al revisarlas; se usan como ejemplos de requisitos, no como oportunidades disponibles.

- [Frontend Software Engineer: React/TypeScript, pruebas y colaboración](https://ar.linkedin.com/jobs/view/frontend-software-engineer-at-mercado-libre-4375277414).
- [Backend Marketplace: APIs, calidad, sistemas distribuidos y herramientas de IA](https://ar.linkedin.com/jobs/view/backend-software-engineer-marketplace-at-mercado-libre-4383121489).
- [Portal oficial: Sr Software Engineer, plataforma de agentes](https://career.mercadolibre.com/es/positions?id=44855135&country=Argentina). Visible durante la revisión del 19/10/2026; su disponibilidad puede cambiar.

## Registro de avance

- 19/10/2026: plan documentado. Etapas pendientes.

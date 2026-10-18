# Guía de Contribución — MEUX LAB

Este documento define cómo se trabaja en el repositorio: ramas, commits, Pull
Requests, criterios de calidad y reglas de arquitectura.

**Documentos relacionados**

- `README.md`: instalación y ejecución local.
- `docs/ARCHITECTURE.md`: Factory Pattern, telemetría y capas del backend.
- `docs/TRACEABILITY.md`: matriz de trazabilidad (RF, RNF, épicas, actores, MoSCoW).

---

## 1. Resumen del flujo de trabajo

1. Elige una tarjeta del tablero (un RF, con su Issue en GitHub).
2. Actualiza `develop` y crea una rama desde ahí.
3. Programa en pasos pequeños; cada commit sigue la convención de la sección 3.
4. Sube la rama y abre un Pull Request hacia `develop`.
5. Revisa tu propio PR (pestaña _Files changed_) y marca el checklist.
6. Fusiona con _Squash and merge_ y borra la rama.
7. Cierra el Issue y mueve la tarjeta a _Completado_.

```bash
git checkout develop
git pull
git checkout -b feature/RF0008-registro-usuario
```

---

## 2. Ramas

| Rama                          | Propósito                                        | Se crea desde | Se fusiona hacia           |
| ----------------------------- | ------------------------------------------------ | ------------- | -------------------------- |
| `main`                        | Código estable: entregables y demostraciones     | —             | —                          |
| `develop`                     | Integración de todo lo terminado y probado       | `main`        | `main` (al cerrar un hito) |
| `feature/RFxxxx-nombre-corto` | Desarrollo de un requisito funcional             | `develop`     | `develop`                  |
| `fix/descripcion-corta`       | Corrección de un error                           | `develop`     | `develop`                  |
| `docs/descripcion-corta`      | Cambios solo de documentación                    | `develop`     | `develop`                  |
| `chore/descripcion-corta`     | Configuración, dependencias, herramientas        | `develop`     | `develop`                  |
| `refactor/descripcion-corta`  | Reorganizar código sin cambiar su comportamiento | `develop`     | `develop`                  |

Reglas:

- Nunca se hace push directo a `main` ni a `develop`; ambas están protegidas.
- Una rama, un propósito. Si surge algo ajeno a lo que estás haciendo, anótalo
  como Issue y atiéndelo en otra rama.
- Nombres en minúsculas, con guiones y sin acentos. En las ramas `feature/`, el
  ID del RF va primero (`RF0008`) y se conserva tal cual está en la matriz.
- Las ramas viven poco. Cuando se fusionan, se borran.
- `develop` se fusiona hacia `main` solo cuando hay algo que entregar o
  demostrar (cierre de sprint o de hito), mediante un PR y con la opción
  _Create a merge commit_ (no _Squash_), para que `main` y `develop` no
  diverjan.

---

## 3. Mensajes de commit

Se usa [Conventional Commits](https://www.conventionalcommits.org/) con la
descripción en ingles:

```
tipo(alcance): descripción en infinitivo (RFxxxx)
```

**Tipos**

| Tipo       | Cuándo usarlo                                  |
| ---------- | ---------------------------------------------- |
| `feat`     | Nueva funcionalidad (normalmente un RF)        |
| `fix`      | Corrección de un error                         |
| `docs`     | Solo documentación                             |
| `style`    | Formato sin cambio de lógica (espacios, comas) |
| `refactor` | Reorganización sin cambio de comportamiento    |
| `test`     | Agregar o corregir pruebas                     |
| `chore`    | Configuración, dependencias, herramientas      |
| `ci`       | Pipeline de integración continua               |

**Alcances** (alineados con las épicas): `core`, `projects`, `orchestrator`,
`participant`, `telemetry`, `support`. Para cambios transversales:
`readme`, `deps`, `ci`, `config`. El alcance es opcional si el cambio no
pertenece a ninguno.

**Reglas**

- Descripción en minúscula, sin punto final, máximo 72 caracteres.
- Verbo en infinitivo: _implementar_, _corregir_, _agregar_, _actualizar_.
- Si el commit implementa un requisito, incluye su ID entre paréntesis.
- Un commit debe poder explicarse en una frase. Si no, probablemente son dos.

**Ejemplos**

```
feat(core): implement user registration form (RF0008)
feat(telemetry): open WebSocket channel per participant session (RF00193)
fix(participant): fix focus order in keyboard shortcuts
docs(readme): update project structure to apps/
chore: configure prettier, husky, and lint-staged
```

> Los hooks locales validan formato y lint, pero **no** el texto del mensaje.
> Esta convención se sostiene por disciplina y se revisa en el PR.

---

## 4. Pull Requests

- Todo cambio llega a `develop` mediante un PR, incluidos los de un solo archivo.
- **El título del PR sigue la convención de commits** (sección 3). Como se
  fusiona con _Squash and merge_, ese título se convierte en el único commit
  que queda en `develop`, y mantiene el historial limpio y legible.
- Incluye el ID del RF en el título y enlaza el Issue en la descripción
  (por ejemplo `Refs #47`).
- **Sobre cerrar Issues:** `Closes #47` cierra el Issue automáticamente solo
  cuando el PR se fusiona en la rama por defecto (`main`). Como los PR de
  trabajo van a `develop`, el Issue se cierra manualmente al fusionar, o con la
  automatización del tablero cuando la configuremos.
- Usa el ID **numérico del Issue** (`#47`), no el ID del RF: GitHub no entiende
  `#RF0008`. El ID del RF va en el título del Issue y del PR para poder buscarlo.
- PR pequeños: un RF o una parte clara de él. Si un RF es grande, divídelo.
- Rellena el checklist de la plantilla del PR antes de fusionar.

**Revisión mientras se trabaja en solitario.** La rama no exige aprobaciones
porque nadie más puede darlas. En su lugar, antes de fusionar lee tu propio
diff completo en _Files changed_, como si lo hubiera escrito otra persona, y
espera a que los chequeos automáticos pasen (cuando exista el CI). Cuando se una
un colaborador, se activa en GitHub la regla de **1 aprobación obligatoria**
sobre `main` y `develop`.

---

## 5. Revisiones automáticas locales

Antes de cada commit, Husky ejecuta:

1. **lint-staged:** formatea con Prettier los archivos que vas a subir.
2. **oxlint** sobre backend y frontend: detecta errores probables.

Si alguno falla, el commit se cancela hasta que lo corrijas. No uses
`--no-verify` para saltarte los hooks; si un hook estorba, arréglalo o
coméntalo con el equipo.

---

## 6. Definición de Hecho (Definition of Done)

Un RF solo pasa a _Completado_ cuando cumple todo lo siguiente:

1. **Cumple lo especificado** en el RF y en los criterios de aceptación de su
   historia de usuario.
2. **Cumple los RNF asociados.** Revisa la columna _RNF Relacionados_ de la
   matriz de trazabilidad: no solo accesibilidad, también seguridad,
   rendimiento y consistencia cuando apliquen.
3. **Accesibilidad (si el RF tiene interfaz):**
   - Operable al 100 % con teclado, con orden de foco lógico y foco visible.
   - Se anuncia correctamente con lector de pantalla (etiquetas, roles, estados).
   - Contraste mínimo WCAG 2.1 AA; en modo alto contraste del Participante,
     AAA (7:1).
4. **Sin errores de lint ni de compilación de TypeScript.**
5. **Pruebas:** la lógica de negocio (capas `domain` y `application`) tiene
   pruebas unitarias.
6. **Documentado:** los endpoints o métodos públicos nuevos tienen
   documentación; si cambia un contrato o la arquitectura, se actualiza `docs/`.
7. **Integrado:** fusionado en `develop` mediante PR y tarjeta movida a
   _Completado_.

_Estado actual de la automatización:_ el punto 4 se verifica con los hooks
locales. Los chequeos automáticos de accesibilidad (axe-core / Pa11y) y el
pipeline de CI se incorporarán cuando exista la primera pantalla y el flujo de
integración; mientras tanto, el punto 3 se verifica manualmente.

---

## 7. Reglas de arquitectura del backend

El backend se organiza en cuatro capas (`apps/backend/src/`). Las dependencias
solo pueden apuntar **hacia adentro**:

| Capa             | Puede importar de       |
| ---------------- | ----------------------- |
| `domain`         | nada de las otras capas |
| `application`    | `domain`                |
| `infrastructure` | `domain`, `application` |
| `interfaces`     | `application`, `domain` |

Consecuencias prácticas:

- Un _controller_ no contiene lógica de negocio: valida la entrada, delega en
  un servicio y devuelve la respuesta.
- Solo los repositorios (`infrastructure/repositories`) acceden a PostgreSQL.
- El Portal usa los módulos de usabilidad únicamente a través del contrato
  `IUsabilityModule`; nunca conoce los detalles de un módulo concreto.
- Si un `import` va en sentido contrario a la tabla, es una señal de que la
  arquitectura se está rompiendo: se corrige o se discute antes de fusionar.

**Convenciones de código**

- Nombres de archivos, carpetas, clases, variables y funciones en **inglés**.
- Clases en `PascalCase`; interfaces con prefijo `I` (`IProjectRepository`);
  archivos en `kebab-case` con sufijo de tipo (`project.service.ts`,
  `user.entity.ts`).
- Commits, PR, documentación y comentarios explicativos en **español**.
- Evita `any`; si es imprescindible, deja un comentario con el motivo.

---

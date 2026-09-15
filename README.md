# MEUX LAB

Portal web de laboratorio de usabilidad y evaluación UX, con foco en accesibilidad
(WCAG 2.1 AA / AAA) para participantes con y sin discapacidad visual. Proyecto de
prácticas profesionales / tesis — Francisco Castro Murillo.

## Stack Tecnológico

- **Frontend:** React + TypeScript
- **Backend:** Node.js + TypeScript, arquitectura en capas (Clean Architecture)
- **Base de datos:** PostgreSQL (incluye columnas `JSONB` para telemetría)
- **Tiempo real:** WebSockets (motor de telemetría)

## Estructura del Proyecto

Este es un **monorepo**: frontend y backend viven en el mismo repositorio, cada
uno como un workspace independiente.

```
meux-lab/
├── .github/          # Plantillas de Issues/PRs y workflows de CI
├── docs/             # Documentación técnica y diagramas
│   ├── ARCHITECTURE.md
│   ├── TRACEABILITY.md
│   └── diagrams/
├── src/
│   ├── backend/
│   │   ├── domain/           # Entidades, interfaces de contrato (capa 1)
│   │   ├── application/      # Servicios y lógica de negocio (capa 2)
│   │   ├── infrastructure/   # Repositorios, WebSocket, módulos concretos (capa 3)
│   │   └── interfaces/       # Controllers y rutas REST (capa 4)
│   └── frontend/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       └── styles/
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

Ver `docs/ARCHITECTURE.md` para el detalle del Factory Pattern y el motor de
telemetría, y `docs/TRACEABILITY.md` para la Matriz de Trazabilidad completa
(Requisitos Funcionales, No Funcionales, Épicas y Actores).

## Requisitos Previos

- Node.js (versión LTS más reciente)
- PostgreSQL (instalado localmente o vía contenedor)
- Git

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd meux-lab

# 2. Instalar dependencias (raíz + workspaces de backend y frontend)
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales locales de PostgreSQL

# 4. Levantar el backend en modo desarrollo
npm run dev --workspace=backend

# 5. Levantar el frontend en modo desarrollo (en otra terminal)
npm run dev --workspace=frontend
```

## Flujo de Trabajo

Antes de contribuir código, lee **[CONTRIBUTING.md](./CONTRIBUTING.md)**, que
define:

- Estrategia de ramas (Git Flow adaptado)
- Convención de mensajes de commit
- Política de Pull Requests
- Definición de Hecho (Definition of Done)

## Estado del Proyecto

Backlog gestionado mediante Épicas y priorización MoSCoW. Épicas activas en
esta fase: Núcleo y Seguridad, Gestión de Proyectos, Orquestador de Módulos,
Entorno de Participante/Accesibilidad, Motor de Telemetría, y Soporte/Ayuda.
Módulos Específicos, Métricas/Reportes y Monetización quedan fuera de alcance
por ahora (ver Matriz de Trazabilidad).

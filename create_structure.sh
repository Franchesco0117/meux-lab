#!/bin/bash
# ============================================================
# MEUX LAB - Script de creación del esqueleto de carpetas
# Ejecutar UNA sola vez, dentro de la carpeta raíz del repo
# recién clonado/inicializado (meux-lab/)
# ============================================================

set -e  # Detener el script si algún comando falla

echo "Creando estructura de carpetas para MEUX LAB..."

# --- GitHub (plantillas y CI/CD) ---
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE

# --- Documentación ---
mkdir -p docs/diagrams

# --- Backend: Domain (capa 1) ---
mkdir -p src/backend/domain/entities
mkdir -p src/backend/domain/interfaces
mkdir -p src/backend/domain/dtos

# --- Backend: Application (capa 2) ---
mkdir -p src/backend/application/services
mkdir -p src/backend/application/factories

# --- Backend: Infrastructure (capa 3) ---
mkdir -p src/backend/infrastructure/repositories
mkdir -p src/backend/infrastructure/gateways
mkdir -p src/backend/infrastructure/modules

# --- Backend: Interfaces (capa 4) ---
mkdir -p src/backend/interfaces/controllers
mkdir -p src/backend/interfaces/routes

# --- Frontend ---
mkdir -p src/frontend/components
mkdir -p src/frontend/pages
mkdir -p src/frontend/hooks
mkdir -p src/frontend/services
mkdir -p src/frontend/styles

# --- Archivos placeholder para que Git detecte las carpetas vacías ---
# (Git no versiona carpetas vacías, solo archivos, así que dejamos un .gitkeep)
find src docs .github -type d -empty -exec touch {}/.gitkeep \;

echo ""
echo "Estructura creada con éxito. Árbol resultante:"
echo ""

# Muestra el árbol final (requiere el comando 'tree'; si no lo tienes,
# instálalo con: sudo apt install tree   |   brew install tree)
if command -v tree &> /dev/null; then
    tree -a -I '.git' .
else
    find . -path ./.git -prune -o -print | sed 's/[^/]*\//  /g'
fi

echo ""
echo "Siguiente paso: copia .gitignore y README.md a la raíz del repo,"
echo "luego corre: git add . && git commit -m \"chore: estructura inicial del proyecto\""

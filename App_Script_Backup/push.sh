#!/bin/bash

# 1. Verificar si hay cambios
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ No hay modificaciones pendientes."
    exit 0
fi

# 2. Añadir todos los cambios
git add .

# 3. Solicitar mensaje de commit
read -p "📝 Introduce el mensaje del commit: " mensaje

# 4. Realizar el commit
git commit -m "$mensaje"

# 5. Hacer push al repositorio remoto (asume 'origin' y la rama actual)
echo "🚀 Subiendo cambios..."
git push origin HEAD

echo "✅ ¡Cambios subidos con éxito!"   

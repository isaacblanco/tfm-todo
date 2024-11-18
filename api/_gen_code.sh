#!/bin/bash
directorio_base="./src"
archivo_salida="codigo_api.txt"

# Borrar el archivo de salida si ya existe
rm -f "$archivo_salida"

# Función para recorrer directorios y escribir contenidos en el archivo de salida, ignorando "node_modules"
recorrer_directorio() {
  for elemento in "$1"/*; do
    if [ -d "$elemento" ]; then
      if [[ "$(basename "$elemento")" != "node_modules" ]]; then
        recorrer_directorio "$elemento"
      fi
    elif [ -f "$elemento" ]; then
      echo "Archivo: $elemento" >> "$archivo_salida"
      cat "$elemento" >> "$archivo_salida"
      echo -e "\n" >> "$archivo_salida"
    fi
  done
}

# Llamada inicial a la función con el directorio base
recorrer_directorio "$directorio_base"

echo "Contenido de todos los archivos guardado en $archivo_salida"

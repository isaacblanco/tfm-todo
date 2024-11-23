# TO DO List

Temas pendientes

https://unpkg.com/ionicons@5.5.2/dist/cheatsheet.html

## Servicio TASK

- Modificar tarea
  - tabular derecha
  - tabular izquierda
  - Establecer prioridad
- Borrar tarea
  - Con confirmación

UPDATE "tasks" SET "id_task" = $1, "fk_project" = $2, "task_name" = $3, "completed" = $4, "dini" = $5, "dfin" = $6, "tabs" = $7, "description" = $8, "priority" = $9, "status" = $10 WHERE "id_task" IN ($11) -- PARAMETERS: [7,3,"Borrame",0,null,null,1,"",1,"TO_DO","7"]

## Servicios LABELS

- Agregar label
- Leer labels
- Borrar label
  - Borrar en todos los proyectos

## CONFIGURACION

- Definir dias a mostrar

## Otros: importantes y FALLOS

- Mostrar datos del usuario
- Falta mostar el menu lateral, no funciona
- Si no hay tareas en un proyecto, no devolver un 404, devolver un array vacio
- No funciona mover tareas: ojo, por tema fechas
- Modificar tarea
  - Guardar fecha y hora
  - Editar ambas fechas y horas

## TODO

- Leer todo
- Leer nice to be done
- Leer next
- Crear tarea
- Editar tarea
  - Poner fechas
  - Tabular
  - Etiquetar
  - Mover
  - Añadir descripción
  - Establecer prioridad
  - Borrar
- Mover tarea a proyecto
- Filtrar tareas
- Marcar como completada

## PROYECTOS con tiempo

- Leer datos de un proyecto
- Cambiar a vista: kanbam
- Cambiar a vista de calendario
- Filtrar tareas

## Auth - Temas de autentificación

- Bloquear paginas
- Si no esta logado ir a login
- Crear usuario: registro
- Encriptar clave de usuario

## Capa de pintura

- Poner bonito

## [--Para nota--]

Validarse con google

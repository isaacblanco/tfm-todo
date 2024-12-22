# TFM - TO DO Focus

By Isaac Blanco Peco

## Instalación

```
npm i
cd ./todo-focus
ionic-serve
```

ionic-serve lanzará la app en el navegador en http://localhost:8100

npm

## Base de datos

Se esta utilizando PostGreeSQL

## API

Información del API en /api/README.md

```
cd ./api
npm run start:dev
```

### Peticiones al API

Mapped {/, GET} route
TaskController {/tasks}:
Mapped {/tasks, GET} route
Mapped {/tasks/:id, GET} route
Mapped {/tasks, POST} route
Mapped {/tasks/:id, PUT} route
Mapped {/tasks/:id, DELETE} route
ProjectController {/projects}
Mapped {/projects/:id/tasks, GET} route
Mapped {/projects/user/:id_user, GET} route
Mapped {/projects, GET} route
Mapped {/projects/:id, GET} route
Mapped {/projects, POST} route
Mapped {/projects/:id, PUT} route
Mapped {/projects/:id, DELETE} route
TagController {/tags}
Mapped {/tags, GET} route
Mapped {/tags, POST} route
Mapped {/tags/:id, DELETE} route
UserController {/users}
Mapped {/users/login, POST} route
Mapped {/users, GET} route
Mapped {/users/:id, GET} route
Mapped {/users, POST} route
Mapped {/users/:id, PUT} route
Mapped {/users/:id, DELETE} route
Nest application successfully startee

### Usuario de pruebas

isaacblanco@uoc.edu : 123456

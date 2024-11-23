/* import { TaskDTO } from './task-DTO'; */

export interface ProjectDTO {
  id_project: number;
  name: string;
  pinned: boolean;
  main: boolean;
  fk_user: number; // ID del usuario propietario
  /* tasks?: TaskDTO[]; // Lista de tareas asociadas al proyecto */
}

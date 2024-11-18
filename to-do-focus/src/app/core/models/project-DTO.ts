import { TaskDTO } from './task-DTO';

export interface ProjectDTO {
  id: number;
  name: string;
  pinned: boolean;
  main: boolean;
  userId: number; // ID del usuario propietario
  tasks?: TaskDTO[]; // Lista de tareas asociadas al proyecto
}

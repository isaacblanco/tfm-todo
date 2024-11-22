import { TagDTO } from './tag-DTO';

export interface TaskDTO {
  id_task: number;
  fk_project: number;
  task_name: string;
  completed: boolean;
  dini?: Date; // Fecha de inicio
  dfin?: Date; // Fecha de fin
  description?: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE';
  tabs?: number; // 1..2..3
  priority: number;
  tags?: TagDTO[]; // Lista de etiquetas asociadas
}

import { TagDTO } from './tag-DTO';

export interface TaskDTO {
  id: number;
  name: string;
  completed: boolean;
  dIni?: Date; // Fecha de inicio
  dFin?: Date; // Fecha de fin
  tabs?: string; // Sección: Focus, Nice to be done, NEXT
  description?: string;
  priority: 'Low' | 'Normal' | 'High';
  status: 'TO_DO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE';
  projectId: number; // ID del proyecto al que pertenece
  tags?: TagDTO[]; // Lista de etiquetas asociadas
}

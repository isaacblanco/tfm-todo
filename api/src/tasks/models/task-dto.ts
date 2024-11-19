import { TagDto } from "src/tags/models/tag-dto";
export class TaskDto {
  id_task: number;
  fk_project: number; // ID del proyecto al que pertenece
  task_name: string;
  completed: boolean;
  dini?: Date; // Fecha de inicio
  dfin?: Date; // Fecha de fin
  tabs?: string; // Sección: Focus, Nice to be done, NEXT
  description?: string;
  priority: number;
  status: "TO_DO" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW" | "DONE";
  tags?: TagDto[]; // Lista de etiquetas asociadas
}

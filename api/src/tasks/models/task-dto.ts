import { TagDto } from "src/tags/models/tag-dto";

export class TaskDto {
  id_task: number; // Identificador único de la tarea
  fk_project: number; // Identificador del proyecto al que pertenece
  task_name: string; // Nombre de la tarea (máx. 200 caracteres)
  completed: boolean; // Estado de completado
  dini?: Date; // Fecha de inicio (opcional)
  dfin?: Date; // Fecha de fin (opcional)
  tabs?: number; // Número o categoría de sección (opcional)
  description?: string; // Descripción de la tarea (opcional)
  priority: number; // Nivel de prioridad (1 = Alta, 5 = Baja)
  status: "TO_DO" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW" | "DONE"; // Estado de la tarea
  tags?: TagDto[]; // Lista de etiquetas asociadas (opcional)
}

import { Pipe, PipeTransform } from '@angular/core';
import { TaskDTO } from '../../core/models/task-DTO';

@Pipe({
  name: 'taskFilter',
  standalone: true,
})
export class TaskFilterPipe implements PipeTransform {
  /**
   * Filtra una lista de tareas según un término de búsqueda
   * @param tasks - Lista de tareas
   * @param searchTerm - Término de búsqueda
   * @returns Lista de tareas filtradas
   */
  transform(tasks: TaskDTO[], searchTerm: string): TaskDTO[] {
    if (!tasks || !searchTerm) {
      return tasks; // Devuelve todas las tareas si no hay término de búsqueda
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    return tasks.filter((task) =>
      task.task_name.toLowerCase().includes(lowerCaseTerm)
    );
  }
}

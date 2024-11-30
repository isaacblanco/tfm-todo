import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskDTO } from '../models/task-DTO';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/tasks/';
  private tasksSubject = new BehaviorSubject<TaskDTO[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las tareas de un proyecto específico.
   * @param projectId ID del proyecto.
   * @returns Observable con la lista de tareas.
   */
  getTasks(projectId: number): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/${projectId}`).pipe(
      tap((tasks) => {
        this.tasksSubject.next(tasks); // Actualiza las tareas locales.
      })
    );
  }

  /**
   * Agrega una nueva tarea.
   * @param task Objeto de la nueva tarea.
   * @returns Observable con la tarea creada.
   */
  addTask(task: TaskDTO): Observable<TaskDTO> {
    return this.http.post<TaskDTO>(this.apiUrl, task).pipe(
      tap((newTask) => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next([...currentTasks, newTask]); // Añade la nueva tarea a la lista local.
      })
    );
  }

  /**
   * Actualiza una tarea existente.
   * @param taskId ID de la tarea a actualizar.
   * @param task Objeto con los datos a actualizar.
   * @returns Observable con la tarea actualizada.
   */
  updateTask(taskId: number, task: Partial<TaskDTO>): Observable<TaskDTO> {
    return this.http.put<TaskDTO>(`${this.apiUrl}${taskId}`, task).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksSubject.getValue();
        const updatedTasks = currentTasks.map((t) =>
          t.id_task === updatedTask.id_task ? updatedTask : t
        );
        this.tasksSubject.next(updatedTasks); // Actualiza la lista local.
      })
    );
  }

  /**
   * Actualiza manualmente la lista de tareas locales.
   * @param tasks Lista completa de tareas.
   */
  updateTasks(tasks: TaskDTO[]): void {
    this.tasksSubject.next(tasks);
  }

  /**
   * Elimina una tarea.
   * @param taskId ID de la tarea a eliminar.
   * @returns Observable vacío.
   */
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.getValue();
        const filteredTasks = currentTasks.filter((t) => t.id_task !== taskId);
        this.tasksSubject.next(filteredTasks); // Elimina la tarea localmente.
      })
    );
  }
}

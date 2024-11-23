import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskDTO } from '../models/task-DTO';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/tasks/'; // Cambiar por la URL de tu API
  private tasksSubject = new BehaviorSubject<TaskDTO[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTasks(projectId: number): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/${projectId}`);
  }

  addTask(task: TaskDTO): Observable<TaskDTO> {
    return this.http.post<TaskDTO>(this.apiUrl, task);
  }

  updateTask(taskId: number, task: Partial<TaskDTO>): Observable<TaskDTO> {
    return this.http.put<TaskDTO>(`${this.apiUrl}${taskId}`, task);
  }

  updateTasks(tasks: TaskDTO[]): void {
    this.tasksSubject.next(tasks);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task-DTO';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks'; // Cambiar por la URL de tu API

  constructor(private http: HttpClient) {}

  getTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?projectId=${projectId}`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(taskId: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, task);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectDTO } from '../models/project-DTO';
import { TaskDTO } from '../models/task-DTO';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl + '/projects/'; // URL del API en Node JS

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el ID del usuario desde el localStorage
   * @returns number | null
   */
  private getUserId(): number | null {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData?.id || null;
    }
    return null;
  }

  getTasks(projectId: number): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}${projectId}/tasks`);
  }

  /**
   * Obtiene un proyecto por su ID
   * @param projectId - ID del proyecto
   * @returns Observable con los datos del proyecto
   */
  getProjectById(projectId: number): Observable<ProjectDTO> {
    return this.http.get<ProjectDTO>(`${this.apiUrl}${projectId}`);
  }

  /**
   * Obtiene todos los proyectos del usuario almacenado en localStorage
   * @returns Observable con la lista de proyectos
   */
  getProjects(): Observable<ProjectDTO[]> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }

    return this.http.get<ProjectDTO[]>(`${this.apiUrl}?userId=${userId}`);
  }

  /**
   * Crea un nuevo proyecto para el usuario almacenado en localStorage
   * @param name - Nombre del proyecto
   * @returns Observable con el proyecto creado
   */
  addProject(name: string): Observable<ProjectDTO> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }

    const body = { name, pinned: false, main: false, userId };
    return this.http.post<ProjectDTO>(this.apiUrl, body);
  }

  /**
   * Actualiza un proyecto existente
   * @param projectId - ID del proyecto a actualizar
   * @param project - Objeto DTO completo del proyecto
   * @returns Observable con el proyecto actualizado
   */
  updateProject(
    projectId: number,
    project: ProjectDTO
  ): Observable<ProjectDTO> {
    return this.http.put<ProjectDTO>(`${this.apiUrl}${projectId}`, project);
  }

  /**
   * Elimina un proyecto
   * @param projectId - ID del proyecto a eliminar
   * @returns Observable vacío
   */
  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${projectId}`);
  }
}

/* */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectDTO } from '../models/project-DTO';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl + '/projects/'; // URL del API en Node JS

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los proyectos de un usuario
   * @param userId - ID del usuario cuyos proyectos se desean obtener
   * @returns Observable con la lista de proyectos
   */
  getProjects(userId: number): Observable<ProjectDTO[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<ProjectDTO[]>(this.apiUrl, { params });
  }

  /**
   * Crea un nuevo proyecto
   * @param name - Nombre del proyecto
   * @param userId - ID del usuario al que pertenece el proyecto
   * @returns Observable con el proyecto creado
   */
  addProject(name: string, userId: number): Observable<ProjectDTO> {
    const body = { name, user_id: userId };
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
    return this.http.put<ProjectDTO>(`${this.apiUrl}/${projectId}`, project);
  }

  /**
   * Elimina un proyecto
   * @param projectId - ID del proyecto a eliminar
   * @returns Observable vacío
   */
  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  }
}

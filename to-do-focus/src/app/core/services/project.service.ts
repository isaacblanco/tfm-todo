import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectDTO } from '../models/project-DTO';
import { TaskDTO } from '../models/task-DTO';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl + '/projects/'; // URL del API en Node JS
  // BehaviorSubject para manejar actualizaciones de la lista de proyectos
  private projectsSubject = new BehaviorSubject<ProjectDTO[]>([]);
  public projects$ = this.projectsSubject.asObservable(); // Observable público

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

  getProjectsByUserId(userId: number): Observable<ProjectDTO[]> {
    // Llama a la API y actualiza el BehaviorSubject
    this.http.get<ProjectDTO[]>(`${this.apiUrl}user/${userId}`).subscribe({
      next: (projects) => {
        this.projectsSubject.next(projects); // Actualiza el BehaviorSubject
      },
      error: (err) => console.error('Error al obtener proyectos:', err),
    });

    return this.projects$; // Devuelve el Observable del BehaviorSubject
  }

  /**
   * Obtiene todos los proyectos del usuario almacenado en localStorage
   * @returns Observable con la lista de proyectos
   */
  getProjects(): Observable<ProjectDTO[]> {
    const userId = this.getUserId();
    if (!userId) {
      console.error('User ID not found in localStorage');
      return new BehaviorSubject<ProjectDTO[]>([]).asObservable(); // Retorna un Observable vacío si no hay ID
    }

    // Llama a la API y actualiza el BehaviorSubject
    this.http.get<ProjectDTO[]>(`${this.apiUrl}user/${userId}`).subscribe({
      next: (projects) => {
        this.projectsSubject.next(projects); // Actualiza el BehaviorSubject
      },
      error: (err) => console.error('Error al obtener proyectos:', err),
    });

    return this.projects$; // Devuelve el Observable del BehaviorSubject
  }

  /**
   * Crea un nuevo proyecto para el usuario almacenado en localStorage
   * @param name - Nombre del proyecto
   * @returns Observable con el proyecto creado
   */
  addProject(data: ProjectDTO): Observable<ProjectDTO> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    data.fk_user = userId; // Asigna el ID del usuario al proyecto

    return this.http.post<ProjectDTO>(this.apiUrl, data);
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
    return this.http
      .put<ProjectDTO>(`${this.apiUrl}${projectId}`, project)
      .pipe(
        tap((updatedProject) => {
          // Actualizar la lista local de proyectos
          const currentProjects = this.projectsSubject.getValue();
          const updatedProjects = currentProjects.map((p) =>
            p.id_project === updatedProject.id_project ? updatedProject : p
          );
          this.projectsSubject.next(updatedProjects); // Emitir la lista actualizada
        })
      );
  }

  /**
   * Elimina un proyecto
   * @param projectId - ID del proyecto a eliminar
   * @returns Observable vacío
   */
  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${projectId}`).pipe(
      tap(() => {
        // Actualizar la lista local de proyectos
        const currentProjects = this.projectsSubject.getValue();
        const updatedProjects = currentProjects.filter(
          (project) => project.id_project !== projectId
        );
        this.projectsSubject.next(updatedProjects); // Emitir la lista actualizada
      })
    );
  }
}

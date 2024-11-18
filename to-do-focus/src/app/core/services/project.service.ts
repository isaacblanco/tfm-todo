import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectDTO } from '../models/project-DTO';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects'; // Cambiar por la URL de tu API

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(this.apiUrl);
  }

  addProject(project: ProjectDTO): Observable<ProjectDTO> {
    return this.http.post<ProjectDTO>(this.apiUrl, project);
  }

  updateProject(
    projectId: number,
    project: Partial<ProjectDTO>
  ): Observable<ProjectDTO> {
    return this.http.put<ProjectDTO>(`${this.apiUrl}/${projectId}`, project);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  }
}

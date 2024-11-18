import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TagDTO } from '../models/tag-DTO';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = 'http://localhost:3000/tags'; // Cambiar por la URL de tu API

  constructor(private http: HttpClient) {}

  getTags(): Observable<TagDTO[]> {
    return this.http.get<TagDTO[]>(this.apiUrl);
  }

  addTag(tag: TagDTO): Observable<TagDTO> {
    return this.http.post<TagDTO>(this.apiUrl, tag);
  }

  updateTag(tagId: number, tag: Partial<TagDTO>): Observable<TagDTO> {
    return this.http.put<TagDTO>(`${this.apiUrl}/${tagId}`, tag);
  }

  deleteTag(tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tagId}`);
  }
}

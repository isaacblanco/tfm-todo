import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8100/auth'; // Cambiar por la URL de tu API

  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión con credenciales
   * @param username - Nombre de usuario
   * @param password - Contraseña
   * @returns Observable con los datos de autenticación
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  /**
   * Registra un nuevo usuario
   * @param userData - Datos del usuario
   * @returns Observable con la respuesta del registro
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * Cierra sesión eliminando el token de almacenamiento local
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Almacena el token en localStorage
   * @param token - Token de autenticación
   */
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Obtiene el token de autenticación almacenado
   * @returns string | null
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDTO } from '../core/models/user-DTO';
import { UserService } from '../core/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // URL de la API
  private loginStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  loginStatus$ = this.loginStatus.asObservable(); // Observable del estado del login

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Inicia sesión con credenciales y guarda los datos en localStorage
   * @param email - Correo del usuario
   * @param password - Contraseña del usuario
   * @returns Observable con los datos de autenticación
   */
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap((response: any) => {
          console.log('AuthService: Login successful');
          console.log(response);

          // Guarda el mensaje, datos del usuario y sus preferencias en localStorage
          if (response?.user) {
            const userData = {
              id: response.user.id_user,
              username: response.user.username,
              email: response.user.email,
              settings: response.user.settings,
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            this.loginStatus.next(true); // Estamos logados, lo emitimos
            console.log('AuthService: User data saved in localStorage');
          }
        })
      );
  }

  /**
   * Registra un nuevo usuario
   * @param userData - Datos del usuario
   * @returns Observable con la respuesta del registro
   */
  registerOld(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * Registra un nuevo usuario
   * @param userData - Datos del usuario
   * @returns Observable con la respuesta del registro
   */
  register(userData: UserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  /**
   * Cierra sesión eliminando los datos del usuario de localStorage
   */
  logout(): void {
    localStorage.removeItem('authToken'); // Elimina el token de autenticación
    localStorage.removeItem('userData'); // Elimina los datos del usuario
    this.userService.clearUserData(); // Limpia el user_id usando UserService
    console.log('AuthService: User logged out');
    this.loginStatus.next(false); // Emite el estado de logout
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
   * Establece los datos del usuario en localStorage
   * @param userData - Objeto con los datos del usuario
   */
  setUserData(userData: any): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  /**
   * Obtiene el token de autenticación almacenado
   * @returns string | null
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Obtiene los datos del usuario desde localStorage
   * @returns Object | null
   */
  getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Obtiene el ID del usuario (`id_user`) desde localStorage
   * @returns number | null - Retorna el ID del usuario o null si no existe
   */
  getUserId(): number | null {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.id_user || null;
      } catch (error) {
        console.error('Error al parsear userData desde localStorage:', error);
      }
    }
    return null;
  }

  /**
   * Elimina los datos del usuario de localStorage
   */
  clearUserData(): void {
    localStorage.removeItem('userData');
  }
}

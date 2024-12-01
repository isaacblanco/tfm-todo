import { Injectable } from '@angular/core';
import { UserDTO } from './../models/user-DTO';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Establece los datos del usuario en localStorage
   * @param userData - Objeto con los datos del usuario
   */
  setUserData(userData: any): void {
    localStorage.setItem('userData', JSON.stringify(userData));
    //console.log('Usuario guardado en localStorage:', userData);
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
        return parsedData.id || null;
      } catch (error) {
        console.error('Error al parsear userData desde localStorage:', error);
      }
    }
    return null;
  }

  getUserData(): UserDTO | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Elimina los datos del usuario de localStorage
   */
  clearUserData(): void {
    localStorage.removeItem('userData');
  }

  getDefaultUser(): UserDTO {
    return {
      id: 0,
      username: '',
      email: '',
      settings: {
        numberType: true, // por defecto son días
        numberOfTaskToShow: 7, // mostrar 7 dias (mas anteriores)
        projectOrder: 'name',
        showDescription: true,
        showEmptyTask: false, // TODO: actualmente no se utiliza
        showAllOpen: false,
        showCompleted: false,
      },
    };
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userId: number | null = null;

  setUserId(id: number): void {
    this.userId = id;
    localStorage.setItem('user_id', id.toString()); // Persistir en localStorage
  }

  getUserId(): number | null {
    if (this.userId !== null) {
      return this.userId;
    }
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      this.userId = parseInt(storedId, 10);
    }
    return this.userId;
  }

  clearUserId(): void {
    this.userId = null;
    localStorage.removeItem('user_id'); // Eliminar del almacenamiento local
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { UserService } from 'src/app/core/services/user.service';
import { UserDTO } from '../../core/models/user-DTO';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SignUpPage implements OnInit {
  user: UserDTO = this.createDefaultUser();
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.user.username = 'ibpeco';
    this.user.email = 'ibpeco@gmail.com';
    this.user.password = '123456';
  }

  /**
   * Maneja el proceso de registro.
   */
  register(): void {
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.errorMessage = 'Todos los campos son requeridos.';
      return;
    }

    // Hashear la contraseña antes de enviarla al servidor
    const hashedPassword = CryptoJS.SHA256(this.user.password).toString(
      CryptoJS.enc.Hex
    );

    this.user.password = hashedPassword; // Reemplazar la contraseña hasheada en el objeto de usuario

    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Usuario registrado correctamente. Iniciando sesión...');

        // Guardar los datos del usuario localmente
        const userData: UserDTO = {
          id: response.id_user,
          username: response.username,
          email: response.email,
          settings: response.settings,
        };

        this.userService.setUserData(userData); // Guardar en localStorage
        console.log('Datos del usuario guardados en localStorage.');

        this.router.navigate(['/login']); // Navegar al login tras el registro
      },
      error: (err) => {
        console.error('Error al registrar al usuario:', err);
        this.errorMessage =
          'El registro ha fallado. Por favor intentelo más tarde.';
      },
    });
  }

  /**
   * Navega a la página de login.
   */
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Función para generar un hash
  hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  }

  /**
   * Crea un usuario con valores por defecto.
   */
  private createDefaultUser(): UserDTO {
    return {
      id: 0,
      username: '',
      email: '',
      password: '',
      settings: {
        numberType: false,
        numberOfTaskToShow: 50,
        projectOrder: 'asc',
        showDescription: false,
        showEmptyTask: false,
        showAllOpen: false,
      },
    };
  }
}

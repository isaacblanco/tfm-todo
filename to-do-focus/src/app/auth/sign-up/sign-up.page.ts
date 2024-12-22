import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  IonButton, IonCol,
  IonContent,
  IonGrid, IonHeader, IonItem, IonLabel,
  IonRow, IonText, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import * as CryptoJS from 'crypto-js';
import { ProjectDTO } from 'src/app/core/models/project-DTO';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserDTO } from '../../core/models/user-DTO';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonText, IonCol, IonRow, IonTitle,IonContent,
    IonButton, IonLabel, IonItem, IonGrid, IonHeader, IonToolbar],
})
export class SignUpPage implements OnInit {
  user: UserDTO = this.createDefaultUser();
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.user.username = '';
    this.user.email = '';
    this.user.password = '';
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
        //console.log('Usuario registrado correctamente. Iniciando sesión...');

        // Guardar los datos del usuario localmente
        const userData: UserDTO = {
          id: response.id_user,
          username: response.username,
          email: response.email,
          settings: response.settings,
        };

        this.userService.setUserData(userData); // Guardar en localStorage
        //console.log('Datos del usuario guardados en localStorage.');

        // Crear el proyecto predeterminado "TODO"
        this.createDefaultProject(response.id_user);

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
        showCompleted: false,
      },
    };
  }

  /**
   * Crear un proyecto predeterminado después de registrarse.
   * @param userId - ID del usuario registrado
   */
  private createDefaultProject(userId: number): void {
    const defaultProject: ProjectDTO = {
      id_project: 0, // Será asignado por el backend
      name: 'TODO',
      pinned: true,
      main: true,
      fk_user: userId,
    };

    this.projectService.addProject(defaultProject).subscribe({
      next: () => {
        //console.log('Proyecto TODO creado con éxito.');
        this.router.navigate(['/login']); // Navegar al login tras crear el proyecto
      },
      error: (err) => {
        console.error('Error al crear el proyecto TODO:', err);
        this.errorMessage =
          'El proyecto predeterminado no pudo ser creado. Intente más tarde.';
      },
    });
  }
}

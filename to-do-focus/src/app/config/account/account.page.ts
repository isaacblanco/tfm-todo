import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { UserDTO } from '../../core/models/user-DTO';
import { UserService } from './../../core/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AccountPage implements OnInit {
  user: UserDTO = this.createDefaultUser();
  newPassword: string = ''; // Para cambiar la contraseña
  deleteToggle: boolean = false; // Para confirmar la eliminación del usuario

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadUserSettings();
  }

  private loadUserSettings(): void {
    const storedUser = this.userService.getUserData();
    if (storedUser) {
      this.user = storedUser;
    }
  }

  /**
   * Cambia la contraseña del usuario
   */
  updatePassword(): void {
    if (!this.newPassword) {
      this.showAlert('Error', 'La contraseña no puede estar vacía.');
      return;
    }

    // Actualiza la contraseña en el backend
    this.authService
      .updateUserPassword(this.user.id, this.newPassword)
      .subscribe({
        next: () => {
          this.showAlert('Éxito', 'Contraseña actualizada correctamente.');
          this.newPassword = ''; // Limpia el campo de contraseña
        },
        error: (err) => {
          console.error('Error al actualizar la contraseña:', err);
          this.showAlert(
            'Error',
            'No se pudo actualizar la contraseña. Inténtelo más tarde.'
          );
        },
      });
  }

  /**
   * Borra al usuario del sistema
   */
  async deleteUser(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar su cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (this.user.id) {
              this.authService.deleteUser(this.user.id).subscribe({
                next: () => {
                  console.log('Usuario eliminado correctamente');
                  this.userService.clearUserData();
                  this.router.navigate(['/login']);
                },
                error: (err) => {
                  console.error('Error al eliminar al usuario:', err);
                  this.showAlert(
                    'Error',
                    'No se pudo eliminar su cuenta. Inténtelo más tarde.'
                  );
                },
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Muestra una alerta con un mensaje
   * @param header - Título de la alerta
   * @param message - Mensaje de la alerta
   */
  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  createDefaultUser(): UserDTO {
    return this.userService.getDefaultUser();
  }
}

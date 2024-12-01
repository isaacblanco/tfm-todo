import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { UserDTO } from 'src/app/core/models/user-DTO';
import { UserService } from './../../core/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SettingsPage implements OnInit {
  user: UserDTO = this.createDefaultUser();

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

  updateSettings(): void {
    console.log('Ajustes actualizados:', this.user.settings);
    this.userService.setUserData(this.user);

    // Construye un objeto sin incluir el campo `id`
    const userToUpdate = {
      username: this.user.username,
      email: this.user.email,
      settings: {
        numberType: this.user.settings?.numberType ?? true,
        numberOfTaskToShow: this.user.settings?.numberOfTaskToShow ?? 50,
        projectOrder: this.user.settings?.projectOrder ?? 'name',
        showDescription: this.user.settings?.showDescription ?? true,
        showEmptyTask: this.user.settings?.showEmptyTask ?? false,
        showAllOpen: this.user.settings?.showAllOpen ?? false,
        showCompleted: this.user.settings?.showCompleted ?? false,
      },
    };

    console.log('Datos a enviar al API:', userToUpdate);

    // Envía la configuración al backend si el usuario tiene ID
    const userId = this.user.id;
    if (userId) {
      this.authService.updateUserSettings(userId, userToUpdate).subscribe({
        next: () => {
          console.log('Ajustes de usuario actualizados en el backend.');
        },
        error: (err) => {
          console.error('Error al actualizar los ajustes del usuario:', err);
        },
      });
    } else {
      console.error(
        'No se pudo obtener el ID del usuario. Revisa la autenticación.'
      );
    }
  }

  async openLabelsModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: await import(
        './../../todo/modals/select-labels/select-labels.component'
      ).then((m) => m.SelectLabelsComponent),
      componentProps: {},
    });
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

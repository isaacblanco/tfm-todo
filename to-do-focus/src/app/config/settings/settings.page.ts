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

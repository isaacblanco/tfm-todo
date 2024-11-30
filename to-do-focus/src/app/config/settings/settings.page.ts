import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
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
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUserSettings();
    // Valores por defecto si hay problemas al cargar los datos
    if (this.user.settings?.numberOfTaskToShow === null) {
      this.user.settings.numberOfTaskToShow = 50;
    }
    if (this.user.settings?.projectOrder === null) {
      this.user.settings.projectOrder = 'asc';
    }
    if (this.user.settings?.showDescription === null) {
      this.user.settings.showDescription = false;
    }
    if (this.user.settings?.showEmptyTask === null) {
      this.user.settings.showEmptyTask = false;
    }
    if (this.user.settings?.showAllOpen === null) {
      this.user.settings.showAllOpen = false;
    }
  }

  /**
   * Carga los datos del usuario desde el servicio
   */
  private loadUserSettings(): void {
    const storedUser = this.userService.getUserData();
    if (storedUser) {
      this.user = storedUser;
    }
  }

  /**
   * Actualiza los ajustes del usuario en el servicio
   */
  updateSettings(): void {
    console.log('Ajustes actualizados:', this.user.settings);
    this.userService.setUserData(this.user);
  }

  /**
   * Abre el modal para editar etiquetas
   */
  async openLabelsModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: await import('./../edit-labels/edit-labels.component').then(
        (m) => m.EditLabelsComponent
      ),
      componentProps: {},
    });

    await modal.present();
  }

  /**
   * Crea un usuario por defecto
   */
  createDefaultUser(): UserDTO {
    return {
      id: 0,
      username: '',
      email: '',
      settings: {
        numberType: true, // por defecto son días
        numberOfTaskToShow: 50,
        projectOrder: 'name',
        showDescription: true,
        showEmptyTask: false,
        showAllOpen: false,
      },
    };
  }
}

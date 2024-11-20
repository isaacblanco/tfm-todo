import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular/standalone';
import { ProjectDTO } from './core/models/project-DTO';
import { ProjectService } from './core/services/project.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  public userId = 1; // ID del usuario actual (simulado)
  public projects: ProjectDTO[] = []; // Lista de proyectos del usuario
  public appPages = [
    { title: 'Proyecto 1', url: '/todo/project:1', icon: 'folder' },
  ];
  public labels = []; // 'Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'
  constructor(
    private projectService: ProjectService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects() {
    this.projectService.getProjects(this.userId).subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error al cargar los proyectos:', err);
      },
    });
  }

  async openAddProjectModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: await import(
        './todo/modals/edit-project/edit-project.component'
      ).then((m) => m.EditProjectComponent), // Carga dinámica del componente
      componentProps: {
        userId: this.userId, // Puedes pasar datos al modal si es necesario
      },
    });
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.reload) {
        this.loadProjects(); // Recargar proyectos si el modal indica cambios
      }
    });
    return modal.present();
  }
}

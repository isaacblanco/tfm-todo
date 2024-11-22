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
  public projects: ProjectDTO[] = []; // Lista de proyectos del usuario
  public labels = []; // Etiquetas, puedes cargar dinámicamente si es necesario

  constructor(
    private projectService: ProjectService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  /**
   * Carga los proyectos del usuario desde el servicio
   */
  private loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error al cargar los proyectos:', err);
      },
    });
  }

  /**
   * Abre un modal para añadir o editar un proyecto
   */
  async openAddProjectModal(project: ProjectDTO | null = null): Promise<void> {
    const modal = await this.modalController.create({
      component: await import(
        './todo/modals/edit-project/edit-project.component'
      ).then((m) => m.EditProjectComponent),
      componentProps: { project },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.reload) {
        this.loadProjects();
      }
    });

    await modal.present();
  }
}

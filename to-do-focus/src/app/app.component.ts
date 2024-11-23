import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { ProjectDTO } from './core/models/project-DTO';
import { ProjectService } from './core/services/project.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, IonicModule],
})
export class AppComponent implements OnInit {
  public projects: ProjectDTO[] = []; // Lista de proyectos del usuario
  public labels = []; // Etiquetas, puedes cargar dinámicamente si es necesario
  public isAuthenticated = false; // Controla si el usuario está logado

  constructor(
    private projectService: ProjectService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();

    // Suscribirse al estado del login
    this.authService.loginStatus$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;

      if (isLoggedIn) {
        this.loadProjects(); // Cargar proyectos al iniciar sesión
      } else {
        this.projects = []; // Limpiar proyectos al cerrar sesión
      }
    });

    if (this.isAuthenticated) {
      this.loadProjects();
    }

    // Escuchar cambios en la lista de proyectos
    this.projectService.projects$.subscribe((projects) => {
      this.projects = projects;
    });
  }

  /**
   * Carga los proyectos del usuario desde el servicio
   */
  private loadProjects() {
    // Escuchar cambios en la lista de proyectos
    this.projectService.projects$.subscribe((projects) => {
      this.projects = projects;
    });

    // Inicializar la carga de proyectos
    this.projectService.getProjects();
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

  /**
   * Realiza logout del usuario
   */
  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.projects = []; // Limpia los proyectos en caso de logout

    this.router.navigate(['/login'], { replaceUrl: true });
  }
}

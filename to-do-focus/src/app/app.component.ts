import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  IonApp,
  IonContent, IonFooter,
  IonHeader, IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
  IonThumbnail,
  IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from './auth/auth.service';
import { ProjectDTO } from './core/models/project-DTO';
import { ProjectService } from './core/services/project.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, IonToolbar, IonHeader, IonNote,
    IonThumbnail, IonMenu,IonSplitPane, IonMenuToggle, IonItemDivider,
    IonContent,IonIcon,IonList,IonFooter,IonApp,
    IonLabel, IonItem, IonTitle, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  projects: ProjectDTO[] = []; // Lista de proyectos del usuario
  labels = []; // Etiquetas, puedes cargar dinámicamente si es necesario
  isAuthenticated = false; // Controla si el usuario está logado
  mainProject : any = null;

  constructor(
    private projectService: ProjectService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // referencia de detección de cambios
  ) {}

  ngOnInit() {

    // Revisar el estado al inicializar
    this.isAuthenticated = this.authService.isAuthenticated();

    this.authService.loginStatus$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      if (isLoggedIn) {
        this.loadProjects(); // Cargar proyectos al iniciar sesión
      } else {
        this.projects = []; // Limpiar proyectos al cerrar sesión
      }
      this.cdr.detectChanges(); // Forzar la detección de cambios
    });
    

    if (this.isAuthenticated) {
      this.loadProjects(); // Carga inicial si ya se esta autenticado
    }

    // Suscripción a los cambios en los proyectos
    this.projectService.projects$.subscribe((projects) => {
      this.mainProject = projects.find((project: ProjectDTO) => project.main);
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
    // this.isAuthenticated = false;
    // this.projects = []; // Limpia los proyectos en caso de logout

    this.router.navigate(['/login'], { replaceUrl: true });
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { TaskItemComponent } from '../componets/task-item/task-item.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, IonicModule],
})
export class ProjectPage implements OnInit {
  projectId: number | null = null; // Si permites null
  // projectId: number = 0; // Si usas un valor predeterminado
  project: any = null;
  tasks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.projectId = id ? +id : null; // Cambia a `0` si no quieres permitir `null`
      if (this.projectId) {
        this.loadProjectData();
      }
    });
  }

  private loadProjectData(): void {
    if (this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (data) => {
          this.project = data;
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error al cargar los datos del proyecto:', err);
        },
      });
    }
  }

  private loadTasks(): void {
    if (this.projectId) {
      this.projectService.getTasks(this.projectId).subscribe({
        next: (data) => {
          this.tasks = data;
        },
        error: (err) => {
          console.error('Error al cargar las tareas:', err);
        },
      });
    }
  }

  /**
   * Abre el modal para editar el proyecto
   */
  async openEditProjectModal(): Promise<void> {
    if (this.project) {
      const modal = await this.modalController.create({
        component: await import(
          '../modals/edit-project/edit-project.component'
        ).then((m) => m.EditProjectComponent),
        componentProps: {
          project: this.project, // Pasar los datos del proyecto al modal
        },
      });

      modal.onDidDismiss().then((result) => {
        if (result.data && result.data.reload) {
          this.loadProjectData(); // Recargar los datos del proyecto
        }
      });

      return modal.present();
    }
  }

  /**
   * Elimina el proyecto tras pedir confirmación
   */
  async deleteProject(): Promise<void> {
    if (this.projectId !== null) {
      // Validación explícita
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: '¿Estás seguro de que quieres eliminar este proyecto?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.projectService.deleteProject(this.projectId!).subscribe({
                next: () => {
                  console.log('Proyecto eliminado correctamente');
                  this.projectService.getProjects();
                  this.router.navigate(['/todo/focus']);
                },
                error: (err) => {
                  console.error('Error al eliminar el proyecto:', err);
                  this.alertController
                    .create({
                      header: 'Error',
                      message:
                        'No se pudo eliminar el proyecto. Inténtalo nuevamente.',
                      buttons: ['OK'],
                    })
                    .then((alert) => alert.present());
                },
              });
            },
          },
        ],
      });

      await alert.present();
    }
  }
}

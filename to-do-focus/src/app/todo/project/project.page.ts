import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { TaskDTO } from '../../core/models/task-DTO';
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
  projectId: number | null = null;
  project: any = null;
  tasks: TaskDTO[] = [];
  filteredTasks: TaskDTO[] = [];
  searchTerm: string = '';

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
      this.projectId = id ? +id : null;
      console.log('Project ID:', this.projectId);
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
          this.filteredTasks = [...this.tasks]; // Inicializar lista filtrada
        },
        error: (err) => {
          console.error('Error al cargar las tareas:', err);
        },
      });
    }
  }

  /**
   * Filtra las tareas en función del término de búsqueda
   */
  filterTasks(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter((task) =>
      task.task_name.toLowerCase().includes(term)
    );
  }

  /**
   * Agrega una tarea vacía a la lista de tareas
   */
  addEmptyTask(): void {
    if (this.projectId) {
      const emptyTask: TaskDTO = {
        id_task: 0, // Generado por el backend
        fk_project: this.projectId,
        task_name: 'Nueva Tarea',
        completed: false,
        status: 'TO_DO',
        priority: 1,
        dini: undefined,
        dfin: undefined,
        description: '',
        tabs: 1,
        tags: [],
      };

      this.taskService.addTask(emptyTask).subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.filteredTasks = [...this.tasks]; // Actualizar la lista filtrada
          console.log('Tarea vacía añadida:', newTask);
        },
        error: (err) => {
          console.error('Error al añadir la tarea vacía:', err);
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
          project: this.project,
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
  /**
   * Elimina el proyecto tras pedir confirmación
   */
  async deleteProject(): Promise<void> {
    if (this.projectId !== null) {
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
                  this.router.navigate(['/todo/focus']); // Navegar después de borrar
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

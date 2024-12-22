import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent, IonHeader,
  IonIcon,
  IonList,
  IonMenuButton,
  IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { TaskFilterPipe } from 'src/app/core/pipes/task-filter.pipe';
import { TaskDTO } from '../../core/models/task-DTO';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { TaskItemComponent } from '../componets/task-item/task-item.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskItemComponent, IonMenuButton,
    TaskFilterPipe, IonList, IonIcon, IonButtons,
    IonButton, IonContent, IonHeader, IonTitle, IonToolbar 
  ],
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
      //console.log('Project ID:', this.projectId);
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
        tabs: 0,
      };

      this.taskService.addTask(emptyTask).subscribe({
        next: (newTask) => {
          this.tasks.unshift(newTask); // Agrega la tarea al principio de la lista
          this.filteredTasks = [...this.tasks]; // Actualizar la lista filtrada
          //console.log('Tarea vacía añadida:', newTask);
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
        //console.log('Modal dismissed:', result);
        if (result.data && result.data.reload) {
          if (result.data.updatedTask) {
            // Actualizar el fk_project de la tarea movida en la lista local
            const updatedTask = result.data.updatedTask;
            const taskIndex = this.tasks.findIndex(
              (task) => task.id_task === updatedTask.id_task
            );

            if (taskIndex !== -1) {
              this.tasks[taskIndex].fk_project = updatedTask.fk_project;
            }
          }

          // Filtrar tareas que ya no pertenecen a este proyecto
          this.tasks = this.tasks.filter(
            (task) => task.fk_project === this.projectId
          );

          this.loadTasks();

          //console.log('Lista de tareas actualizada:', this.tasks);
        }
      });

      return modal.present();
    }
  }

  onTaskMoved(updatedTask: TaskDTO): void {
    if (updatedTask.fk_project !== this.projectId) {
      // Filtrar la tarea movida de la lista
      this.tasks = this.tasks.filter(
        (task) => task.id_task !== updatedTask.id_task
      );
      //console.log('Tarea movida eliminada de la lista actual:', updatedTask);
    }
  }

  onTaskUpdated(updatedTask: TaskDTO): void {
    const taskIndex = this.tasks.findIndex(
      (task) => task.id_task === updatedTask.id_task
    );

    if (taskIndex !== -1) {
      // Actualiza la tarea en la lista
      this.tasks[taskIndex] = updatedTask;

      // Si la tarea ya no pertenece al proyecto actual, la elimina
      if (updatedTask.fk_project !== this.projectId) {
        this.tasks = this.tasks.filter(
          (task) => task.id_task !== updatedTask.id_task
        );
        //console.log('Tarea eliminada de la lista actual:', updatedTask);
      }

      // Actualiza la lista filtrada
      this.filteredTasks = [...this.tasks];
    } else {
      console.warn('Tarea actualizada no encontrada en la lista:', updatedTask);
    }
  }

  onTaskDeleted(deletedTask: TaskDTO): void {
    // Filtra la tarea eliminada de la lista de tareas
    this.tasks = this.tasks.filter(
      (task) => task.id_task !== deletedTask.id_task
    );
    this.filteredTasks = [...this.tasks];
    //console.log('Tarea eliminada:', deletedTask);
  }

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
                  //console.log('Proyecto eliminado correctamente');
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

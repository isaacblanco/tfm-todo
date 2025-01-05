import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { TaskDTO } from '../../core/models/task-DTO';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { TaskItemComponent } from '../componets/task-item/task-item.component';

import { ProjectUtilsService } from '../shared/project-utils.service';

@Component({
  selector: 'app-project-kanban',
  templateUrl: './project-kanban.page.html',
  styleUrls: ['./project-kanban.page.scss'],
  standalone: true,
  imports: [IonButton, 
    CommonModule,
    FormsModule,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonLabel,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonMenuButton,
    TaskItemComponent,
  ],
})
export class ProjectKanbanPage implements OnInit {
addEmptyTask() {
throw new Error('Method not implemented.');
}
  projectId: number | null = null;
  project: any = null;
  tasks: TaskDTO[] = [];
  groupedTasks: { priority: number; tasks: TaskDTO[] }[] = [];
  filteredTasks: TaskDTO[] = [];
  searchTerm: string = '';
  projectPercent: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private taskService: TaskService,
    private projectUtilsService: ProjectUtilsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.projectId = id ? +id : null;
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

  // Indica el porcentaje de completación de un projecto
  updatePercent() {
    if (this.filteredTasks) {
      this.projectPercent = this.projectUtilsService.calculateProjectProgress(this.filteredTasks) + '%';
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
   * Carga las tareas del proyecto y las agrupa por prioridad.
   */
  private loadTasks(): void {
    if (this.projectId) {
      this.projectService.getTasks(this.projectId).subscribe({
        next: (data) => {
          this.tasks = data;
          this.groupTasksByPriority();
        },
        error: (err) => {
          console.error('Error al cargar las tareas:', err);
        },
      });
    }
  }

  /**
   * Agrupa las tareas por prioridad en orden descendente.
   */
  private groupTasksByPriority(): void {
    const priorityMap: { [priority: number]: TaskDTO[] } = {};

    this.tasks.forEach((task) => {
      if (!priorityMap[task.priority]) {
        priorityMap[task.priority] = [];
      }
      priorityMap[task.priority].push(task);
    });

    // Ordenar prioridades de forma descendente y crear el array agrupado
    this.groupedTasks = Object.keys(priorityMap)
      .map((priority) => ({
        priority: +priority,
        tasks: priorityMap[+priority],
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  showList() {
    this.projectUtilsService.showList( this.projectId );
  }

  showKanban() {
    this.projectUtilsService.showKanban( this.projectId );
  }
  
  showTimeline() {
    this.projectUtilsService.showTimeline( this.projectId );
  }

  onTaskDeleted(deletedTask: TaskDTO): void {
    // Filtra la tarea eliminada de la lista de tareas
    this.tasks = this.tasks.filter(
      (task) => task.id_task !== deletedTask.id_task
    );
    this.filteredTasks = [...this.tasks];
    //console.log('Tarea eliminada:', deletedTask);
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

  getPriorityLabel(priority: number): string {
    const priorityMap: { [key: number]: string } = {
      1: 'Baja',
      2: 'Poca',
      3: 'Media',
      4: 'Alta',
      5: 'Muy Alta',
    };
  
    return priorityMap[priority] || 'Desconocida';
  }

  getColor(priority: number) {
    if ( priority == 1 ) {
      return 'primary';
    } else if ( priority == 2 ) {
      return 'success';
    } else if ( priority == 3 ) {
      return 'tertiary';
    } else if ( priority == 4 ) {
      return 'warning';
    } else {
      return 'danger';
    }
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

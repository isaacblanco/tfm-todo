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
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { TaskFilterPipe } from 'src/app/core/pipes/task-filter.pipe';
import { TaskDTO } from '../../core/models/task-DTO';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { TaskItemComponent } from '../componets/task-item/task-item.component';
import { ProjectUtilsService } from '../shared/project-utils.service';

@Component({
  selector: 'app-project-timeline',
  templateUrl: './project-timeline.page.html',
  styleUrls: ['./project-timeline.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskItemComponent, IonMenuButton, IonLabel,
    TaskFilterPipe, IonList, IonIcon, IonButtons,IonItem,
    IonButton, IonContent, IonHeader, IonTitle, IonToolbar 
  ],
})
export class ProjectTimelinePage implements OnInit {
  projectId: number | null = null;
  project: any = null;
  tasks: TaskDTO[] = [];
  orderedTasks: TaskDTO[] = [];
  filteredTasks: TaskDTO[] = [];
  searchTerm: string = '';
  projectPercent: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
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
   * Carga las tareas del proyecto y las ordena por fecha de finalización.
   */
  private loadTasks(): void {
    if (this.projectId) {
      this.projectService.getTasks(this.projectId).subscribe({
        next: (data) => {
          this.tasks = data;
          this.orderTasksByCompletionDate();
        },
        error: (err) => {
          console.error('Error al cargar las tareas:', err);
        },
      });
    }
  }

  /**
   * Ordena las tareas: primero las que tienen fecha de finalización (`dfin`),
   * luego las que no tienen.
   */
  private orderTasksByCompletionDate(): void {
    this.orderedTasks = [...this.tasks].sort((a, b) => {
      if (a.dfin && b.dfin) {
        return new Date(a.dfin).getTime() - new Date(b.dfin).getTime();
      }
      if (a.dfin) return -1; // `a` tiene `dfin`, `b` no
      if (b.dfin) return 1; // `b` tiene `dfin`, `a` no
      return 0; // Ninguno tiene `dfin`
    });
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

  calculatePendingDays(dfin: Date | null): string {
    if (!dfin) {
      return 'Sin fecha';
    }
  
    const today = new Date();
    const endDate = new Date(dfin);
    
    // Calcula la diferencia en milisegundos
    const diffInMilliseconds = endDate.getTime() - today.getTime();
    
    // Convierte los milisegundos en días
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  
    if (diffInDays < 0) {
      return 'Atrasada';
    }
    
    return `${diffInDays} días`;
  }

  getTaskColor(dfin: Date | undefined | null): string {
    if (!dfin) {
      return '#FFFFFF'; // Blanco por defecto si no hay fecha
    }
  
    const today = new Date();
    const endDate = new Date(dfin);
  
    const diffInMilliseconds = endDate.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  
    if (diffInDays < 0) {
      return '#FF6666'; // Rojo si está atrasada
    } else if (diffInDays <= 5) {
      return '#FFBD00'; // Amarillo si quedan 5 días o menos
    } else if (diffInDays <= 15) {
      return '#FF66BD'; // Naranja si quedan 15 días o menos
    }
  
    return '#FFFFFF'; // Blanco para cualquier otro caso
  }
  
  
}

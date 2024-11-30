import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { ProjectDTO } from '../../core/models/project-DTO';
import { TaskDTO } from '../../core/models/task-DTO';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { TaskItemComponent } from '../componets/task-item/task-item.component';

@Component({
  selector: 'app-focus',
  templateUrl: './focus.page.html',
  styleUrls: ['./focus.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, IonicModule],
})
export class FocusPage implements OnInit {
  mainProject: any = null; // Proyecto principal
  tasks: TaskDTO[] = []; // Tareas del proyecto principal
  filteredTasks: TaskDTO[] = []; // Tareas filtradas
  searchTerm: string = ''; // Término de búsqueda

  projectId = 0;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadMainProject();
  }

  /**
   * Carga el proyecto principal (main: true)
   */
  private loadMainProject(): void {
    this.projectService.getProjects().subscribe({
      next: (projects: ProjectDTO[]) => {
        // TODO: modificar el API para obtener el proyecto principal directamente
        console.log('Proyectos:', projects);
        this.mainProject = projects.find((project: ProjectDTO) => project.main);
        if (this.mainProject) {
          this.projectId = this.mainProject?.id_project; // Obtiene el ID del proyecto principal
          this.loadTasks();
        } else {
          console.error('No se encontró un proyecto principal.');
          // TODO: crear el proyecto principal, no debería de pasar
        }
      },
      error: (err: any) => {
        console.error('Error al cargar los proyectos:', err);
      },
    });
  }

  /**
   * Carga las tareas asociadas al proyecto principal
   */
  private loadTasks(): void {
    if (this.mainProject?.id_project) {
      this.projectService.getTasks(this.mainProject.id_project).subscribe({
        next: (data) => {
          this.tasks = data;
          this.filteredTasks = [...this.tasks]; // Inicializa las tareas filtradas
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
   * Actualiza una tarea cuando se notifica desde el componente hijo
   */
  onTaskUpdated(updatedTask: TaskDTO): void {
    const taskIndex = this.tasks.findIndex(
      (task) => task.id_task === updatedTask.id_task
    );

    if (taskIndex !== -1) {
      // Actualiza la tarea en la lista
      this.tasks[taskIndex] = updatedTask;

      // Si la tarea ya no pertenece al proyecto actual, la elimina
      if (updatedTask.fk_project !== this.mainProject.id_project) {
        this.tasks = this.tasks.filter(
          (task) => task.id_task !== updatedTask.id_task
        );
        console.log('Tarea eliminada de la lista actual:', updatedTask);
      }

      // Actualiza la lista filtrada
      this.filteredTasks = [...this.tasks];
    } else {
      console.warn('Tarea actualizada no encontrada en la lista:', updatedTask);
    }
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
   * Elimina una tarea de la lista cuando se notifica desde el componente hijo
   */
  onTaskDeleted(deletedTask: TaskDTO): void {
    this.tasks = this.tasks.filter(
      (task) => task.id_task !== deletedTask.id_task
    );
    this.filteredTasks = [...this.tasks];
    console.log('Tarea eliminada:', deletedTask);
  }

  /**
   * Maneja el evento de una tarea movida a otro proyecto
   */
  onTaskMoved(movedTask: TaskDTO): void {
    if (movedTask.fk_project !== this.mainProject.id_project) {
      // Eliminar la tarea movida del proyecto actual
      this.tasks = this.tasks.filter(
        (task) => task.id_task !== movedTask.id_task
      );
      this.filteredTasks = [...this.tasks];
      console.log(
        'Tarea movida a otro proyecto eliminada de la lista:',
        movedTask
      );
    }
  }

  /**
   * Muestra un mensaje si no se encuentra un proyecto principal
   */
  private async showNoMainProjectAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sin proyecto principal',
      message:
        'No se encontró un proyecto principal. Por favor, configure uno o cree un nuevo proyecto principal.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}

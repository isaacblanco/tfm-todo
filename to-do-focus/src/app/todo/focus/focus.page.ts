import { CommonModule } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItemDivider,
  IonLabel,
  IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { ProjectDTO } from '../../core/models/project-DTO';
import { TaskDTO } from '../../core/models/task-DTO';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { TaskItemComponent } from '../componets/task-item/task-item.component';

@Component({
  selector: 'app-focus',
  templateUrl: './focus.page.html',
  styleUrls: ['./focus.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, 
    IonItemDivider, IonList, IonContent, IonButton,
    IonButtons,
    IonTitle,
    IonMenuButton,
    IonIcon, IonLabel, IonHeader, IonToolbar  ],
})
export class FocusPage implements OnInit {
  @ViewChildren('taskNameInput') taskNameInputs!: QueryList<IonInput>;

  mainProject: any = null; // Proyecto principal
  tasks: TaskDTO[] = []; // Todas las tareas
  focusTasks: TaskDTO[] = []; // Tareas en la lista "Focus"
  nextTasks: TaskDTO[] = []; // Tareas en la lista "Next"
  filteredTasks: TaskDTO[] = []; // Tareas filtradas (búsqueda)
  searchTerm: string = ''; // Término de búsqueda
  showNext = false; // Mostrar/ocultar lista "Next"

  // Configuración del usuario por defecto
  userSettings = {
    showAllOpen: false,
    numberType: true, // días, false número de tareas
    numberOfTaskToShow: 7,
  };

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUserSettings();
  }

  private loadUserSettings(): void {
    const userData = this.userService.getUserData();
    //console.log('Localstorage userData:', userData);
    //console.log('Localstorage:', userData?.settings);
    if (userData) {
      this.userSettings = {
        showAllOpen: userData.settings.showAllOpen,
        numberType: userData.settings.numberType,
        numberOfTaskToShow: userData.settings.numberOfTaskToShow,
      };
    }
    //console.log('Settings a usar:', this.userSettings);

    this.loadMainProject();
  }

  private loadMainProject(): void {
    const userId = this.userService.getUserId(); // Obtén el ID del usuario
    if (!userId) {
      console.error('No se encontró un usuario autenticado.');
      return;
    }

    this.projectService.getProjectsByUserId(userId).subscribe({
      next: (projects: ProjectDTO[]) => {
        // Encuentra el proyecto principal
        this.mainProject = projects.find((project: ProjectDTO) => project.main);
        if (this.mainProject) {
          this.loadTasks();
        } else {
          console.error('No se encontró un proyecto principal.');
          // Aquí podrías crear uno si es necesario
        }
      },
      error: (err: any) => {
        console.error('Error al cargar los proyectos:', err);
      },
    });
  }

  private loadTasks(): void {
    if (this.mainProject?.id_project) {
      this.projectService.getTasks(this.mainProject.id_project).subscribe({
        next: (data) => {
          this.tasks = data;
          this.splitTasks(); // Divide las tareas en "Focus" y "Next"
        },
        error: (err) => {
          console.error('Error al cargar las tareas:', err);
        },
      });
    }
  }

  private splitTasks(): void {
    const today = new Date();
    let limit: number;

    if (this.userSettings.numberType) {
      // Calcula el límite por días
      const dateLimit = new Date(today);
      dateLimit.setDate(today.getDate() + this.userSettings.numberOfTaskToShow);

      this.focusTasks = this.tasks.filter(
        (task) => !task.dini || new Date(task.dini) <= dateLimit
      );
      limit = this.focusTasks.length;
    } else {
      // Calcula el límite por número de tareas
      limit = this.userSettings.numberOfTaskToShow;
      this.focusTasks = this.tasks.slice(0, limit);
    }

    // Resto de tareas para "Next"
    this.nextTasks = this.tasks.slice(limit);
  }

  filterTasks(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.focusTasks.filter((task) =>
      task.task_name.toLowerCase().includes(term)
    );
  }

  addEmptyTask(): void {
    if (this.mainProject?.id_project) {
      const emptyTask: TaskDTO = {
        id_task: 0,
        fk_project: this.mainProject.id_project,
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
          this.tasks.unshift(newTask);
          this.splitTasks(); // Recalcula las listas "Focus" y "Next"

          // Mueve el foco al primer elemento tras actualizar la lista
          setTimeout(() => {
            const firstInput = this.taskNameInputs.first;
            if (firstInput) {
              firstInput.setFocus();
            }
          });
        },
        error: (err) => {
          console.error('Error al añadir la tarea vacía:', err);
        },
      });
    }
  }

  onTaskUpdated(updatedTask: TaskDTO): void {
    const taskIndex = this.tasks.findIndex(
      (task) => task.id_task === updatedTask.id_task
    );

    if (taskIndex !== -1) {
      this.tasks[taskIndex] = updatedTask;
      this.splitTasks(); // Recalcula las listas "Focus" y "Next"
    }
  }

  onTaskDeleted(deletedTask: TaskDTO): void {
    this.tasks = this.tasks.filter(
      (task) => task.id_task !== deletedTask.id_task
    );
    this.splitTasks();
  }

  onTaskMoved(movedTask: TaskDTO): void {
    this.tasks = this.tasks.filter(
      (task) => task.id_task !== movedTask.id_task
    );
    this.splitTasks();
  }

  toggleNextList(): void {
    this.showNext = !this.showNext;
  }
}

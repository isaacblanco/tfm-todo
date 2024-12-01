import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProjectDTO } from '../../../core/models/project-DTO';
import { TaskDTO } from '../../../core/models/task-DTO';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-move-task',
  templateUrl: './move-task.component.html',
  styleUrls: ['./move-task.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MoveTaskComponent implements OnInit {
  @Input() task!: TaskDTO; // Recibe la tarea desde el componente padre
  currentProjectName: string = '';
  otherProjects: ProjectDTO[] = [];

  constructor(
    private modalController: ModalController,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    if (!this.task || !this.task.id_task) {
      console.error('La tarea no es válida o no se proporcionó.');
      this.dismissModal();
      return;
    }
    this.loadProjects();
  }

  /**
   * Carga la lista de proyectos y filtra el proyecto actual
   */
  private loadProjects(): void {
    this.projectService.projects$.subscribe({
      next: (projects) => {
        // Encuentra el nombre del proyecto actual
        const currentProject = projects.find(
          (project) => project.id_project === this.task.fk_project
        );
        this.currentProjectName = currentProject?.name || 'Desconocido';

        // Filtra el proyecto actual para mostrar solo otros proyectos
        this.otherProjects = projects.filter(
          (project) => project.id_project !== this.task.fk_project
        );
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
      },
    });
  }

  /**
   * Mueve la tarea al proyecto seleccionado
   * @param projectId - ID del proyecto al que se moverá la tarea
   */
  moveTaskToProject(projectId: number): void {
    const updatedTask = { ...this.task, fk_project: projectId };

    this.taskService.updateTask(this.task.id_task, updatedTask).subscribe({
      next: () => {
        //console.log('Tarea movida correctamente');
        this.modalController.dismiss({
          reload: true,
          updatedTask: { id_task: this.task.id_task, fk_project: projectId },
        }); // Cierra la modal y envía los datos actualizados
      },
      error: (err) => {
        console.error('Error al mover la tarea:', err);
      },
    });
  }

  /**
   * Cierra la ventana modal sin realizar cambios
   */
  dismissModal(): void {
    this.modalController.dismiss({ reload: true });
  }
}

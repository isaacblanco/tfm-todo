import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProjectDTO } from '../../../core/models/project-DTO';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonicModule],
})
export class EditProjectComponent implements OnInit {
  @Input() project: ProjectDTO | null = null; // Datos del proyecto para editar o null para nuevo

  public projectName: string = '';
  public pinned: boolean = false;
  public main: boolean = false;

  constructor(
    private modalController: ModalController,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    if (this.project) {
      this.projectName = this.project.name;
      this.pinned = this.project.pinned;
      this.main = this.project.main;
    }
  }

  saveProject(): void {
    if (!this.projectName.trim()) {
      console.error('El nombre del proyecto es obligatorio');
      return;
    }

    const projectData: ProjectDTO = {
      id_project: this.project?.id_project || 0,
      name: this.projectName,
      pinned: this.pinned,
      main: this.main,
      fk_user: this.project?.fk_user || 0,
    };

    const request = this.project
      ? this.projectService.updateProject(this.project.id_project, projectData)
      : this.projectService.addProject(projectData);

    request.subscribe({
      next: () => {
        console.log('Proyecto guardado correctamente');
        this.modalController.dismiss({ reload: true });
      },
      error: (err) => console.error('Error al guardar el proyecto:', err),
    });
  }

  closeModal(): void {
    this.modalController.dismiss();
  }
}

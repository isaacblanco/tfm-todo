import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
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
  private userId: number | null = 0; // ID del usuario propietario

  constructor(
    private modalController: ModalController,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.project) {
      this.projectName = this.project.name;
      this.pinned = this.project.pinned;
      this.main = this.project.main;
    }

    this.userId = this.userService.getUserId();
  }

  saveProject(): void {
    if (!this.projectName.trim()) {
      console.error('El nombre del proyecto es obligatorio');
      return;
    }

    if (this.userId == null) {
      console.error('User ID not found in localStorage');
      return;
    }

    const projectData: ProjectDTO = {
      id_project: this.project?.id_project || 0,
      name: this.projectName,
      pinned: this.pinned,
      main: this.main,
      fk_user: this.userId == null ? 0 : this.userId,
    };

    console.log('Proyecto a guardar:', projectData);

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

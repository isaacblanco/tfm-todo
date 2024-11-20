import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonItem,
    IonContent,
    IonButtons,
    IonLabel,
    IonTitle,
    IonButton,
    IonToolbar,
    IonHeader,
    FormsModule,
    CommonModule,
  ],
})
export class EditProjectComponent {
  @Input() userId!: number;
  public projectName: string = '';

  constructor(
    private modalController: ModalController,
    private projectService: ProjectService
  ) {}

  addProject(): void {
    if (this.projectName.trim()) {
      this.projectService.addProject(this.projectName, this.userId).subscribe({
        next: () => this.modalController.dismiss({ reload: true }),
        error: (err) => console.error('Error al añadir el proyecto:', err),
      });
    }
  }

  closeModal(): void {
    this.modalController.dismiss();
  }
}

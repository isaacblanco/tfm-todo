import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TaskDTO } from '../../../core/models/task-DTO';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EditDescriptionComponent implements OnInit {
  @Input() task!: TaskDTO; // Recibe los datos de la tarea
  @ViewChild('descriptionInput') descriptionInput!: ElementRef; // Referencia al textarea

  constructor(
    private modalController: ModalController,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    // Poner el foco en el textarea al cargar la página
    setTimeout(() => {
      if (this.descriptionInput?.nativeElement) {
        this.descriptionInput.nativeElement.focus();
      }
    }, 300); // Retraso para asegurarse de que el DOM esté cargado
  }

  /**
   * Cierra la modal sin guardar cambios
   */
  dismiss(): void {
    this.modalController.dismiss();
  }

  /**
   * Actualiza la descripción de la tarea cuando pierde el foco
   */
  updateDescription(): void {
    if (this.task.description) {
      this.taskService
        .updateTask(this.task.id_task, { description: this.task.description })
        .subscribe({
          next: () => {
            //console.log('Descripción actualizada correctamente.');
          },
          error: (err) => {
            console.error('Error al actualizar la descripción:', err);
          },
        });
    }
  }
}

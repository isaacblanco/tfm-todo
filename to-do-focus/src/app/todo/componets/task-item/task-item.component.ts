import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { formatDateTime } from 'src/app/core/utils/date-utils';
import { TaskDTO } from '../../../core/models/task-DTO';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,
})
export class TaskItemComponent implements OnInit {
  @Input() task!: TaskDTO; // Objeto de tarea
  @Input() fk_project!: number; // ID del proyecto (opcional)
  @Output() taskMoved = new EventEmitter<TaskDTO>(); // Emisor para notificar al padre
  @Output() taskUpdated = new EventEmitter<TaskDTO>(); // Para notificar al padre que se actualizó la tarea
  @Output() taskDeleted = new EventEmitter<TaskDTO>(); // Notifica al padre sobre tareas eliminadas

  showDetails = false;
  availableTimes: string[] = []; // Horas disponibles
  selectedTime = '';
  externalDate: string = ''; // Fecha externa para la tarea

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.generateAvailableTimes();

    if (this.task.dini && typeof this.task.dini === 'string') {
      this.task.dini = new Date(this.task.dini);
    }

    if (this.task.dini) {
      this.externalDate = this.task.dini.toISOString().split('T')[0];
      this.selectedTime = this.task.dini.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  formatDate(date: Date | undefined): string {
    return date ? formatDateTime(date) : 'Fecha no disponible';
  }

  /**
   * Llama al servicio para actualizar el nombre de la tarea
   */
  updateTaskName(): void {
    this.updateTask();
  }

  /**
   * Combina externalDate y selectedTime para actualizar dini
   */
  updateDini(): void {
    console.log('updateDini', this.externalDate, this.selectedTime);

    // Usar "23:45:00" si selectedTime no está definido
    const time = this.selectedTime || '23:45';
    const [hours, minutes] = time.split(':').map(Number);

    if (this.externalDate) {
      const newDini = new Date(this.externalDate);

      if (!isNaN(newDini.getTime())) {
        newDini.setHours(hours, minutes);
        // Actualiza la tarea y llama al servicio
        this.task.dini = newDini;
        this.updateTask();
      } else {
        console.error('Fecha inválida:', this.externalDate);
      }
    } else {
      console.error('Fecha externa no proporcionada.');
    }
  }

  /**
   * Genera horas disponibles para el select (intervalos de 15 minutos).
   */
  private generateAvailableTimes() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        this.availableTimes.push(formattedTime);
      }
    }
  }

  /**
   * Alterna la visibilidad de los detalles.
   */
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  /**
   * Marca o desmarca la tarea como completada.
   */
  toggleCompletion() {
    this.task.completed = !this.task.completed;
    console.log('Task completed:', this.task.completed);
  }

  /**
   * Actualiza la hora de la tarea.
   */
  updateTime(): void {
    if (this.externalDate && this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      const newDini = new Date(this.externalDate);

      if (!isNaN(newDini.getTime())) {
        newDini.setHours(hours, minutes);

        this.task.dini = newDini;
        this.updateTask();
      } else {
        console.error('Fecha inválida:', this.externalDate);
      }
    } else {
      console.error('Fecha o hora no proporcionadas.');
    }
  }

  /**
   * Disminuye el valor de tabs en 1.
   */
  decrementTabs() {
    if (this.task.tabs && this.task.tabs > 0) {
      this.task.tabs--;
      this.updateTask();
    }
  }

  /**
   * Incrementa el valor de tabs en 1.
   */
  incrementTabs() {
    if (this.task.tabs) {
      this.task.tabs++;
      this.updateTask();
    }
  }

  /**
   * Abre el modal de selección de etiquetas.
   */
  async openSelectLabelsModal() {
    const modal = await this.modalController.create({
      component: await import(
        '../../modals/select-labels/select-labels.component'
      ).then((m) => m.SelectLabelsComponent),
      componentProps: { task: this.task },
    });
    await modal.present();
  }

  /**
   * Abre el modal para mover una tarea.
   */
  async openMoveTaskModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: await import(
        '../../modals/move-task/move-task.component'
      ).then((m) => m.MoveTaskComponent),
      componentProps: { task: this.task, fk_project: this.fk_project },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.updatedTask) {
        const updatedTask = result.data.updatedTask;

        // Emitir evento al padre con la tarea actualizada
        this.taskMoved.emit(updatedTask);
      }
    });

    await modal.present();
  }

  /**
   * Abre el modal para editar la descripción.
   */
  async openEditDescriptionModal() {
    const modal = await this.modalController.create({
      component: await import(
        '../../modals/edit-description/edit-description.component'
      ).then((m) => m.EditDescriptionComponent),
      componentProps: { task: this.task },
    });
    await modal.present();
  }

  /**
   * Abre el modal de selección de fechas.
   */
  async openSelectDateModal() {
    const modal = await this.modalController.create({
      component: await import(
        '../../modals/select-date/select-date.component'
      ).then((m) => m.SelectDateComponent),
      componentProps: { task: this.task },
    });
    await modal.present();
  }

  /**
   * Establece la prioridad de la tarea.
   */
  setPriority(priority: number) {
    this.task.priority = priority;
    this.updateTask();
  }

  /**
   * Actualiza la fecha de inicio (dini) en la base de datos
   * @param event - Evento que contiene el valor actualizado
   */
  updateTaskDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newDate = input.value;

    if (newDate) {
      this.task.dini = new Date(newDate);
      this.updateTask();
    }
  }

  updateTask() {
    if (this.task.id_task) {
      this.taskService.updateTask(this.task.id_task, this.task).subscribe({
        next: () => {
          console.log(
            `Task actualizada ${this.task} para la tarea ${this.task.id_task}`
          );
          this.taskUpdated.emit(this.task); // Notifica al componente padre del cambio
        },
        error: (err) => {
          console.error('Error al actualizar la tarea:', err);
        },
      });
    }
  }

  /**
   * Borra la tarea tras confirmar.
   */
  async deleteTask() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.taskService.deleteTask(this.task.id_task).subscribe({
              next: () => {
                console.log(`Tarea eliminada: ${this.task.id_task}`);
                // Emitir evento específico para eliminación
                this.taskDeleted.emit(this.task);
              },
              error: (err) => {
                console.error('Error al eliminar la tarea:', err);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonReorder,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { UserService } from 'src/app/core/services/user.service';
import { formatDateTime } from 'src/app/core/utils/date-utils';
import { TaskDTO } from '../../../core/models/task-DTO';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  imports: [FormsModule, CommonModule, IonItemSliding, IonItem, IonReorder, 
    IonLabel, IonIcon, IonItemOptions, IonItemOption, IonButton, IonLabel,
    IonSelectOption, IonCheckbox, IonInput,IonSelect, IonItemDivider],
  standalone: true,
})
export class TaskItemComponent implements OnInit {

  @Input() task!: TaskDTO; // Objeto de tarea
  @Input() fk_project!: number; // ID del proyecto (opcional)
  @Output() taskMoved = new EventEmitter<TaskDTO>(); // Emisor para notificar al padre
  @Output() taskUpdated = new EventEmitter<TaskDTO>(); // Para notificar al padre que se actualizó la tarea
  @Output() taskDeleted = new EventEmitter<TaskDTO>(); // Notifica al padre sobre tareas eliminadas

  user: any = null; // Usuario actual
  showCompleted = false; 
  showDesctiption = false;
  showDetails = false;
  availableTimes: string[] = []; // Horas disponibles
  selectedTime = '';
  externalDate: string = ''; // Fecha externa para la tarea
  loading: boolean = false; // Por si queremos bloquear el formularios

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private taskService: TaskService,
    private userService: UserService
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

    // Control de la tabulación por defecto
    if (this.task.tabs === undefined || this.task.tabs === null) {
      this.task.tabs = 0; // Valor por defecto
    }
    if (isNaN(this.task.tabs)) {
      this.task.tabs = 0;
    }

    // Control de la descripcion
    if (this.task.description === undefined || this.task.description === null) {
      this.task.description = '';
    }

    // Mostrar o no la descripción
    this.user = this.userService.getUserData();
    if (this.user) {
      if (this.user.settings !== undefined && this.user.settings !== null) {
        this.showDesctiption = this.user.settings.showDescription;
        this.showCompleted = this.user.settings.showCompleted;
      }
    }
  }

  formatDate(date: Date | undefined): string {
    return date ? formatDateTime(date) : 'Fecha no disponible';
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
   * Llama al servicio para actualizar el nombre de la tarea
   */
  updateTaskName(): void {
    this.updateTask();
  }

  /**
   * Combina externalDate y selectedTime para actualizar dini
   */
  updateDini(): void {
    //console.log('updateDini', this.externalDate, this.selectedTime);

    // Si no hay una hora seleccionada, usar la hora predeterminada 10:00
    const time = this.selectedTime || '10:00';

    // Actualizar también el valor en selectedTime
    if (!this.selectedTime) {
      this.selectedTime = '10:00';
    }

    const [hours, minutes] = time.split(':').map(Number);

    // Verificar que externalDate esté completo (no vacío o inválido)
    if (this.externalDate && this.externalDate.split('-').length === 3) {
      const newDini = new Date(this.externalDate);

      // Validar que el año sea mayor a 2020
      if (!isNaN(newDini.getTime()) && newDini.getFullYear() > 2020) {
        newDini.setHours(hours, minutes);

        // Actualizar la fecha solo si es válida y cumple con los criterios
        this.task.dini = newDini;
        //console.log('Fecha y hora actualizadas:', this.task.dini);

        // Llama al servicio para actualizar la tarea
        this.updateTask();
      } else {
        console.error(
          'Fecha inválida o el año es menor o igual a 2020:',
          this.externalDate
        );
      }
    } else {
      console.error('Fecha incompleta, no se actualiza.');
    }
  }

  /*
   * Se actualiza el tiempo de la tarea
   */
  updateTime(): void {
    //console.log('updateTime', this.selectedTime, this.externalDate);

    // Si no se selecciona una hora, usar el valor predeterminado 10:00
    if (!this.selectedTime) {
      this.selectedTime = '10:00';
    }

    const [hours, minutes] = this.selectedTime.split(':').map(Number);

    // Solo actualizar si externalDate es válido, completo y el año es mayor a 2020
    if (this.externalDate && this.externalDate.split('-').length === 3) {
      const newDini = new Date(this.externalDate);

      if (!isNaN(newDini.getTime()) && newDini.getFullYear() > 2020) {
        newDini.setHours(hours, minutes);

        // Actualizar la fecha y hora solo si es válida
        this.task.dini = newDini;
        //console.log('Hora actualizada:', this.task.dini);

        // Llama al servicio para actualizar la tarea
        this.updateTask();
      } else {
        console.error(
          'Fecha inválida o el año es menor o igual a 2020:',
          this.externalDate
        );
      }
    } else {
      console.error('Fecha incompleta, no se actualiza la hora.');
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
    this.updateTask();
    console.log('Task completion toggled:', this.task.completed);
  }

  handleCompletionChange(event: any) {
    this.loading = true;
    // Si el evento viene del checkbox, usa event.detail.checked
    // Si no, asume que es el botón de completar y usa el valor opuesto al actual
    const newValue = event.detail?.checked !== undefined ? 
      event.detail.checked : 
      !this.task.completed;
    
    if (this.task.id_task) {
      const updatedTask = { ...this.task, completed: newValue };
      
      this.taskService.updateTask(this.task.id_task, updatedTask).subscribe({
        next: () => {
          this.task.completed = newValue;
          console.log(`Task completada: ${this.task.id_task}, valor: ${newValue}`);
          this.taskUpdated.emit(this.task);
        },
        error: (err) => {
          console.error('Error al actualizar el estado de la tarea:', err);
          // Ya no necesitamos manipular directamente el target
          this.task.completed = !newValue; // Revertimos el estado en caso de error
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  /**
   * Disminuye el valor de tabs en 1.
   */
  decrementTabs() {
    if (this.task.tabs !== undefined && this.task.tabs > 0) {
      this.task.tabs--;
      this.updateTask();
    }
  }

  /**
   * Incrementa el valor de tabs en 1.
   */
  incrementTabs() {
    if (this.task.tabs !== undefined && this.task.tabs < 5) {
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

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.updatedTask) {
        this.task = result.data.updatedTask;

        // Sincroniza los datos actualizados con los inputs externos
        if (this.task.dini) {
          this.externalDate = new Date(this.task.dini)
            .toISOString()
            .split('T')[0];
          this.selectedTime = new Date(this.task.dini).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
        } else {
          this.externalDate = '';
          this.selectedTime = '';
        }
        //console.log('Tarea actualizada desde la modal:', this.task);
      }
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

  /* Función generica para actualizar la tarea */
  updateTask() {
    if (this.task.id_task) {
      this.loading = true;
      this.taskService.updateTask(this.task.id_task, this.task).subscribe({
        next: () => {
          console.log(`Task actualizada: ${this.task.id_task}, completada: ${this.task.completed}`);
          this.taskUpdated.emit(this.task);
        },
        error: (err) => {
          console.error('Error al actualizar la tarea:', err);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  clearDates() {
    this.task.dini = null;
    this.task.dfin = null;
    this.externalDate = ''; // Limpia el input de la fecha externa
    this.selectedTime = ''; // Limpia el tiempo seleccionado
    //console.log('Fechas y horas borradas.');
    this.updateTask();
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
                //console.log(`Tarea eliminada: ${this.task.id_task}`);
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

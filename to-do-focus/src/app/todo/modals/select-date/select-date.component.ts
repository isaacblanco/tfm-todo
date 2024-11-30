import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TaskService } from 'src/app/core/services/task.service';
import { TaskDTO } from '../../../core/models/task-DTO';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class SelectDateComponent implements OnInit {
  @Input() task!: TaskDTO; // Recibe la tarea desde el componente padre

  availableTimes: string[] = []; // Horas disponibles
  externalStartDate: string = ''; // Fecha externa para la fecha de inicio
  externalEndDate: string = ''; // Fecha externa para la fecha de fin
  startTime: string = ''; // Hora seleccionada para la fecha de inicio
  endTime: string = ''; // Hora seleccionada para la fecha de fin

  constructor(
    private modalController: ModalController,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.generateAvailableTimes();

    // Inicializar las fechas y horas externas
    if (this.task.dini) {
      const dini = new Date(this.task.dini);
      this.externalStartDate = dini.toISOString().split('T')[0];
      this.startTime = dini.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (this.task.dfin) {
      const dfin = new Date(this.task.dfin);
      this.externalEndDate = dfin.toISOString().split('T')[0];
      this.endTime = dfin.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  /**
   * Genera las horas disponibles en intervalos de 15 minutos
   */
  private generateAvailableTimes(): void {
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
   * Actualiza la fecha de inicio (dini) combinando fecha y hora
   */
  updateDini(): void {
    if (this.externalStartDate && this.startTime) {
      const [hours, minutes] = this.startTime.split(':').map(Number);
      const newDini = new Date(this.externalStartDate);

      if (!isNaN(newDini.getTime())) {
        newDini.setHours(hours, minutes);
        this.task.dini = newDini;
        this.validateDates();
      } else {
        console.error('Fecha de inicio inválida:', this.externalStartDate);
      }
    }
  }

  /**
   * Actualiza la fecha de fin (dfin) combinando fecha y hora
   */
  /**
   * Actualiza la fecha de fin (dfin) combinando fecha y hora
   */
  updateDfin(): void {
    if (this.externalEndDate && this.endTime) {
      const [hours, minutes] = this.endTime.split(':').map(Number);
      const newDfin = new Date(this.externalEndDate);

      if (!isNaN(newDfin.getTime())) {
        newDfin.setHours(hours, minutes);
        this.task.dfin = newDfin;
        this.validateDates();

        // Llama al servicio para actualizar la tarea
        this.updateTaskService();
      } else {
        console.error('Fecha de fin inválida:', this.externalEndDate);
      }
    }
  }

  /**
   * Llama al servicio para actualizar la tarea en la base de datos
   */
  updateTaskService(): void {
    if (this.task.id_task) {
      this.taskService.updateTask(this.task.id_task, this.task).subscribe({
        next: () => {
          console.log('Tarea actualizada correctamente en el servidor.');
        },
        error: (err) => {
          console.error('Error al actualizar la tarea en el servidor:', err);
        },
      });
    } else {
      console.error('ID de tarea no disponible para la actualización.');
    }
  }

  /**
   * Valida las fechas para asegurarse de que dfin no sea menor que dini
   */
  validateDates(): void {
    if (this.task.dini && this.task.dfin && this.task.dfin < this.task.dini) {
      const temp = this.task.dini;
      this.task.dini = this.task.dfin;
      this.task.dfin = temp;
    }
  }

  /**
   * Guarda los cambios y cierra la modal
   */
  saveChanges(): void {
    this.modalController.dismiss({
      updatedTask: this.task,
    });
  }

  /**
   * Cierra la modal sin guardar cambios
   */
  dismissModal(): void {
    this.modalController.dismiss();
  }
}

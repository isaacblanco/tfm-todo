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
    } else {
      this.startTime = '10:00'; // Hora predeterminada si no hay hora
    }

    if (this.task.dfin) {
      const dfin = new Date(this.task.dfin);
      this.externalEndDate = dfin.toISOString().split('T')[0];
      this.endTime = dfin.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      this.endTime = '23:45'; // Hora predeterminada para la fecha de fin
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
    if (this.isValidDate(this.externalStartDate)) {
      const time = this.startTime || '10:00'; // Usar 10:00 si no hay hora seleccionada
      const [hours, minutes] = time.split(':').map(Number);
      const newDini = new Date(this.externalStartDate);

      newDini.setHours(hours, minutes);
      this.task.dini = newDini;
      console.log('Fecha de inicio actualizada:', this.task.dini);
      this.validateDates();
    } else {
      console.warn(
        'Fecha de inicio inválida o el año es menor o igual a 2020:',
        this.externalStartDate
      );
    }
  }

  /**
   * Actualiza la fecha de fin (dfin) combinando fecha y hora
   */
  updateDfin(): void {
    if (this.isValidDate(this.externalEndDate)) {
      const time = this.endTime || '23:45'; // Usar 23:45 si no hay hora seleccionada
      const [hours, minutes] = time.split(':').map(Number);
      const newDfin = new Date(this.externalEndDate);

      newDfin.setHours(hours, minutes);
      this.task.dfin = newDfin;
      console.log('Fecha de fin actualizada:', this.task.dfin);
      this.validateDates();
    } else {
      console.warn(
        'Fecha de fin inválida o el año es menor o igual a 2020:',
        this.externalEndDate
      );
    }
  }

  /**
   * Valida que una fecha sea válida y el año sea mayor que 2020
   * @param dateStr - Fecha en formato string
   * @returns boolean
   */
  private isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date.getFullYear() > 2020;
  }

  /**
   * Valida las fechas para asegurarse de que dfin no sea menor que dini
   */
  validateDates(): void {
    if (this.task.dini && this.task.dfin && this.task.dfin < this.task.dini) {
      const temp = this.task.dini;
      this.task.dini = this.task.dfin;
      this.task.dfin = temp;
      console.warn('Fechas intercambiadas para mantener consistencia.');
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

import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { TaskDTO } from '../../../core/models/task-DTO';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class SelectDateComponent implements OnInit {
  @Input() task!: TaskDTO; // Recibe la tarea desde el componente padre

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  /**
   * Actualiza la fecha de inicio (dini) al cambiar en el ion-datetime
   */
  updateDini(event: any): void {
    this.task.dini = new Date(event.detail.value);
    this.validateDates();
  }

  /**
   * Actualiza la fecha de fin (dfin) al cambiar en el ion-datetime
   */
  updateDfin(event: any): void {
    this.task.dfin = new Date(event.detail.value);
    this.validateDates();
  }

  /**
   * Valida y ajusta las fechas si dfin es menor que dini
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

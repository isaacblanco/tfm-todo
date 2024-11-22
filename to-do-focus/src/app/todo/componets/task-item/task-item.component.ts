import { Component, Input, OnInit } from '@angular/core';
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { TaskDTO } from '../../../core/models/task-DTO';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  imports: [IonLabel, IonItem],
  standalone: true,
})
export class TaskItemComponent implements OnInit {
  @Input() task!: TaskDTO; // Objeto de tarea
  @Input() fk_project!: number; // ID del proyecto (opcional)

  constructor() {}

  ngOnInit() {}
}

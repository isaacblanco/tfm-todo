import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { TaskItemComponent } from '../componets/task-item/task-item.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, IonicModule],
})
export class ProjectPage implements OnInit {
  deleteProject() {
    throw new Error('Method not implemented.');
  }
  openEditProjectModal() {
    throw new Error('Method not implemented.');
  }
  projectId: number | null = null; // Si permites null
  // projectId: number = 0; // Si usas un valor predeterminado
  project: any = null;
  tasks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.projectId = id ? +id : null; // Cambia a `0` si no quieres permitir `null`
      if (this.projectId) {
        this.loadProjectData();
      }
    });
  }

  private loadProjectData(): void {
    if (this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe((data) => {
        this.project = data;
        this.loadTasks();
      });
    }
  }

  private loadTasks(): void {
    if (this.projectId) {
      this.projectService.getTasks(this.projectId).subscribe((data) => {
        this.tasks = data;
      });
    }
  }
}

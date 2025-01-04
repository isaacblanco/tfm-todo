
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProjectUtilsService {

  constructor(
    private router: Router,
  ) { 

  }

  calculateProjectProgress(tasks: { completed: boolean }[]): number {
    if (!tasks || tasks.length === 0) {
      return 0;
    }

    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;

    return Math.round((completedTasks / totalTasks) * 100);
  }

  calculatePendingDays(dfin: Date | null): string {
    if (!dfin) {
      return 'Sin fecha';
    }

    const today = new Date();
    const endDate = new Date(dfin);

    const diffInMilliseconds = endDate.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    return diffInDays < 0 ? 'Atrasada' : `${diffInDays} días`;
  }

  showList( projectId: number | null = null ) {
    if (projectId !== null) {
      this.router.navigate([`/todo/project/${projectId}`], {
        replaceUrl: true,
      });
    } else {
      console.error('No se puede navegar, el ID del proyecto es nulo.');
    }
  }

  showKanban(projectId: number | null = null) {
    if (projectId !== null) {
      this.router.navigate([`todo/project-kanban/${projectId}`], {
        replaceUrl: true,
      });
    } else {
      console.error('No se puede navegar, el ID del proyecto es nulo.');
    }
  }
  
  showTimeline(projectId: number | null = null) {
    if (projectId !== null) {
      this.router.navigate([`todo/project-timeline/${projectId}`], {
        replaceUrl: true,
      });
    } else {
      console.error('No se puede navegar, el ID del proyecto es nulo.');
    }
  }

}

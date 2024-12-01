export interface TaskDTO {
  id_task: number;
  fk_project: number;
  task_name: string;
  completed: boolean;
  dini: Date | null | undefined;
  dfin: Date | null | undefined;
  description?: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE';
  tabs?: number; // 0..3
  priority: number;
}

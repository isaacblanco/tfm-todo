import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/tasks/entities/task.entity";
import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  // Obtener tareas asociadas a un proyecto por su ID
  async getTasksByProject(projectId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { fk_project: projectId },
      order: { dini: "ASC" }, // Orden opcional por fecha de inicio (ascendente)
    });
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { fk_user: userId },
      order: {
        pinned: "DESC", // Primero los proyectos con pinned = true
        name: "ASC", // Luego orden alfabético por nombre
      },
    });
  }

  async getAll(): Promise<Project[]> {
    return this.projectRepository.find({
      order: {
        pinned: "DESC", // Primero los proyectos con pinned = true
        name: "ASC", // Luego orden alfabético por nombre
      },
    });
  }

  async create(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }
  async getById(id_project: number): Promise<Project | undefined> {
    return this.projectRepository.findOne({ where: { id_project } }); // Cambiar "id" por "id_project"
  }

  async update(
    id_project: number,
    project: Partial<Project>
  ): Promise<Project> {
    await this.projectRepository.update(id_project, project); // Cambiar "id" por "id_project"
    return this.getById(id_project);
  }

  async delete(id_project: number): Promise<void> {
    await this.projectRepository.delete(id_project); // Cambiar "id" por "id_project"
  }
}

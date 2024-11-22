import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { fk_user: userId },
    });
  }

  async getAll(): Promise<Project[]> {
    return this.projectRepository.find();
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

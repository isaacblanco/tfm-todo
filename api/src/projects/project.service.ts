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

  async getById(id: number): Promise<Project | undefined> {
    return this.projectRepository.findOne({ where: { id } });
  }

  async create(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }

  async update(id: number, project: Partial<Project>): Promise<Project> {
    await this.projectRepository.update(id, project);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}

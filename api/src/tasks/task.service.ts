import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "./entities/task.entity";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  async getAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getById(id: number): Promise<Task | undefined> {
    return this.taskRepository.findOne({ where: { id } });
  }

  async create(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }

  async update(id: number, task: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, task);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}

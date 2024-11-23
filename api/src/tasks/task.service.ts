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

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: ["tags"], // Incluye relaciones si es necesario
    });
  }

  async getById(id: number): Promise<Task | undefined> {
    return this.taskRepository.findOne({ where: { id } });
  }

  async create(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }
  async update(id: number, task: Partial<Task>): Promise<Task> {
    // Cambiar "id" por "id_task" en la consulta
    const existingTask = await this.taskRepository.findOne({
      where: { id_task: id },
    });

    if (!existingTask) {
      throw new Error(`Task with ID ${id} not found`);
    }

    await this.taskRepository.update({ id_task: id }, task); // Cambiar "id" por "id_task"

    const updatedTask = await this.taskRepository.findOne({
      where: { id_task: id },
    });

    if (!updatedTask) {
      throw new Error(`Error retrieving updated task with ID ${id}`);
    }

    return updatedTask;
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { Task } from "./entities/task.entity";
import { TaskService } from "./task.service";

@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll(@Res() response: Response): void {
    this.taskService
      .getAll()
      .then((tasks) => response.status(200).json(tasks))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error fetching tasks", error: err })
      );
  }

  @Get(":id")
  getById(@Param("id") id: number, @Res() response: Response): void {
    this.taskService
      .getById(id)
      .then((task) => response.status(200).json(task))
      .catch((err) =>
        response.status(404).json({ message: "Task not found", error: err })
      );
  }

  @Post()
  create(@Body() task: Task, @Res() response: Response): void {
    this.taskService
      .create(task)
      .then((newTask) => response.status(201).json(newTask))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error creating task", error: err })
      );
  }

  @Put(":id")
  async update(
    @Param("id") id: string, // El ID de la URL es recibido como string
    @Body() task: Partial<Task>,
    @Res() response: Response
  ): Promise<void> {
    try {
      const idNumber = parseInt(id, 10); // Convertir id_in_url a número

      if (task.id_task && task.id_task !== idNumber) {
        // Validar que los IDs coincidan
        response.status(400).json({
          message: "The ID in the URL does not match the ID in the body",
          details: {
            id_in_url: idNumber,
            id_in_body: task.id_task,
          },
        });
        return;
      }

      const updatedTask = await this.taskService.update(idNumber, task);
      response.status(200).json(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err.message);
      response
        .status(500)
        .json({ message: "Error updating task", error: err.message });
    }
  }

  @Delete(":id")
  delete(@Param("id") id: number, @Res() response: Response): void {
    this.taskService
      .delete(id)
      .then(() => response.status(204).send())
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error deleting task", error: err })
      );
  }
}

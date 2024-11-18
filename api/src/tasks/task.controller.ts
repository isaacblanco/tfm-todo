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
  update(
    @Param("id") id: number,
    @Body() task: Partial<Task>,
    @Res() response: Response
  ): void {
    this.taskService
      .update(id, task)
      .then((updatedTask) => response.status(200).json(updatedTask))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error updating task", error: err })
      );
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

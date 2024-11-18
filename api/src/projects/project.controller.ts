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
import { Project } from "./entities/project.entity";
import { ProjectService } from "./project.service";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getAll(@Res() response: Response): void {
    this.projectService
      .getAll()
      .then((projects) => response.status(200).json(projects))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error fetching projects", error: err })
      );
  }

  @Get(":id")
  getById(@Param("id") id: number, @Res() response: Response): void {
    this.projectService
      .getById(id)
      .then((project) => response.status(200).json(project))
      .catch((err) =>
        response.status(404).json({ message: "Project not found", error: err })
      );
  }

  @Post()
  create(@Body() project: Project, @Res() response: Response): void {
    this.projectService
      .create(project)
      .then((newProject) => response.status(201).json(newProject))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error creating project", error: err })
      );
  }

  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() project: Partial<Project>,
    @Res() response: Response
  ): void {
    this.projectService
      .update(id, project)
      .then((updatedProject) => response.status(200).json(updatedProject))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error updating project", error: err })
      );
  }

  @Delete(":id")
  delete(@Param("id") id: number, @Res() response: Response): void {
    this.projectService
      .delete(id)
      .then(() => response.status(204).send())
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error deleting project", error: err })
      );
  }
}

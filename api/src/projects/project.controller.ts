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

  @Get("user/:id_user")
  async getProjectsByUser(
    @Param("id_user") id_user: number
  ): Promise<Project[]> {
    return this.projectService.getProjectsByUser(id_user);
  }

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
  getById(@Param("id") id_project: number, @Res() response: Response): void {
    this.projectService
      .getById(id_project)
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
    @Param("id") id_project: number,
    @Body() project: Partial<Project>,
    @Res() response: Response
  ): void {
    this.projectService
      .update(id_project, project)
      .then((updatedProject) => response.status(200).json(updatedProject))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error updating project", error: err })
      );
  }

  @Delete(":id")
  delete(@Param("id") id_project: number, @Res() response: Response): void {
    this.projectService
      .delete(id_project)
      .then(() => response.status(204).send())
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error deleting project ", error: err })
      );
  }
}

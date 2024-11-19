import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { Task } from "./tasks/entities/task.entity";
import { TaskController } from "./tasks/task.controller";
import { TaskService } from "./tasks/task.service";

import { Project } from "./projects/entities/project.entity";
import { ProjectController } from "./projects/project.controller";
import { ProjectService } from "./projects/project.service";

import { Tag } from "./tags/entities/tag.entity";
import { TagController } from "./tags/tag.controller";
import { TagService } from "./tags/tag.service";

import { User } from "./users/entities/user.entity";
import { UserController } from "./users/user.controller";
import { UserService } from "./users/user.service";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Task, Project, Tag, User]),
  ],
  controllers: [
    AppController,
    TaskController,
    ProjectController,
    TagController,
    UserController,
  ],
  providers: [AppService, TaskService, ProjectService, TagService, UserService],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Message } from "./messages/entities/message.entity";
import { MessagesController } from "./messages/messages.controller";
import { MessagesService } from "./messages/services/messages.service";

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
    TypeOrmModule.forFeature([Message, Task, Project, Tag, User]),
  ],
  controllers: [
    AppController,
    MessagesController,
    TaskController,
    ProjectController,
    TagController,
    UserController,
  ],
  providers: [
    AppService,
    MessagesService,
    TaskService,
    ProjectService,
    TagService,
    UserService,
  ],
})
export class AppModule {}

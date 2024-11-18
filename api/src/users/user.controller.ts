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
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(@Res() response: Response): void {
    this.userService
      .getAll()
      .then((users) => response.status(200).json(users))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error fetching users", error: err })
      );
  }

  @Get(":id")
  getById(@Param("id") id: number, @Res() response: Response): void {
    this.userService
      .getById(id)
      .then((user) => response.status(200).json(user))
      .catch((err) =>
        response.status(404).json({ message: "User not found", error: err })
      );
  }

  @Post()
  create(@Body() user: User, @Res() response: Response): void {
    this.userService
      .create(user)
      .then((newUser) => response.status(201).json(newUser))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error creating user", error: err })
      );
  }

  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() user: Partial<User>,
    @Res() response: Response
  ): void {
    this.userService
      .update(id, user)
      .then((updatedUser) => response.status(200).json(updatedUser))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error updating user", error: err })
      );
  }

  @Delete(":id")
  delete(@Param("id") id: number, @Res() response: Response): void {
    this.userService
      .delete(id)
      .then(() => response.status(204).send())
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error deleting user", error: err })
      );
  }
}

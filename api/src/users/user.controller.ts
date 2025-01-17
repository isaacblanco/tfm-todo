import {
  BadRequestException,
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

  // LOGIN
  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string
  ): Promise<{ message: string; user?: Partial<User> }> {
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const user = await this.userService.validateUser(email, password);
    if (!user) {
      return { message: "Invalid email or password" };
    }

    const { password: _, ...userWithoutPassword } = user;
    return { message: "Login successful", user: userWithoutPassword };
  }

  // REGISTER (Alias for Create)
  @Post("register")
  async register(@Body() user: User, @Res() response: Response): Promise<void> {
    try {
      const newUser = await this.userService.create(user);
      response.status(201).json(newUser);
    } catch (err) {
      console.error("Error registering user:", err.message);
      response
        .status(500)
        .json({ message: "Error registering user", error: err.message });
    }
  }

  // GET ALL USERS
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  // GET USER BY ID
  @Get(":id")
  async getById(
    @Param("id") id_user: string,
    @Res() response: Response
  ): Promise<void> {
    const userId = parseInt(id_user, 10);
    if (isNaN(userId)) {
      response.status(400).json({ message: `Invalid user ID: ${id_user}` });
      return;
    }

    try {
      const user = await this.userService.getById(userId);
      if (!user) {
        response
          .status(404)
          .json({ message: `User not found with ID ${userId}` });
        return;
      }
      response.status(200).json(user);
    } catch (err) {
      response.status(500).json({ message: "Error fetching user", error: err });
    }
  }

  // CREATE USER
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

  // UPDATE USER
  @Put(":id")
  update(
    @Param("id") id_user: number,
    @Body() user: Partial<User>,
    @Res() response: Response
  ): void {
    this.userService
      .update(id_user, user)
      .then((updatedUser) => response.status(200).json(updatedUser))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error updating user", error: err })
      );
  }

  // DELETE USER
  @Delete(":id")
  delete(@Param("id") id_user: number, @Res() response: Response): void {
    this.userService
      .delete(id_user)
      .then(() => response.status(204).send())
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error deleting user", error: err })
      );
  }
}

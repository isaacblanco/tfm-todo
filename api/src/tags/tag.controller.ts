import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { Tag } from "./entities/tag.entity";
import { TagService } from "./tag.service";

@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getAll(@Res() response: Response): void {
    this.tagService
      .getAll()
      .then((tags) => response.status(200).json(tags))
      .catch((err) =>
        response
          .status(500)
          .json({ message: "Error fetching tags", error: err })
      );
  }

  @Post()
  create(@Body() tag: Tag, @Res() response: Response): void {
    this.tagService
      .create(tag)
      .then((newTag) => response.status(201).json(newTag))
      .catch((err) =>
        response.status(500).json({ message: "Error creating tag", error: err })
      );
  }

  @Delete(":id")
  delete(@Param("id") id: number, @Res() response: Response): void {
    this.tagService
      .delete(id)
      .then(() => response.status(204).send())
      .catch((err) =>
        response.status(500).json({ message: "Error deleting tag", error: err })
      );
  }
}

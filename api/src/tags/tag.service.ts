import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tag } from "./entities/tag.entity";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) {}

  async getAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async create(tag: Tag): Promise<Tag> {
    return this.tagRepository.save(tag);
  }

  async delete(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }
}

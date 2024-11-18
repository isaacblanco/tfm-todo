import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}

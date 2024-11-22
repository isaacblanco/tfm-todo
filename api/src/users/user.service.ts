import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
/* import * as bcrypt from "bcryptjs"; */
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null; // Usuario no encontrado
    }

    // Validar contraseña
    // const isPasswordValid = await bcrypt.compare(password, user.password); // Si las contraseñas están cifradas
    // Si no usas cifrado:
    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      return null; // Contraseña incorrecta
    }

    return user; // Usuario válido
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getById(id_user: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id_user } });
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(id_user: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id_user, user);
    return this.getById(id_user);
  }

  async delete(id_user: number): Promise<void> {
    await this.userRepository.delete(id_user);
  }
}

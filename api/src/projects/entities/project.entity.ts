import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "../../tasks/entities/task.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ default: false })
  pinned: boolean;

  @Column({ default: false })
  main: boolean;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}

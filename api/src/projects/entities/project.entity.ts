import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "../../tasks/entities/task.entity";
import { User } from "../../users/entities/user.entity";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id_project: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fk_user" })
  fk_user: User;

  @Column({ length: 100 })
  name: string;

  @Column({ default: false })
  pinned: boolean;

  @Column({ default: false })
  main: boolean;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}

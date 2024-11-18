import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../../tasks/entities/task.entity";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @ManyToMany(() => Task, (task) => task.tags)
  tasks: Task[];
}

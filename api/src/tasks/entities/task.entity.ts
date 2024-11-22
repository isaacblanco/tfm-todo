import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "../../projects/entities/project.entity";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id_task: number;

  @Column()
  fk_project: number;

  @Column({ length: 200 })
  task_name: string;

  @Column({ default: false })
  completed: boolean;

  @Column("timestamp", { nullable: true })
  dini: Date;

  @Column("timestamp", { nullable: true })
  dfin: Date;

  @Column()
  tabs: number;

  @Column("text", { nullable: true })
  description: string;

  @Column()
  priority: number;

  @Column({
    type: "enum",
    enum: ["TO_DO", "IN_PROGRESS", "BLOCKED", "IN_REVIEW", "DONE"],
    default: "TO_DO",
  })
  status: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fk_project" }) // Vincular explicitamente fk_project
  project: Project;
}
